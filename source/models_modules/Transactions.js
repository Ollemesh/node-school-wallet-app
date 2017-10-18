'use strict';

const DataModel = require('./DataModel');
const path = require('path');

module.exports = class extends DataModel {
	constructor() {
		super(path.join(__dirname, '/../../data/transactions.json'))
	}

	async getByCardId(id) {
		return await this._get({
			cardId: id
		})
	}

	async create(newTx) {
		newTx.time = new Date();

		if (!(newTx.cardId && newTx.type && newTx.data && newTx.sum)) {
			this._throwError(400, 'Bad request');
		}

		return super.create(newTx);
	}

	async delete() {
		this._throwError(400, 'Transaction cannot be removed')
	}
};
