'use strict';

const fs = require('fs'),
	luhn = require('luhn');

module.exports = class {
	constructor(filePath = `${__dirname}/../../data/cards.json`) {
		this._filePath = filePath;
	}

	async getAll() {
		return this._get();
	}

	async create(newCard) {
		let cards = await this._readFile();

		if (!(newCard.cardNumber && newCard.balance) ||
			!luhn.validate(newCard.cardNumber) ||
			cards.some(card => card.cardNumber == newCard.cardNumber)
		) {
			this._throwError(400, 'Bad request');
		}

		newCard.id = cards.length;

		cards.push(newCard);
		await this._writeFile(cards);
		return newCard;
	}

	async delete(id) {
		let deletingCard = cards[id];

		if (!deletingCard) {
			this._throwError(404, 'Card not found');
		}

		cards.splice(id, 1);
		await this._writeFile(cards);
	}

	async spend(cardId, amount) {
		const card = await this._getCardById(cardId);
		amount = this._checkAmount(amount);

		let newBalance = parseInt(card.balance, 10) - amount;
		if (newBalance < 0) this._throwError(400, 'Not anough money');

		await this._update({
			id: cardId,
			balance: newBalance
		});
	}

	async receive(cardId, amount) {
		const card = await this._getCardById(cardId);
		amount = this._checkAmount(amount);

		let newBalance = parseInt(card.balance, 10) + amount;

		await this._update({
			id: cardId,
			balance: newBalance
		});
	}

	async _get(cardData) {
		let cards = await this._readFile();;

		for (let prop in cardData) {
			cards = cards.filter(card => card[prop] === cardData[prop]);
		}

		return cards;
	}

	async _update(data) {
		let cards = await this._readFile();

		for (let prop in data) {
			cards.find(card => card.id == data.id)[prop] = data[prop];
		}
		await this._writeFile(cards);
	}

	async _readFile() {
		return await new Promise((resolve, reject) => {
			if (this.cards) resolve(this.cards);
			fs.readFile(this._filePath, 'utf8', (err, cardsData) => {
				if (err) reject(err);
				try {
					resolve(JSON.parse(cardsData));
				} catch (err) {
					reject(err)
				}
			});
		});
	}

	async _writeFile(cards) {
		return await new Promise((resolve, reject) => {
			fs.writeFile(this._filePath, JSON.stringify(cards), (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}

	async _getCardById(cardId) {
		const card = (await this._get({
			id: cardId
		}))[0];
		if (!card) this._throwError(400, 'Wrong card ID');
		return card;
	}

	_checkAmount(amount) {
		amount = parseInt(amount, 10);
		if (!amount) this._throwError(400, 'Wrond amount');
		return amount
	}

	_throwError(status, errorMessage) {
		let error = new Error(errorMessage);
		error.status = status;
		console.log(error.status, error.message);
		throw error;
	}
};
