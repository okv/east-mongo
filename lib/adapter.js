'use strict';

var MongoClient = require('mongodb').MongoClient,
	path = require('path'),
	mongodbUri = require('mongodb-uri'),
	helpers = require('./helpers');

function Adapter(params) {
	this.params = params || {};

	if (!this.params.url) {
		throw new Error('`url` parameter required');
	}

	this.helpers = helpers;
}

Adapter.prototype.getTemplatePath = function() {
	return path.join(__dirname, 'migrationTemplate.js');
};

// mongodb driver 2.x passes `db`, 3.x passes `client` to the
// `MongoClient.connect` callback this method sets clitnt and db
// parsed from this polymorphic parameter
Adapter.prototype._setDbAndClient = function(dbOrClient) {
	if (dbOrClient.collection) {
		this.client = null;

		this.db = dbOrClient;
	} else {
		this.client = dbOrClient;

		var parsedUrl = mongodbUri.parse(this.params.url);
		var dbName = parsedUrl.database || 'admin';

		this.db = this.client.db(dbName);
	}
};

Adapter.prototype.connect = function() {
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

Adapter.prototype.disconnect = function() {
	if (this.client) {
		return this.client.close();
	} else if (this.db) {
		return this.db.close();
	} else {
		return Promise.resolve();
	}
};

Adapter.prototype.getExecutedMigrationNames = function() {
	return Promise.resolve()
		.then(() => this.collection.find({}).toArray())
		.then((docs) => {
			return docs.map((doc) => doc._id);
		});
};

Adapter.prototype.markExecuted = function(name) {
	return this.collection.replaceOne({_id: name}, {_id: name}, {upsert: true});
};

Adapter.prototype.unmarkExecuted = function(name) {
	return this.collection.deleteOne({_id: name});
};

module.exports = Adapter;
