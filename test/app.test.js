const app = require('../source/app.js');
const fs = require('fs');
const request = require('supertest');
const path = require('path');
const cardsPath = path.resolve(__dirname,'../data/cards.json');
const txsPath = path.resolve(__dirname,'../data/transactions.json');

describe('REST API testing', () => {
	let cards, txs;

	beforeAll(() => {
		cards = fs.readFileSync(cardsPath);
		txs = fs.readFileSync(txsPath);
		
		fs.writeFileSync(cardsPath, cards, err => {
			throw new Error(err)
		});
		fs.writeFileSync(txsPath, txs, err => {
			throw new Error(err)
		})
		console.log('before')
	})

	afterAll(() => {
		fs.writeFileSync(cardsPath, [], err => {
			throw new Error(err)
		});
		fs.writeFileSync(txsPath, [], err => {
			throw new Error(err)
		})
		console.log('after')
	})

	it('POST /cards'), () => {
		console.log('test')
		test('should has cards list', async() => {
			await expect(
				request(app.listen())
				.get('/cards')
				.then(res => console.log(res))
			).resolves.toBeTruthy();
		})
	}
})
