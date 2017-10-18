'use strict';

const models = require('./models.js');
const Joi = require('joi');

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
	getTransactions: async function (ctx) {
		ctx.status = 200;
		ctx.body = await new models.Transactions().getAll();
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
	pay: async function (ctx) {
		let cards = await new models.Cards();
		let txs = await new models.Transactions();

		await cards.spend(ctx.params.id, ctx.request.body.amount)

		await txs.create({
			cardId: ctx.params.id,
			type: 'card2phone',
			data: ctx.request.body.number,
			sum: ctx.request.body.amount
		})

		ctx.status = 200;
		ctx.body = 'OK';
	},
	fill: async function (ctx) {
		let cards = await new models.Cards();
		let txs = await new models.Transactions();

		await cards.receive(ctx.params.id, ctx.request.body.amount)

		await txs.create({
			cardId: ctx.params.id,
			type: 'phone2card',
			data: ctx.request.body.number,
			sum: ctx.request.body.amount
		})

		ctx.status = 200;
		ctx.body = 'OK';
	},
	transfer: async function (ctx) {
		const cards = new models.Cards();
		const txs = new models.Transactions();
		const cardId = ctx.params.id;
		const receiverCardId = ctx.request.body.receiverCardId;
		const amount = ctx.request.body.amount;

		await cards.spend(cardId, amount);
		await cards.receive(receiverCardId, amount);
		await txs.create({
			cardId: cardId,
			type: 'spend',
			data: `transfer to cardId ${receiverCardId}`,
			sum: amount
		});
		await txs.create({
			cardId: receiverCardId,
			type: 'receive',
			data: `transfer from cardId ${cardId}`,
			sum: amount
		});

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
		let {error, value} = Joi.validate(newTx, require('./schemas/transaction.js'));	
		if(error) throw new Error('Wrong transactions data');
		newTx = value;	
		ctx.status = 200;
		ctx.body = await new models.Transactions().create(newTx);
	},
	error: async function (ctx) {
		throw new Error('Oops!');
	}
};
