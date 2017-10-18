'use strict';

const luhn = require('luhn');
const DataModel = require('./DataModel');
const path = require('path');

module.exports = class extends DataModel {
	constructor() {
		super(path.join(__dirname, '/../../data/cards.json'));
	}

	async spend(cardId, amount) {
		const card = await this._getById(cardId);
		amount = this._checkAmount(amount);

		let newBalance = parseInt(card.balance, 10) - amount;
		if (newBalance < 0) this._throwError(400, 'Not anough money');

		await this._update(cardId, {
			balance: newBalance
		});
	}

	async receive(cardId, amount) {
		const card = await this._getById(cardId);
		amount = this._checkAmount(amount);

		let newBalance = parseInt(card.balance, 10) + amount;

		await this._update(cardId, {
			balance: newBalance
		});
	}

	async create(newCard) {
		if (!(newCard.cardNumber && newCard.balance) ||
			!luhn.validate(newCard.cardNumber) ||
			cards.some(card => card.cardNumber == newCard.cardNumber)
		) {
			this._throwError(400, 'Bad request');
		}

		return super.create(newCard)
	}

	_checkAmount(amount) {
		amount = parseInt(amount, 10);
		if (!amount) this._throwError(400, 'Wrond amount');
		return amount
	}

};
