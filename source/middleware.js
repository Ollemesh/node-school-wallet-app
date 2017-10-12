'use strict';

const bodyParser = require('koa-bodyparser'),
	model = require('./controller.js'),
	compose = require('koa-compose');

module.exports = {
	common: compose([
		bodyParser({
			extendTypes: {
				json: ['application/x-javascript']
			}
		}),
		errorHandler
	])
};

async function errorHandler(ctx, next) {
	try {
		await next();
	} catch (err) {

		console.log('ERROR', err.message, err.stack)

		ctx.status = err.status || 500;
		ctx.body = err.message;
	}
}
