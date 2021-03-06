# east mongo

mongodb adapter for [east](https://github.com/okv/east) (node.js database migration tool) which uses 
[mongodb native driver](http://mongodb.github.io/node-mongodb-native/)

*Please note* that mainstream mongodb adapter version (>= 1.x) requires
east >= 1.x, for using adapter with older east versions (prior to 1.x) please
use mongodb adapter version < 1.x.

All executed migrations names will be stored at `_migrations` collection in the
current database. Object with following properties will be passed to `migrate`
and `rollback` functions:

* `db` - instance of [mongodb native db](http://mongodb.github.io/node-mongodb-native/3.5/api/Db.html)
* `dropIndexIfExists` function(collection, index, [callback]) - helper function
which can be used for dropping index in safe way (contrasting to 
`collection.dropIndex` which throws an error if index doesn't exist). This
function returns promise and can be used that way instead of providing
callback.

east mongo package also provides following migration templates:

* [lib/migrationTemplates/promises.js](lib/migrationTemplates/promises.js) -
default migration template, uses built-in `Promise` in `migrate`,
`rollback` functions.
* [lib/migrationTemplates/async.js](lib/migrationTemplates/async.js) -
migration template that uses async functions to describe `migrate`,
`rollback` functions.

Default migration template will be used if `template` is not set. To get path
of another template `require.resolve` could be used, e.g. at `.eastrc`:

```js
	module.exports = {
		template: require.resolve('east-mongo/lib/migrationTemplates/async.js')
	}
```

[![Npm version](https://img.shields.io/npm/v/east-mongo.svg)](https://www.npmjs.org/package/east-mongo)
[![Build Status](https://travis-ci.org/okv/east-mongo.svg?branch=master)](https://travis-ci.org/okv/east-mongo)
[![Coverage Status](https://coveralls.io/repos/github/okv/east-mongo/badge.svg?branch=master)](https://coveralls.io/github/okv/east-mongo?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/east-mongo/badge.svg)](https://snyk.io/test/npm/east-mongo)


## Node.js compatibility

east mongo requires node.js >= 4 to work.

## Installation

mongodb adapter requires `mongodb` package as peer dependency (versions 2.x and
3.x are supported), so you should install it manually along side with east:

```sh
npm install east east-mongo mongodb@3
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
(see [connect method specification](http://mongodb.github.io/node-mongodb-native/3.5/api/MongoClient.html#.connect)).

Migration files created with default `template` that comes with adapter will
look like:

```js
exports.tags = [];

exports.migrate = function(params) {
	const db = params.db;

	return Promise.resolve();
};

exports.rollback = function(params) {
	const db = params.db;

	return Promise.resolve();
};
```

See east [cli](https://github.com/okv/east#cli-usage) or
[library](https://github.com/okv/east#library-usage) usage for more details.


## License

MIT

