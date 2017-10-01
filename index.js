const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	luhn = require('luhn')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use((req, res, next) => {
	req.db = require('./source/cards.json')
	next()
})

app.get('/', (req, res) => {
	res.send(`<!doctype html>
	<html>
		<head>
			<link rel="stylesheet" href="/style.css">
		</head>
		<body>
			<h1>Hello Smolny!</h1>
		</body>
	</html>`)
})

app.get('/cards', (req, res) => {
	res.send(req.db)
})

app.post('/cards', (req, res, next) => {
	let newCard = req.body
	console.log(newCard.cardNumber)
	if (!(newCard.cardNumber && newCard.balance)) {
		res.status(400).send('Bad Request')
		return
	} else if (!luhn.validate(newCard.cardNumber)) {
		res.status(400).send('Wrong Data')
		return
	} else if (req.db.some(card => card.cardNumber == newCard.cardNumber)) {
		res.status(409).send('Conflict')
		return
	}

	req.db.push(newCard)
	req.dbUpdated = true
	req.resData = JSON.stringify(newCard)
	next()
})

app.delete('/cards/:id', (req, res, next) => {
	if (req.db[req.params.id]) {
		req.resData = JSON.stringify(req.db[req.params.id])
		req.dbUpdated = true
		req.db.splice(req.params.id, 1)
		next();
	} else {
		res.status(404).send('Card Not Found')
	}
})

app.get('/error', (req, res) => {
	throw Error('Oops!')
})

app.use((req, res) => {
	if (req.dbUpdated) {
		fs.writeFile('./source/cards.json', JSON.stringify(req.db), (err) => {
			if (err) {
				res.status(500).send('Error writing file')
			} else {
				res.status(200).send(req.resData || '')
			}
		})
	}
	next()
})

app.use((req, res) => {
	res.status(404).send()
})

app.get('/transfer', (req, res) => {
	const {
		amount,
		from,
		to
	} = req.query;
	res.json({
		result: 'success',
		amount,
		from,
		to
	})
})

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!')
})
