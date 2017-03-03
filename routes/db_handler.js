var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var state = {
	db: null,
}

module.exports =
{
	mongoConnect: function (mongoUrl) {
		if (state.db) {return}

		mongoClient.connect(mongoUrl, function(err, dbHandle) {
			if (err) {throw err} else {
				assert.equal(null, err);
				console.log("MongoDB server connection Established");
				state.db = dbHandle;
				//app.locals.db = dbHandle;
			}
		});
	},

	mongoConnectRouting: function (mongoUrl, callback) {
		if (state.db) {return}

		mongoClient.connect(mongoUrl, function(err, dbHandle) {
			if (err) {throw err} else {
				assert.equal(null, err);
				console.log("MongoDB server connection Established");
				state.db = dbHandle;
				callback();
			}
		});
	},

	insertDocument: function(collection , geoData, callback) {
	   state.db.collection(collection).insertOne(geoData, function(err, result) {
			    assert.equal(err, null);
			    console.log('Document Inserted into ' + collection + ' collection');
			    callback();
	  });
	},

	getDocuments: function (collection, searchParams, callback) {
		state.db.collection(collection).find({},searchParams).toArray(function(err, docs) {
		    if(err) throw err;
		    console.log("Fetching documents from DB, passing it as Array");
		    callback(err, docs);
		    //console.log(JSON.stringify(nfzData));
		    //callback(docs);
	  });
	},

	getDocumentsRouting: function (collection, queryParams, searchParams, callback) {
		state.db.collection(collection).find(queryParams, searchParams).toArray(function(err, docs) {
		    if(err) throw err;
		    console.log("Fetching documents from DB, passing it as Array");
		    callback(err, docs);
	  });
	},

	get_dbHandle: function () {
		return state.db;
	},

	closeDB: function (done) {
		if (state.db) {
			state.db.close(function (err, result) {
				// TODO: Error handling
				if(err) throw err;
				state.db = null;
			});
		}
	}
};
