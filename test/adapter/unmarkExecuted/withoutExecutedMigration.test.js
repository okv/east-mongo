'use strict';

const testUtils = require('../../utils');

const test = testUtils.test;
let adapter;
const migrationName = '1_someMigration';

test('setup', (assert) => {
	adapter = testUtils.createAdapter();

	return Promise.resolve()
		.then(() => adapter.connect())
		.then(() => testUtils.clearAdapterCollection({adapter}));
});

test(
	'adapter unmarkExecuted method without executed migration',
	(assert) => {
		return Promise.resolve()
			.then(() => adapter.unmarkExecuted(migrationName))
			.then(() => testUtils.getExecutedMigrations({adapter}))
			.then((names) => {
				assert.deepEqual(
					names,
					[],
					'should leave empty list of executed migrations'
				);
			});
	}
);

test('teardown', (assert) => {
	return Promise.resolve()
		.then(() => testUtils.clearAdapterCollection({adapter}))
		.then(() => adapter.disconnect());
});
