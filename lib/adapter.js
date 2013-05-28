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
		callback(null, {db: db});
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

module.exports = Adapter;
