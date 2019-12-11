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
[![Known Vulnerabilities](https://snyk.io/test/npm/east-mongo/badge.svg)](https://snyk.io/test/npm/east-mongo)


## Installation

```sh
npm install east east-mongo -g
```

alternatively you could install it locally


## Usage

go to project dir and run

```sh
east init
```

create `.eastrc` file at current directory

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
[mongodb native url connection format](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#the-url-connection-format)) and `options` is optional settings (see [connect method specification](http://mongodb.github.io/node-mongodb-native/2.0/api/MongoClient.html#connect)).

now we can create some migrations

```sh
east create apples
east create bananas
```

created files will looks like this one

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

edit created files and insert  

to 1_apples

```js
exports.migrate = function(client, done) {
	var db = client.db;
	db.collection('things').insert({_id: 1, name: 'apple', color: 'red'}, function(err) {
		if (err) done(err);
		db.collection('things').insert({_id: 2, name: 'apple', color: 'green'}, done);
	});
};

exports.rollback = function(client, done) {
	var db = client.db;
	db.collection('things').remove({_id: {$in: [1, 2]}}, done);
};
```

to 2_bananas

```js
exports.migrate = function(client, done) {
	var db = client.db;
	db.collection('things').insert({_id: 3, name: 'banana', color: 'yellow'}, done);
};

exports.rollback = function(client, done) {
	var db = client.db;
	db.collection('things').remove({_id: 3}, done);
};
```

now we can execute our migrations

```sh
east migrate
```

output

```sh
target migrations:
	1_apples
	2_bananas
migrate `1_apples`
migration done
migrate `2_bananas`
migration done
```

and roll them back

```sh
east rollback
```

output

```sh
target migrations:
	2_bananas
	1_apples
rollback `2_bananas`
migration successfully rolled back
rollback `1_apples`
migration successfully rolled back
```

you can specify one or several particular migrations for migrate/rollback e.g.

```sh
east migrate 1_apples
```

or

```sh
east migrate 1_apples 2_bananas
```

Run `east -h` to see all commands, `east <command> -h` to see detail command help,
see also [east page](https://github.com/okv/east#usage) for command examples.


## Running test

run [east](https://github.com/okv/east#running-test) tests with this adapter


## License

MIT

