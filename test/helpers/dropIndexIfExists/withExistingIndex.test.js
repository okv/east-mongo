'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;

test('setup', () => {
	adapter = testUtils.createAdapter();

	return Promise.resolve()
		.then(() => adapter.connect())
		.then(() => adapter.collection.dropIndexes())
		.then(() => adapter.collection.createIndex({first: 1, second: -1}));
});

test(
	'helpers dropIndexIfExists with existing index',
	(assert) => {
		return Promise.resolve()
			.then(() => {
				return adapter.helpers.dropIndexIfExists(
					adapter.collection,
					{first: 1, second: -1}
				);
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

test('teardown', () => {
	return Promise.resolve()
		.then(() => adapter.collection.dropIndexes())
		.then(() => adapter.disconnect());
});
