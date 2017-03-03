
var flightPath;
var map;
var fp2;

var fpc2;
var flightPlanCoordinates;
var cityCircle;
var source_global;
var dest_global;
var marker0;
var marker1;
var routeret;
var j;
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 28.42662, lng: 77.0321}
  });


  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

	if (places.length == 0) {
	return;
	}

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

	places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
		if (marker0)
		{
			marker0.setMap(null);
		}
		
if((j)&&(routeret))
{
console.log("route removal",j);
for(var i =0;i<routeret.length;i++)
{
map.data.remove(routeret[i]);
}
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
		marker0 = temp_marker;
        markers.push(temp_marker);
        var infowindow = new google.maps.InfoWindow({content: temp_marker.title+ " (" + JSON.parse(JSON.stringify(temp_marker.position)).lat + ", " + JSON.parse(JSON.stringify(temp_marker.position)).lng + ")"});

        var source_string = JSON.stringify(place.geometry.location);
        var source = JSON.parse(source_string);
        source_global = source;
        //console.log(source);
        google.maps.event.addListener(temp_marker,'click', function() {infowindow.open(map, temp_marker);});

        if (place.geometry.viewport) {
        // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        }
		else {
          bounds.extend(place.geometry.location);
		}
	});

      map.fitBounds(bounds);
  });


  var input2 = document.getElementById('from');
  var autocomplete = new google.maps.places.Autocomplete(input2);
  var searchBox2 = new google.maps.places.SearchBox(input2);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox2.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox2.addListener('places_changed', function() {
    var places = searchBox2.getPlaces();
	if(marker1)
	{
		marker1.setMap(null);
	}
	if((j)&&(routeret))
{
console.log("route removal",j);
for(var i =0;i<routeret.length;i++)
{
map.data.remove(routeret[i]);
}
}
    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
		if(!place.geometry) {
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
      var m=new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location
      });
	  marker1 = m;
	markers.push(m);


		var infowindow = new google.maps.InfoWindow({
		content: m.title + " (" + JSON.parse(JSON.stringify(m.position)).lat + ", " + JSON.parse(JSON.stringify(m.position)).lng + ")"
		});
		google.maps.event.addListener(m,'click', function() {
		infowindow.open(map, m);
		});

		var dest_string = JSON.stringify(place.geometry.location);
		var dest = JSON.parse(dest_string);
		dest_global = dest;

		if ((typeof(dest) !== 'undefined') && (dest !== null)&& (typeof(source_global)!== 'undefined') && (source_global !== null) ){
			console.log("printing dest",dest_global.lat,dest_global.lng);
			console.log("print source",source_global.lat,source_global.lng);

			var k={
				"type": "Feature",
				"properties": {
				},
				"geometry": {
					"type": "LineString",
					"coordinates": [
						]
				}
			}
			var temp_lng1 = JSON.parse(JSON.stringify(markers[0].position)).lng;
			var temp_lat1 = JSON.parse(JSON.stringify(markers[0].position)).lat;
			var temp_lng2 = JSON.parse(JSON.stringify(markers[1].position)).lng;
			var temp_lat2 = JSON.parse(JSON.stringify(markers[1].position)).lat;
            k.geometry.coordinates.push([temp_lng1,temp_lat1]);
			k.geometry.coordinates.push([temp_lng2,temp_lat2]);


			bounds.extend(markers[0].getPosition());
			bounds.extend(markers[1].getPosition());
			map.fitBounds(bounds);
		}

		if (place.geometry.viewport) {
        // Only geocodes have viewport.
			bounds.union(place.geometry.viewport);
		}
		else {
		bounds.extend(place.geometry.location);
		}
    });
    map.fitBounds(bounds);
  });

} // initMap close


function openNav() {
  document.getElementById("myNav").style.width = "20%";
  navigator.getBattery().then(function(battery) {
  document.getElementById("bat").innerHTML = "Battery "+ battery.level*100+"%";
  });
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}


function find()
{

var templat;
var templng;


var xhr = new XMLHttpRequest();
console.log("in find");
	xhr.open('GET','/api/getNFZ', true);
	xhr.send();

	xhr.onreadystatechange = function()
{
    if (xhr.readyState == XMLHttpRequest.DONE)
	{
	var j = JSON.parse(xhr.responseText);
  console.log("Print Response: " + JSON.stringify(j));
	console.log(j.features.length);
	var temp_geo;

	j.features.forEach(function(item,index){
	map.data.addGeoJson(item);
	map.data.setStyle(function(feature)
			{
				var prop = feature.getProperty("routeFlag");
				var color;
				if(prop == "3")
				{
					color = "red"
				}
				else if(prop == "2")
				{ color = "#334FFF"
				}
				
				return {
					fillColor: color,
            strokeColor: color,
            strokeWeight: 2

				}
				
			});
	});

	}
	}

}


function route()
{var templat;
	var templng;

	var k = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [        ]
      },
      "properties": {
        "prop0": "value0"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
        ]
      },
      "properties": {
        "prop0": "value0"
      }
    }
  ]
};



k.features[0].geometry.coordinates.push([source_global.lng,source_global.lat]);
k.features[1].geometry.coordinates.push([dest_global.lng,dest_global.lat]);

			var xhr = new XMLHttpRequest();
			xhr.open('POST','/api/getRoute/',true);
			xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
			xhr.send(JSON.stringify(k));
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == XMLHttpRequest.DONE)
			{
			j = JSON.parse(xhr.responseText);
if(j.properties.result == false)
			{
			document.getElementById("modal").click();
			document.getElementById("noroute").innerHTML = j.properties.info;
			console.log("route does not exist");
			console.log(j);
			return;
			}
			routeret = map.data.addGeoJson(j);
			map.data.setStyle(function(feature)
			{
				var prop = feature.getProperty("routeFlag");
				var color;
				if(prop == "3")
				{
					color = "red"
				}
				else if(prop == "2")
				{ color = "#334FFF"
				}
				
				return {
					fillColor: color,
            strokeColor: color,
            strokeWeight: 2

				}
				
			});
			}
	}
		
  
}
