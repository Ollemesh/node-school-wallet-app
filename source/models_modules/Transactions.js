'use strict';

const fs = require('fs');

module.exports = class {
	constructor(filePath = `${__dirname}/../../data/transactions.json`) {
		this._filePath = filePath;
	}

	async getById(id) {
        this.txs = await this._readFile();
        let tx = this.txs.find(tx => tx.id == id);
        if (!tx) this._throwError(100, 'Transaction not found');
        return tx;
	}

	async getByCardId(id) {
        this.txs = await this._readFile();
        let filtered = this.txs.filter(tx => tx.cardId == id);
        if (!filtered.length) this._throwError(100, 'Transactions not found');
        return filtered;
	}

	async create(newTx) {
		this.txs = await this._readFile();

		if (!(newTx.cardId && newTx.type && newTx.data && newTx.sum)) {
			this._throwError(400, 'Bad request');
        }
		this.txs.push({
			id: this.txs.length,
			cardId: newTx.cardId,
			type: newTx.type,
			data: newTx.data,
			time: new Date(),
			sum: newTx.sum
		})
        await this._writeFile(this.txs);
        return newTx;
    }

    // "id": 1,
    // "cardId": 1,
    // "type": "prepaidCard",
    // "data": "220003000000003",
    // "time": "2017-08-9T05:28:31+03:00",
    // "sum": "2345"

    async remove() {
        this._throwError(400, 'Transaction cannot be removed')
    }

	async _readFile() {
		return await new Promise((resolve, reject) => {
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
                if(err) reject(err);
                resolve();
            });
        });
    }

	_throwError(status, errorMessage) {
		let error = new Error(errorMessage);
		error.status = status;
		console.log(error.status, error.message);
		throw error;
	}
};
