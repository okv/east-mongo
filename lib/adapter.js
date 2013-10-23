'use strict';

var MongoClient = require('mongodb').MongoClient,
	path = require('path');

function Adapter(params) {
	this.params = params || {};
	if (!this.params.url) throw new Error('`url` parameter required');
}

Adapter.prototype.getTemplatePath = function() {
	return path.join(__dirname, 'migrationTemplate.js');
};

Adapter.prototype.connect = function(callback) {
	var self = this;
	MongoClient.connect(self.params.url, function(err, db) {
		if (err) {callback(err); return;}
		self.db = db;
		self.collection = db.collection('_migrations');
		callback(null, {db: db, dropIndexIfExists: dropIndexIfExists});
	});
};

Adapter.prototype.disconnect = function(callback) {
	this.db.close(callback);
};

Adapter.prototype.getExecutedMigrationNames = function(callback) {
	this.collection.find({}).toArray(function(err, docs) {
		if (err) {callback(err); return;}
		callback(null, docs.map(function(doc) { return doc._id; }));
	});
};

Adapter.prototype.markExecuted = function(name, callback) {
	this.collection.update({_id: name}, {_id: name}, {upsert: true}, callback);
};

Adapter.prototype.unmarkExecuted = function(name, callback) {
	this.collection.remove({_id: name}, callback);
};


/**
 * Helpers which will be exposed to migration
 */

function dropIndexIfExists(collection, index, callback) {
	var indexName = '';
	// convert object to string coz `indexExists` don't recognize objects
	if (typeof index === 'object') {
		for (var key in index) {
			indexName += '_' + key + '_' + index[key];
		}
		indexName = indexName.replace(/^_/, '');
	} else {
		indexName = index;
	}
	collection.indexExists(indexName, function(err, exist) {
		if (err) {callback(err); return;}
		if (exist) {
			collection.dropIndex(indexName, callback);
		} else {
			callback();
		}
	});
}

module.exports = Adapter;
