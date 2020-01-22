'use strict';

const pathUtils = require('path');
const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;

test('setup', (assert) => {
	adapter = testUtils.createAdapter();

	assert.end();
});

test(
	'adapter getTemplatePath method with suitable params',
	(assert) => {
		const templatePath = pathUtils.relative(
			__dirname,
			adapter.getTemplatePath()
		);

		assert.equal(
			templatePath,
			'../../../lib/migrationTemplates/promises.js',
			'should return path to migration template'
		);

		assert.end();
	}
);
