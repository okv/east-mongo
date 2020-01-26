'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;
const migrationName = '1_someMigration';

test('setup', () => {
	adapter = testUtils.createAdapter();

	return Promise.resolve()
		.then(() => adapter.connect())
		.then(() => testUtils.clearAdapterCollection({adapter}))
		.then(() => testUtils.markMigrationExecuted({adapter, migrationName}));
});

test(
	'adapter markExecuted method with executed migration',
	(assert) => {
		return Promise.resolve()
			.then(() => adapter.markExecuted(migrationName))
			.then(() => testUtils.getExecutedMigrations({adapter}))
			.then((names) => {
				assert.deepEqual(
					names,
					[migrationName],
					'should not modify list of executed migrations'
				);
			});
	}
);

test('teardown', () => {
	return Promise.resolve()
		.then(() => testUtils.clearAdapterCollection({adapter}))
		.then(() => adapter.disconnect());
});
