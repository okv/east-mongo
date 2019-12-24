# east mongo

mongodb adapter for [east](https://github.com/okv/east) (node.js database migration tool) which uses 
[mongodb native driver](http://mongodb.github.io/node-mongodb-native/)

All executed migrations names will be stored at `_migrations` collection in the
current database. Object with following properties will be passed to `migrate`
and `rollback` functions:

* `db` - instance of [mongodb native db](http://mongodb.github.io/node-mongodb-native/api-generated/db.html)
* `dropIndexIfExists` function(collection, index, callback) - helper function
which can be used for dropping index in safe way (contrasting to 
`collection.dropIndex` which throws an error if index doesn't exist).


[![Npm version](https://img.shields.io/npm/v/east-mongo.svg)](https://www.npmjs.org/package/east-mongo)
[![Build Status](https://travis-ci.org/okv/east-mongo.svg?branch=master)](https://travis-ci.org/okv/east-mongo)
[![Known Vulnerabilities](https://snyk.io/test/npm/east-mongo/badge.svg)](https://snyk.io/test/npm/east-mongo)


## Installation

```sh
npm install east east-mongo
```

alternatively you could install it globally


## Usage

Sample `.eastrc` content:

```js
{
	"adapter": "east-mongo",
	"url": "mongodb://localhost:27017/test",
	"options": {
		"server": {
			"socketOptions": {
				"socketTimeoutMS": 3600000
			}
		}
	}
}
```

where `url` is url of database which you want to migrate (in 
[mongodb native url connection format](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#the-url-connection-format)) and `options` is optional settings
(see [connect method specification](http://mongodb.github.io/node-mongodb-native/2.0/api/MongoClient.html#connect)).

Migration files created with `template` that comes with adapter will look like:

```js
exports.migrate = function(client, done) {
	var db = client.db;
	done();
};

exports.rollback = function(client, done) {
	var db = client.db;
	done();
};
```

See east [cli](https://github.com/okv/east#cli-usage) or
[library](https://github.com/okv/east#library-usage) usage for more details.


## License

MIT

