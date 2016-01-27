'use strict';

exports.dropIndexIfExists = function(collection, index, callback) {
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
};
