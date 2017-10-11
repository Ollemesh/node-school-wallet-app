'use strict';

const fs = require('fs'),
    luhn = require('luhn');

module.exports = class {
	constructor(filePath = `${__dirname}/../../cards.json`) {
		this._filePath = filePath;
	}

	async getAll() {
		return await this._readFile();
	}

	async create(newCard) {
		this.cards = await this._readFile();

		if (!(newCard.cardNumber && newCard.balance) ||
			!luhn.validate(newCard.cardNumber) ||
			this.cards.some(card => card.cardNumber == newCard.cardNumber)
		) {
			this._throwError(400, 'Bad request');
		}
		
		newCard.id = this.cards.length;
        
        this.cards.push(newCard);
        await this._writeFile(this.cards);
        return newCard;
    }
    
    async delete(id) {
        this.cards = await this._readFile(),
            deletingCard = this.cards[id];

        if(!deletingCard) {
            this._throwError(404, 'Card not found');
        }

        this.cards.splice(id, 1);
		await this._writeFile(this.cards);
	}

	async spend(data) {
		this.cards = await this._readFile();
		data.amount = this.cards[data.id].balance - data.amount;
		if (data.amount < 0) this._throwError(400, 'Not anough money')
		this._update(data)
	}
	
	async _update(data) {
		this.cards = await this._readFile();
		for (prop in data) {
			this.cards[data.id][prop] = data[prop]
		}
		await this._writeFile(this.cards);		
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
            fs.writeFile(this._filePath, JSON.stringify(this.cards), (err) => {
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
