'use strict';

const fs = require('fs'),
    luhn = require('luhn');

module.exports = class {
	constructor(filePath = `${__dirname}/../cards.json`) {
		this._filePath = filePath;
	}

	async getAll() {
		return await this._readFile();
	}

	async create(newCard) {
		let cards = await this._readFile();

		if (!(newCard.cardNumber && newCard.balance) ||
			!luhn.validate(newCard.cardNumber) ||
			cards.some(card => card.cardNumber == newCard.cardNumber)
		) {
			this._throwError(400, 'Bad request');
        }
        
        cards.push(newCard);
        await this._writeFile(cards);
        return newCard;
    }
    
    async delete(id) {
        let cards = await this._readFile(),
            deletingCard = cards[id];

        if(!deletingCard) {
            this._throwError(404, 'Card not found');
        }

        cards.splice(id, 1);
        await this._writeFile(cards);
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
