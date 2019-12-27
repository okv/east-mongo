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

Adapter.prototype.getExecutedMigrationNames = function(callback) {
	this.collection.find({}).toArray(function(err, docs) {
		if (err) {
			return callback(err);
		}

		callback(null, docs.map(function(doc) { return doc._id; }));
	});
};

Adapter.prototype.markExecuted = function(name, callback) {
	this.collection.replaceOne({_id: name}, {_id: name}, {upsert: true}, callback);
};

Adapter.prototype.unmarkExecuted = function(name, callback) {
	this.collection.deleteOne({_id: name}, callback);
};

module.exports = Adapter;
