'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;

test('setup', () => {
	adapter = testUtils.createAdapter();
	return adapter.connect();
});

test('adapter disconnect method with connected adapter', () => {
	return adapter.disconnect();
});
