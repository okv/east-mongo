'use strict';

exports.dropIndexIfExists = function(collection, index, callback) {
	let indexName = '';

	return Promise.resolve()
		.then(() => {

			// convert object to string coz `indexExists` don't recognize objects
			if (typeof index === 'object') {
				for (let key in index) {
					indexName += '_' + key + '_' + index[key];
				}
				indexName = indexName.replace(/^_/, '');
			} else {
				indexName = index;
			}

			return collection.indexExists(indexName);
		})
		.then((indexExist) => {
			if (indexExist) {
				return collection.dropIndex(indexName);
			}
		})
		.then(() => {
			if (typeof callback === 'function') {
				callback();
			}
		});
};
