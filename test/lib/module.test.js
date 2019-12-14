'use strict';

const test = require('tape-catch');
const libModule = require('../../lib');
const Adapter = require('../../lib/adapter');
const packageJson = require('../../package.json');


test('module', (t) => {
	t.equal(libModule, Adapter, 'should export adapter class');

	t.equal(
		packageJson.main,
		'lib/index.js',
		'should be set as main in package.json'
	);

	t.end();
});
