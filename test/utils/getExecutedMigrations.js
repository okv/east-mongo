'use strict';


module.exports = (params) => {
	const adapter = params.adapter;

	return adapter.collection.find({}).toArray()
		.then((docs) => docs.map((doc) => doc._id));
};
