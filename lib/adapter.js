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

Adapter.prototype.connect = function(callback) {
	var self = this;

	MongoClient.connect(
		self.params.url,
		self.params.options || {},
		function(err, dbOrClient) {
			if (err) {
				return callback(err);
			}

			self._setDbAndClient(dbOrClient);

			self.collection = self.db.collection('_migrations');

			callback(null, {
				db: self.db,
				dropIndexIfExists: self.helpers.dropIndexIfExists
			});
		}
	);
};

Adapter.prototype.disconnect = function(callback) {
	if (this.client) {
		this.client.close(callback);
	} else if (this.db) {
		this.db.close(callback);
	} else {
		callback();
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
