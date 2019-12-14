'use strict';

const test = require('tape-catch');
const testUtils = require('../utils');

let adapter;
let connect;
let disconnect;

test('setup', (assert) => {
	adapter = testUtils.createAdapter();
	assert.end();
});

test('adapter connect method', (assert) => {
	adapter.connect()
		.then((result) => {
			assert.ok(result.db, 'should return `db`');
			assert.ok(
				result.dropIndexIfExists,
				'should return `dropIndexIfExists`'
			);
			assert.end();
		})
		.catch(assert.end);
});

test('teardown', (assert) => {
	adapter.disconnect().then(assert.end).catch(assert.end);
});
