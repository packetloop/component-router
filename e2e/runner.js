const puppeteer = require('puppeteer-core');


const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack/e2e.config');


const isHeaded = process.argv.includes('--headed');
const {
  NODE_HOST = '127.0.0.1',
  NODE_PORT = '10000'
} = process.env;


const run = async () => {
  const compiler = Webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, webpackConfig.devServer);

  await new Promise((resolve, reject) => server.listen(NODE_PORT, NODE_HOST, error => {
    if (error) {
      reject(error);
      return;
    }
    console.log(`Starting server on http://${NODE_HOST}:${NODE_PORT}`);
    resolve();
  }));

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: !isHeaded,
    devtools: true
  });

  const [page = await browser.newPage()] = await browser.pages();

  page.on('console', msg => {
    console.log(msg.type(), msg.text());
  });


  let onFinished;
  const testsFinished = new Promise(resolve => {
    onFinished = resolve;
  });


  const listeners = {
    'tapeLog': e => console.log(`e.detail`, e.detail),
    'tapeFinish': () => {
      console.log('FINISHED');
      onFinished();
    }
  };



  await page.goto(`http://${NODE_HOST}:${NODE_PORT}`);
  await page.evaluate(
    ls => {
      Object.keys(ls).forEach(
        event =>
          console.log(`event`, event, ls[event]) ||

        document.body.addEventListener(event, ls[event], false)
      );
    },
    listeners
  );

//  await testsFinished;

//  await page.evaluate(
//    () => new Promise(resolve => {
//      if (document.body.classList.contains('tapeFinished')) {
//        resolve();
//        return;
//      }
//      document.body.addEventListener('onFinish', resolve, false);
//    })
//  );

  if (!isHeaded) {
    await new Promise(resolve => server.close(resolve));
    await browser.close();
  }
};

run();
