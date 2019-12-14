'use strict';

const testUtils = require('../utils');

const test = testUtils.test;
let adapter;

test('setup', (assert) => {
	adapter = testUtils.createAdapter();
	assert.end();
});

test('adapter connect method', (assert) => {
	return adapter.connect()
		.then((result) => {
			assert.ok(result.db, 'should return `db`');
			assert.ok(
				result.dropIndexIfExists,
				'should return `dropIndexIfExists`'
			);
		});
});

test('teardown', (assert) => {
	return adapter.disconnect();
});
