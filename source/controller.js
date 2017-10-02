'use strict';

const models = require('./models.js');

module.exports = {
	getCards: async function (ctx) {
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
	error: async function (req, res, next) {
		throw new Error('Oops!');
	}
};
