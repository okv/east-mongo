'use strict';


module.exports = (params) => {
	const adapter = params.adapter;

	if (adapter.collection.removeMany) {
		return adapter.collection.removeMany({});
	} else {
		return adapter.collection.remove({});
	}
};
