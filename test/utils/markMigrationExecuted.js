'use strict';


module.exports = (params) => {
	const adapter = params.adapter;
	const migrationName = params.migrationName;
	const doc = {_id: migrationName};

	if (adapter.collection.insertOne) {
		return adapter.collection.insertOne(doc);
	} else {
		return adapter.collection.insert(doc);
	}
};
