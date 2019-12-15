'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;

test('setup', (assert) => {
	adapter = testUtils.createAdapter();
	assert.end();
});

test('adapter disconnect method with connected adapter', (assert) => {
	return adapter.disconnect();
});
