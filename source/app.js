'use strict';

const config = require('../config.json');
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const app = new Koa();
const router = new Router();
const controller = require('./controller.js');
const middleware = require('./middleware.js');
const ReactDOMServer = require('react-dom/server');
const logger = require('../libs/logger.js')('wallet-app');
const https = require('https');
const {renderToStaticMarkup} = require('react-dom/server');
const fs = require('fs');

const DATA = {
	user: {
		login: 'samuel_johnson',
		name: 'Samuel Johnson'
	}
};

function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views', `${viewId}.server.js`);
	delete require.cache[require.resolve(viewPath)];
	return require(viewPath);
}

router.get('/', (ctx) => {
	const indexView = getView('index');
	const indexViewHtml = renderToStaticMarkup(indexView(DATA));

	ctx.body = indexViewHtml;
});

router.get('/cards/', controller.getCards);
router.post('/cards/', controller.createCard);
router.delete('/cards/:id', controller.deleteCard);
router.get('/error', controller.error);

router.get('/transactions/', controller.getTransactions);
router.get('/cards/:id/transactions/', controller.getTransaction);
router.post('/cards/:id/transactions/', controller.createTransaction);

router.post('/cards/:id/pay', controller.pay);
router.post('/cards/:id/transfer', controller.transfer)
router.post('/cards/:id/fill', controller.fill)

app.use(middleware.common);
app.use(router.routes());

app.use(serve('./public'));

app.listen(config.port, () => {
    logger.log('info', 'It\'s alive!')
});

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/key.pem'), 'utf8'),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/cert.pem'), 'utf8')
}

https.createServer(options, app.callback()).listen(config.securePort);

module.exports = app;
