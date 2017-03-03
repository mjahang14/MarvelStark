/*
 Javascript: Data layering
*/
var flightPath;
var map;
var fp2;
var fpc2;
var flightPlanCoordinates;
var cityCircle;
var source_global;
var dest_global;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
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
            icon: icon,
            title: place.name,
            position: place.geometry.location
        });

        markers.push(temp_marker);
        var infowindow = new google.maps.InfoWindow({content: temp_marker.title});

        var source_string = JSON.stringify(place.geometry.location);
        var source = JSON.parse(source_string);
        source_global = source;
        //console.log(source);
        google.maps.event.addListener(temp_marker,'click', function() {infowindow.open(map, temp_marker);});

        if (place.geometry.viewport) {
        // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }});

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

  var markers2 = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox2.addListener('places_changed', function() {
    var places = searchBox2.getPlaces();

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
        icon: icon,
        title: place.name,
        position: place.geometry.location
      });

      markers2.push(m);
      var infowindow = new google.maps.InfoWindow({
        content: m.title
      });

      google.maps.event.addListener(m,'click', function() {
        infowindow.open(map, m);
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


function openNav() {
  document.getElementById("mySidenav").style.width = "20%";
  navigator.getBattery().then(function(battery) {
  document.getElementById("bat").innerHTML = "Battery "+ battery.level*100+"%";
  });
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0%";
}

function find() {

  var req = new XMLHttpRequest();
  req.open('GET','http://127.0.0.1:8082/getGeoNFZ',true);
  req.send();

  req.onreadystatechange = function() {

    if (req.readyState == XMLHttpRequest.DONE) {

      var newobj = JSON.parse(req.responseText);
      console.log(newobj);
      console.log(req.responseText);

      var lat1, lat2, lng1, lng2, rtone, rtosw, radius;

      for (var i=0; i<newobj.NFZS.length ;i++) {

        lat1=newobj.NFZS[i].geometry.Center.lat;
        lng1=newobj.NFZS[i].geometry.Center.lng;
        lat2=newobj.NFZS[i].geometry.NE.lat;
        lng2=newobj.NFZS[i].geometry.NE.lng;
        lat3=newobj.NFZS[i].geometry.SW.lat;
        lng3=newobj.NFZS[i].geometry.SW.lng;
        console.log()
        rtone = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(lat1,lng1), new google.maps.LatLng(lat2,lng2));
        rtosw = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(lat1,lng1), new google.maps.LatLng(lat3,lng3));
        radius = Math.max(rtone, rtosw);
        createcircle(parseFloat(radius), lat1, lng1);
      } //for loop
    } //if
  } //onreadystatechange function
}

function createcircle(radius1, lat1, lng1) {

  cityCircle = new google.maps.Circle({
        strokeColor: '#ffff99',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.35,
        map: map,
        center: {lat: lat1, lng: lng1},
        radius: radius1
  });

	map.data.add(cityCircle);
	console.log("created circle with",radius1,lat1,lng1);
}
