'use strict';

const testUtils = require('../utils');
const pathUtils = require('path');
const fs = require('fs');
const promisify = require('es6-promisify').promisify;

const test = testUtils.test;

test('migrationTemplates', (assert) => {
	const migrationTemplatesPath = pathUtils.resolve(
		__dirname,
		'../../lib/migrationTemplates'
	);
	const requireMigrationTemplate = (filename) => {
		// eslint-disable-next-line import/no-dynamic-require
		require(pathUtils.join(migrationTemplatesPath, filename));
	};
	const readdir = promisify(fs.readdir);
	const nodeMajor = Number(process.versions.node.split('.')[0]);

	return Promise.resolve()
		.then(() => readdir(migrationTemplatesPath))
		.then((filenames) => {
			assert.equal(
				filenames.indexOf('promises.js') !== -1,
				true,
				'should contain promises migration template'
			);
			assert.equal(
				filenames.indexOf('async.js') !== -1,
				true,
				'should contain promises migration template'
			);
			assert.equal(
				filenames.length,
				2,
				'should contain only 2 templates'
			);

			assert.doesNotThrow(
				() => requireMigrationTemplate('promises.js'),
				'promises template should be requireble'
			);
			if (nodeMajor >= 8) {
				assert.doesNotThrow(
					() => requireMigrationTemplate('async.js'),
					'promises template should be requireble'
				);
			} else {
				assert.skip('do not require async template on nodejs < 8');
			}
		});
});
