'use strict';

const models = require('./models.js');

module.exports = {
	getCards: async function (ctx) {
		ctx.status = 200;		
		ctx.body = await new models.Cards().getAll();
		/* 
		    Я создаю экземпляр модели в каждом контроллере, а не в middleware,
		    так как при текущем функционале он всё равно будет создан 1 раз на 1 запрос.
		    Если потребуется при обрабоке одного запроса 
		    вызывать несколькро методов одной модели в разных контроллерах,
		    я зарефакторю чтение и запись файла/бд в middleware, сохраняя экземпляр модели в ctx
		*/
	},
	createCard: async function (ctx) {
		let newCard = ctx.request.body;
		ctx.status = 200;
		ctx.body = await new models.Cards().create(newCard);
	},
	deleteCard: async function (ctx) {
		ctx.status = 200;
		await new models.Cards().delete(ctx.params.id);
		ctx.body = 'OK';
	},
	error: async function (ctx) {
		throw new Error('Oops!');
	},
	pay: async function (ctx) {
		let cards = await new models.Cards();
		let txs = await new models.Transactions();

		await cards.spend({
			id: ctx.params.id,
			amount: ctx.request.body.amount
		})

		await txs.create({
			cardId: ctx.params.id,
			type: 'card2phonec',
			data: ctx.request.body.number,
			sum: ctx.request.body.amount
		})

		ctx.status = 200;
		ctx.body = 'OK';		
	},
	getTransaction: async function (ctx) {
		ctx.status = 200;
		ctx.body = await new models.Transactions().getByCardId(ctx.params.id);
	},
	createTransaction: async function (ctx) {
		let newTx = ctx.request.body;
		newTx.cardId = ctx.params.id;
		ctx.status = 200;
		ctx.body = await new models.Transactions().create(newTx);
	}
};