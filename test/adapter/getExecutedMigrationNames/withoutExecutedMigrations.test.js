'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;

test('setup', () => {
	adapter = testUtils.createAdapter();
	return adapter.connect();
});

test(
	'adapter getExecutedMigrationNames method without executed migrations',
	(assert) => {
		return adapter.getExecutedMigrationNames()
			.then((names) => {
				assert.deepEqual(names, [], 'should return empty array');
			});
	}
);

test('teardown', () => {
	return adapter.disconnect();
});
