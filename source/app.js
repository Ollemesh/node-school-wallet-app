'use strict';

const config = require('../config.json'),
	Koa = require('koa'),
	Router = require('koa-router'),
	app = new Koa(),
	router = new Router(),
	controller = require('./controller.js'),
	middleware = require('./middleware.js');

router.get('/cards/', controller.getCards);
router.post('/cards/', controller.createCard);
router.delete('/cards/:id', controller.deleteCard);
router.get('/error', controller.error);

app.use(middleware.common);
app.use(router.routes());

app.listen(config.port);
