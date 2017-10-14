const app = require('../source/app.js');
const request = require('supertest');

test('should has cards list', async() => {
	await expect(
		request(app.listen())
		.get('/cards')
	).resolves.toBeTruthy();
})
