'use strict';

const promisify = require('es6-promisify').promisify;
const Adapter = require('../../lib/adapter');

const defaultParams = {
	url: 'mongodb://localhost:27017/test_east_mongodb',
	options: {
		useUnifiedTopology: true
	}
};

module.exports = () => {
	const adapter = new Adapter(defaultParams);

	adapter.connect = promisify(adapter.connect.bind(adapter));
	adapter.disconnect = promisify(adapter.disconnect.bind(adapter));
	adapter.getExecutedMigrationNames = promisify(
		adapter.getExecutedMigrationNames.bind(adapter)
	);

	return adapter;
};
