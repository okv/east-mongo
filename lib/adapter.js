'use strict';

const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const mongodbUri = require('mongodb-uri');
const helpers = require('./helpers');

function Adapter(params) {
	this.params = params || {};

	if (!this.params.url) {
		throw new Error('`url` parameter required');
	}

	this.helpers = helpers;
}

Adapter.prototype.getTemplatePath = function getTemplatePath() {
	return path.join(__dirname, 'migrationTemplate.js');
};

// mongodb driver 2.x returns `db`, 3.x returns `client` as a result of
// `MongoClient.connect`, this method sets client and db parsed from that
// polymorphic result
Adapter.prototype._setDbAndClient = function _setDbAndClient(dbOrClient) {
	if (dbOrClient.collection) {
		this.client = null;

		this.db = dbOrClient;
	} else {
		this.client = dbOrClient;

		const parsedUrl = mongodbUri.parse(this.params.url);
		const dbName = parsedUrl.database || 'admin';

		this.db = this.client.db(dbName);
	}
};

Adapter.prototype.connect = function connect() {
	return Promise.resolve()
		.then(() => MongoClient.connect(this.params.url, this.params.options))
		.then((dbOrClient) => {
			this._setDbAndClient(dbOrClient);
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
