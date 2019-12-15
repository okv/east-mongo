'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;

test('setup', (assert) => {
	adapter = testUtils.createAdapter();
	return adapter.connect();
});

test('adapter disconnect method with connected adapter', (assert) => {
	return adapter.disconnect();
});
