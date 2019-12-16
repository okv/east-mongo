'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;
const migrationName = '1_someMigration';

test('setup', (assert) => {
	adapter = testUtils.createAdapter();

	return Promise.resolve()
		.then(() => adapter.connect())
		.then(() => testUtils.clearAdapterCollection({adapter}))
		.then(() => testUtils.markMigrationExecuted({adapter, migrationName}));
});

test(
	'adapter getExecutedMigrationNames method with executed migrations',
	(assert) => {
		return adapter.getExecutedMigrationNames()
			.then((names) => {
				assert.deepEqual(
					names,
					[migrationName],
					'should return executed migration name'
				);
			});
	}
);

test('teardown', (assert) => {
	return Promise.resolve()
		.then(() => testUtils.clearAdapterCollection({adapter}))
		.then(() => adapter.disconnect());
});
