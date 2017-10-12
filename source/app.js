'use strict';

const config = require('../config.json');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const app = new Koa();
const router = new Router();
const controller = require('./controller.js');
const middleware = require('./middleware.js');
const ReactDOMServer = require('react-dom/server');
const logger = require('../libs/logger.js')('wallet-app');

router.get('/cards/', controller.getCards);
router.post('/cards/', controller.createCard);
router.delete('/cards/:id', controller.deleteCard);
router.get('/error', controller.error);

router.get('/cards/:id/transactions/', controller.getTransaction);
router.post('/cards/:id/transactions/', controller.createTransaction);

router.post('/cards/:id/pay', controller.pay);

// console.log(ReactDOMServer.renderToString());

app.use(middleware.common);
app.use(router.routes());

app.use(serve('./public'));

app.listen(config.port, () => {
    logger.log('info', 'It\'s alive!')
});
