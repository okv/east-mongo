'use strict';

const testUtils = require('../../utils');
const helpers = require('../../../lib/helpers');

const test = testUtils.test;
let adapter;

test('setup', (assert) => {
	adapter = testUtils.createAdapter();

	return Promise.resolve()
		.then(() => adapter.connect())
		.then(() => adapter.collection.dropIndexes())
		.then(() => adapter.collection.createIndex({first: 1, second: -1}));
});

test(
	'helpers dropIndexIfExists with existing index and callback',
	(assert) => {
		return Promise.resolve()
			.then(() => {
				return new Promise((resolve, reject) => {
					adapter.helpers.dropIndexIfExists(
						adapter.collection,
						{first: 1, second: -1},
						(err) => {
							if (err) return reject(err);
							resolve();
						}	
					);
				});
			})
			.then(() => adapter.collection.indexes())
			.then((indexes) => {
				assert.equal(
					indexes.length,
					1,
					'should leave only one index'
				);
				assert.deepEqual(
					indexes[0].key,
					{_id: 1},
					'should leave only one index: _id'
				);
			});
	}
);

test('teardown', (assert) => {
	return Promise.resolve()
		.then(() => adapter.collection.dropIndexes())
		.then(() => adapter.disconnect());
});
