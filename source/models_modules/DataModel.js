'use strict';

const fs = require('fs'),
	luhn = require('luhn');

module.exports = class {
	constructor(filePath) {
		super();
		this._filePath = filePath;
	}

	async getAll() {
		return this._get();
	}

	async create(newUnitData) {
		this.units = await this._readFile();
		newUnitData.id = units.length;

		units.push(newUnitData);
		await this._writeFile(units);
		return newUnitData;
	}

	async delete(id) {
		let deletingUnit = units[id];

		if (!deletingUnit) {
			this._throwError(404, 'Data not found');
		}

		units.splice(id, 1);
		await this._writeFile(units);
	}

	async _get(unitData) {
		let units = await this._readFile();

		for (let prop in unitData) {
			 units = units.filter(unit => unit[prop] == unitData[prop]);
		}

		return cards;
	}

	async _getById(id) {
		const unit = (await this._get({
			id: id
		}))[0];
		if (!unit) this._throwError(400, 'Wrong ID');
		return unit;
	}

	async _update(id, updateData) {
		this.units = await this._readFile();

		for (let prop in updateData) {
			this.units.find(unit => unit.id == id)[prop] = updateData[prop]; // this.getById(id)[prop] = updateData[prop]
		}
		await this._writeFile(this.units);
	}

	async _readFile() {
		return await new Promise((resolve, reject) => {
			if (this.units) resolve(this.units);
			fs.readFile(this._filePath, 'utf8', (err, unitsData) => {
				if (err) reject(err);
				try {
					resolve(JSON.parse(unitsData));
				} catch (err) {
					reject(err)
				}
			});
		});
	}

	async _writeFile(units) {
		return await new Promise((resolve, reject) => {
			fs.writeFile(this._filePath, JSON.stringify(units), (err) => {
				if (err) reject(err);
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
