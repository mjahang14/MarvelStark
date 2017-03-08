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

	var originPoint=routeEndPoints.features[0];
	var destPoint =routeEndPoints.features[1];

  console.log("Origin/Destination point " +JSON.stringify(originPoint) +JSON.stringify(destPoint));
	droneRoute.getRoute_Grid(originPoint, destPoint, false,function (pathLine) {
	         	 //console.log("Route Path::"+ JSON.stringify(pathLine));
			       res.json(pathLine);
		});
});

router.post('/api/populateNFZ/', function (req, res) {

	var nfz_doc = req.body;
	console.log("Received Data for NFZ update::", JSON.stringify(nfz_doc));

	mongoHandle.insertDocument('geo_nfz_layer_drawing', nfz_doc, function() {
	          	res.json({"status":"Success"});
	});
});

router.post('/api/getGrid/', function (req, res) {

	var endPoints = req.body;
	var originPoint=endPoints.features[0];
	var destPoint =endPoints.features[1];

  	//console.log("POST API Origin/Destination for GRID:: " +JSON.stringify(originPoint) +JSON.stringify(destPoint));

	droneRoute.getRoute_Grid(originPoint, destPoint, true,function (grid) {
		if (grid.features.length) {
						res.json(grid);
		} else {
			      console.log("Grid is Empty::");
						res.json(grid);
		}
	});
});

module.exports = router;
