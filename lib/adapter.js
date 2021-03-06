'use strict';

const MongoClient = require('mongodb').MongoClient;
const mongodbPackageJson = require('mongodb/package.json');
const path = require('path');
const helpers = require('./helpers');

const mongodbMajor = Number(mongodbPackageJson.version.split('.')[0]);

function Adapter(params) {
	this.params = params || {};

	if (!this.params.url) {
		throw new Error('`url` parameter required');
	}

	this.helpers = helpers;
}

Adapter.prototype.getTemplatePath = function getTemplatePath() {
	return path.join(__dirname, 'migrationTemplates', 'promises.js');
};

// mongodb driver 2.x returns `db`, 3.x returns `client` as a result of
// `MongoClient.connect`, this method sets client and db parsed from that
// polymorphic result
Adapter.prototype._setDbAndClient = function _setDbAndClient(connectResult) {
	if (mongodbMajor > 2) {
		this.client = connectResult;

		// `db` without args gets db from uri ("test" if no db at uri)
		this.db = this.client.db();
	} else {
		this.client = null;

		// there db name from uri ("admin" if no db at uri)
		this.db = connectResult;
	}
};

Adapter.prototype.connect = function connect() {
	return Promise.resolve()
		.then(() => MongoClient.connect(this.params.url, this.params.options))
		.then((connectResult) => {
			this._setDbAndClient(connectResult);
			this.collection = this.db.collection('_migrations');

			return {
				db: this.db,
				dropIndexIfExists: this.helpers.dropIndexIfExists
			};
		});
};

Adapter.prototype.disconnect = function disconnect() {
	if (this.client) {
		return this.client.close();
	} else if (this.db) {
		return this.db.close();
	} else {
		return Promise.resolve();
	}
};

Adapter.prototype.getExecutedMigrationNames =
	function getExecutedMigrationNames() {
		return Promise.resolve()
			.then(() => this.collection.find({}).toArray())
			.then((docs) => {
				return docs.map((doc) => doc._id);
			});
	};

Adapter.prototype.markExecuted = function markExecuted(name) {
	return this.collection.replaceOne({_id: name}, {_id: name}, {upsert: true});
};

Adapter.prototype.unmarkExecuted = function unmarkExecuted(name) {
	return this.collection.deleteOne({_id: name});
};

module.exports = Adapter;
