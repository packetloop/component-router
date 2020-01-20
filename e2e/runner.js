const puppeteer = require('puppeteer-core');
const test = require('tape');


const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack/e2e.config');

test('all things', async t => {

  const compiler = Webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, webpackConfig.devServer);

  await new Promise((resolve, reject) => server.listen(10000, '127.0.0.1', error => {
    if (error) {
      reject(error);
      return;
    }
    console.log('Starting server on http://localhost:10000');
    resolve();
  }));

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
//    headless: false,
//    devtools: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:10000');


  const h1 = await page.$('#app .app > h1');
  t.ok(h1);

  t.equal(
    await page.evaluate(e => e.innerHTML, h1),
    'component-router'
  );

  t.ok(await page.$('a.tab[href^="/foo"]'));
  t.ok(await page.$('a.tab[href^="/bar"]'));


  t.equal(
    await page.evaluate(e => e.innerHtml, await page.$('#app .content > h1')),
    'Home'
  );


  page.click('a.tab[href^="/foo"]');


  t.equal(
    await page.evaluate(e => e.innerHtml, await page.$('#app .content > h1')),
    'Foo'
  );


  await new Promise(resolve => server.close(resolve));
  await browser.close();


  t.end();
});
