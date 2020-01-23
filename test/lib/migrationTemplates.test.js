'use strict';

const testUtils = require('../utils');
const pathUtils = require('path');
const fs = require('fs');
const promisify = require('es6-promisify').promisify;

const test = testUtils.test;

test('migrationTemplates', (assert) => {
	const templatesPath = pathUtils.resolve(
		__dirname,
		'../../lib/migrationTemplates'
	);
	const tryMigrationTemplate = (filename) => {
		const templatePath = pathUtils.join(templatesPath, filename);
		let migration;
		assert.doesNotThrow(
			() => {
				// eslint-disable-next-line import/no-dynamic-require
				migration = require(templatePath);
			},
			`${filename} template should be requireble`
		);

		assert.equal(
			Array.isArray(migration.tags),
			true,
			`${filename} template tags should be an array`
		);

		return Promise.all([
			migration.migrate({}),
			migration.rollback({})
		]);
	};
	const readdir = promisify(fs.readdir);
	const nodeMajor = Number(process.versions.node.split('.')[0]);

	return Promise.resolve()
		.then(() => readdir(templatesPath))
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
		});
});
