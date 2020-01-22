'use strict';

const testUtils = require('../utils');
const libModule = require('../../lib');
const Adapter = require('../../lib/adapter');
const packageJson = require('../../package.json');

const test = testUtils.test;

test('module', (assert) => {
	assert.equal(libModule, Adapter, 'should export adapter class');

	assert.equal(
		packageJson.main,
		'lib/index.js',
		'should be set as main in package.json'
	);

	assert.end();
});
