var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var mongoHandle = require('./db_handler.js');
var droneRoute = require('./geo_processing.js');

var client = new Client();

router.get('/', function (req, res) {
	console.log("HOME GET Req");
});

router.get('/api/getNFZ', function (req, res) {
	var documents = null;

	var searchParams = {
		"_id": false
	};

	var poly_feature_collection = {
	  "type": "FeatureCollection",
	  "features": []
	};

	console.log("getGeoNFZ GET request");
	mongoHandle.getDocuments('geo_nfz_layer_drawing', searchParams, function (err, documents) {
		if (err) {console.log("Error occured getting NFZ"); res.sendStatus(404)}
		else {
			documents.forEach(function (feature) {
				// send a polygon feature collection
				poly_feature_collection.features = poly_feature_collection.features.concat(feature);
				//console.log(feature);
			})
			res.send(poly_feature_collection);
		}
	});
});

router.post('/api/getRoute/', function (req, res) {
	console.log("POST MEHTOD CALLED /api/getRoute");
	var routeEndPoints = req.body;
	console.log(JSON.stringify(routeEndPoints));
	// TODO: src and destination validations
	var originPoint=routeEndPoints.features[0];
	var destPoint =routeEndPoints.features[1];

    console.log("Origin/Destination point " +JSON.stringify(originPoint) +JSON.stringify(destPoint));
	droneRoute.getRoute_Grid(originPoint, destPoint, false,function (pathLine) {
		if (1) {// TODO: error handling
      console.log("it is pmy path" + JSON.stringify(pathLine));
			res.json(pathLine);
		} else {
			console.log(pathLine);
		}
	});
});

router.post('/api/populateNFZ/', function (req, res) {
	console.log("feed_nfz to update the databae with NFZ");
	var nfz_doc = req.body;

	console.log("Received Data: ", JSON.stringify(nfz_doc));

	var coordinateArrLen = nfz_doc.geometry.coordinates.length;
	console.log("coordinateArrLen: ",  coordinateArrLen);

	mongoHandle.insertDocument('geo_nfz_layer_drawing', nfz_doc, function() {
		res.json({"status":"Success"});
	});
});

router.post('/api/getGrid/', function (req, res) {

	console.log("POST MEHTOD CALLED /api/getGrid");
	var endPoints = req.body;
	console.log(JSON.stringify(endPoints));
	// TODO: src and destination validations
	var originPoint=endPoints.features[0];
	var destPoint =endPoints.features[1];

  	console.log("Origin/Destination for GRID " +JSON.stringify(originPoint) +JSON.stringify(destPoint));
  	
	droneRoute.getRoute_Grid(originPoint, destPoint, true,function (grid) {
		if (1) {// TODO: error handling
			res.json(grid);
		} else {
			console.log(grid);
		}
	});
});

module.exports = router;