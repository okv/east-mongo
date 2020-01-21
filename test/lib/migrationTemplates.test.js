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
	const tryMigrationTemplate = (filename) => {
		return Promise.resolve()
			// eslint-disable-next-line import/no-dynamic-require
			.then(() => require(pathUtils.join(migrationTemplatesPath, filename)))
			.then((migration) => {
				return Promise.all([
					migration.migrate({}),
					migration.rollback({})
				]);
			});
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

			if (nodeMajor >= 8) {
				return Promise.all([
					tryMigrationTemplate('promises.js'),
					tryMigrationTemplate('async.js')
				]);
			} else {
				return Promise.all([
					tryMigrationTemplate('promises.js')
				]);
			}
		})
		.then(() => {
			if (nodeMajor >= 8) {
				assert.pass('promises template should be requireble');
				assert.pass('async template should be requireble');
			} else {
				assert.pass('promises template should be requireble');
				assert.skip('do not require async template on nodejs < 8');
			}
		});
});
