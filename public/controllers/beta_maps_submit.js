var polyarr=[];
var map;
var marker_global;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.4571826, lng: 77.0728132},
          zoom:14
        });

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon', 'polyline']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
          }
        });

        drawingManager.setMap(map);

		var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function()
{
	searchBox.setBounds(map.getBounds());
});

var markers = [];
 // Listen for the event fired when the user selects a prediction and retrieve
 // more details for that place.
searchBox.addListener('places_changed', function()
{
if(marker_global)
{
marker.setMap(null);
}
	var places = searchBox.getPlaces();

          if (places.length == 0)
		  {
            return;
          }

          // For each place, get the icon, name and location.
	var bounds = new google.maps.LatLngBounds();
	places.forEach(function(place)
	{
			if (!place.geometry)
			{
			console.log("Returned place contains no geometry");
			return;
			}
			var icon = {
			url: google.maps.SymbolPath.BACKWORD_OPEN_ARROW,
			//url: places.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25)
			};

            // Create a marker for each place.
			var temp_marker = new google.maps.Marker({
			map: map,
			title: place.name,
			position: place.geometry.location
			});
			markers.push(temp_marker);
		marker_global = temp_marker;
		var infowindow = new google.maps.InfoWindow
		({
		content: temp_marker.title
		});
		var source_string = JSON.stringify(place.geometry.location);
		var source = JSON.parse(source_string);
		source_global = source;
		//console.log(source);
		google.maps.event.addListener(temp_marker,'click', function()
		{
			infowindow.open(map, temp_marker);
		});

    if (place.geometry.viewport)
	{
    // Only geocodes have viewport.
		bounds.union(place.geometry.viewport);
    }
	else
	{
		bounds.extend(place.geometry.location);
	}
    });
    map.fitBounds(bounds);
});

google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
    drawingManager.setDrawingMode(null);

   polyarr=[];
   var j = {
   "type": "Feature",
   "geometry": {
                  "type": "Polygon",
                  "coordinates": [
                             []
                                 ]
   },
   "properties": {
       "name" : "THis is my test area",
	   "routeFlag":3
    }
  };

    polygon.getPath().forEach(function(latLng){

  var LL = JSON.parse(JSON.stringify(latLng));
j.geometry.coordinates[0].push([LL.lng,LL.lat]);
});
var start_lat = j.geometry.coordinates[0][0][0];
var start_lng = j.geometry.coordinates[0][0][1];
j.geometry.coordinates[0].push([start_lat,start_lng]);

console.log("j",j);
var xhr = new XMLHttpRequest();
  xhr.open('POST','/api/populateNFZ/',true);
  xhr.setRequestHeader("Content-Type","application/json");
  //xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
  xhr.send(JSON.stringify(j));

xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      console.log(xhr.responseText);
	  document.getElementById("modal").click();
	  
    }
}

});

}


function find()
{

var templat;
var templng;


var xhr = new XMLHttpRequest();
	xhr.open('GET','/api/getNFZ', true);
	xhr.send();

	xhr.onreadystatechange = function()
{
    if (xhr.readyState == XMLHttpRequest.DONE)
	{
	var j = JSON.parse(xhr.responseText);
  console.log("Print Response: " +j);
	console.log(j.features.length);
	

	j.features.forEach(function(item,index){
	map.data.addGeoJson(item);
	});

	}
	}

}
