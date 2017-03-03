var mongo_handle = require('./db_handler.js');
var turf = require('turf');
var aggregate = require('turf-collect');
var polygon = require('turf-helpers').polygon;
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;
var geoPath = require("./geo_route");

var ROW=0
var COL=0

var src_dst_inside_nfz = {
	"type": "Feature",
	"geometry": {
	        "type": "LineString",
	        "coordinates": []
	},
	"properties": {
	        "routeFlag": 2,
	        "result" : false,
	        "info": ""
	}
};

module.exports = { 

	getRoute_Grid : function (src, dest, isGrid, callback) {

		var srcPoint = point(src.geometry.coordinates[0]);
		var destPoint = point(dest.geometry.coordinates[0]);

		//var srcPointOrigin = point([77.031827, 28.427263]);
		var gridWidth = 10; // In Meters
		var units = "kilometers";

		console.log(JSON.stringify(srcPoint));
		console.log(JSON.stringify(destPoint));

		var distance = turf.distance(srcPoint, destPoint, "kilometers");
		console.log("Straight Line Trip Distance : " + distance);
		var radius = Math.ceil(distance/2);
		//console.log(radius);

		var midpointed = turf.midpoint(srcPoint, destPoint);

		// Calculate Bounding box geoBoundaries along all axis
		// 1. Define the Outer bounding box(get it using distance and heading/bearing functions)
		var northPoint = turf.destination(midpointed, radius, 0, "kilometers");
		var southPoint = turf.destination(midpointed, radius, 180, "kilometers");
		var eastPoint = turf.destination(midpointed, radius, 90, "kilometers");
		var westPoint = turf.destination(midpointed, radius, -90, "kilometers");
		var northWest = turf.destination(northPoint, radius, -90, "kilometers");
		var southWest = turf.destination(southPoint, radius, -90, "kilometers");
		var southEast = turf.destination(southPoint, radius, 90, "kilometers");
		var northEast = turf.destination(northPoint, radius, 90, "kilometers");

		var boundingBoxPoints = {
		  "type": "FeatureCollection",
		  "features": [northPoint, northWest, westPoint, southWest, southPoint, southEast, eastPoint, northEast]
		};

		//console.log("PRINTING BOUNDING BOX Points feature collection");
		//console.log(JSON.stringify(boundingBoxPoints));

		// 2
		var bbox = turf.bbox(boundingBoxPoints);
		var bboxPolygon = turf.bboxPolygon(bbox);
		//console.log("POLY BOXXXXXX")
		//console.log(JSON.stringify(bboxPolygon));
		var roundDistance = Math.ceil(distance);

		if (roundDistance < 1) {
			gridWidth = 25;
		}
		else if (roundDistance > 1 && roundDistance < 5) {
			gridWidth = 100;
		} else if (roundDistance > 5 && roundDistance < 10) {
			gridWidth = 250;
		} else if (roundDistance > 10 && roundDistance < 15) {
			gridWidth = 500
		} else if(roundDistance > 15 && roundDistance < 25){
			gridWidth = 750
		} else if (roundDistance > 25 && roundDistance < 30) {
			gridWidth = 1500
		} else {
			gridWidth = 2000
		}
		var squareGrid = turf.squareGrid(bbox, gridWidth/1000, units); // gridWidth converted to kilometer

		console.log("squareGrid number of features: " + squareGrid.features.length);
		//console.log("squareGrid: " + JSON.stringify(squareGrid));

		// 3. Check how many of NFZ are there in bbox
		var searchParams = {
			"_id": false
		};

		var queryParams = {
			"geometry": {
				"$geoIntersects":{
					"$geometry": bboxPolygon.geometry
				}
			}
		};

		mongo_handle.getDocumentsRouting("geo_nfz_layer_drawing", queryParams, searchParams, function (err, listing) {
			//console.log(JSON.stringify(listing));
			var black = white = 0;
			var nfz_feature_collection = {
				"type": "FeatureCollection",
				"features": []
			};

			listing.forEach(function (geoNFZ) {
				nfz_feature_collection.features = nfz_feature_collection.features.concat(geoNFZ);
			});
			var grid_counter = 0
			var srcIndex, dstIndex = 0;
			var intersectPoly = null;

			squareGrid.features.forEach(function (singleFeatureGrid) {
				//console.log(JSON.stringify(singleFeatureGrid)); enable with care, heavy debug
				var pointsFeatureCollection = turf.explode(singleFeatureGrid);
				var centerPoint = turf.center(pointsFeatureCollection);
				var ptsWithin = turf.within(pointsFeatureCollection, nfz_feature_collection);
				//console.log("PRINTING***************");
				//console.log(JSON.stringify(ptsWithin));

				if(turf.inside(srcPoint, singleFeatureGrid)) {
					srcIndex = grid_counter;
				}
				if(turf.inside(destPoint, singleFeatureGrid)){
					dstIndex = grid_counter;
				}
				if (ptsWithin.features.length > 0) {
					//console.log("marking pts black");
					singleFeatureGrid.properties = {
						"marker-color": '#f00',
						"routeFlag": 0,
						"center": centerPoint.geometry.coordinates,
						"grid_id": grid_counter++
					};
					black++;
				} else {
					singleFeatureGrid.properties = {
						"marker-color": '#0f0',
						"routeFlag": 1,
						"center": centerPoint.geometry.coordinates,
						"grid_id": grid_counter++
					};
					white++;
					//console.log('marking pts white');
				}
			    nfz_feature_collection.features.forEach(function(nfz_feature) {
					intersectPoly = undefined;
					intersectPoly = turf.intersect(singleFeatureGrid, nfz_feature);
					if (intersectPoly != undefined) {
						singleFeatureGrid.properties.routeFlag = 0;
					}
				});
			});

			if(!squareGrid.features[srcIndex].properties.routeFlag || !squareGrid.features[dstIndex].properties.routeFlag) {
				srcFlag = true;
			}
			ROW = Math.sqrt(grid_counter);
			COL = ROW;

			console.log("ROW: " +ROW +"    "+  COL);
			console.log("{whiteBox : " + white + ",{blackBox: " + black + "}");
			console.log("grid_counter: " + grid_counter);

			//console.log("squareGrid: " + JSON.stringify(squareGrid));
			// 5. Arrange data in 2D space
			// and calculate best route in distance

			if(isGrid) {
				callback(squareGrid);
			} else {
				if(srcFlag) {
					var src_dst_inside_nfz = {
						"type": "Feature",
						"geometry": {
						    "type": "LineString",
						    "coordinates": []
						},
						"properties": {
						    "routeFlag": 2,
						    "result" : false,
						    "info": "Origin/Dest inside NFZ"
						}
					};
					console.log("Kamina log")
					callback(src_dst_inside_nfz);
				} else {
					console.log("-------------------CALLING ALGO--------------------");
					geoPath.buildMatrix(squareGrid, srcIndex, dstIndex,srcPoint,destPoint,ROW,COL);
					callback(geoPath.pathLine);
				}
			}
		})
}
}; // module.exports
