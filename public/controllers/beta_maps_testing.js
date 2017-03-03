var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.4571826, lng: 77.0728132},
          zoom: 8
        });
		
		
		
		




}
function plot()
{
		
var templat;
var templng;

var j = { 
   "type": "Feature",
   "geometry": {
                  "type": "LineString",
                  "coordinates": [
                            []     ]
   },
   "properties": {
       "name" : "THis is my test area"
    }
};
var geo={"type":"Feature","geometry":{"type":"LineString","coordinates":[[77.03641699442076,28.42028053418918],[77.04663895572159,28.42028053418918],[77.05686091702239,28.42028053418918],[77.05686091702239,28.42927092796183],[77.06708287832322,28.42927092796183],[77.06708287832322,28.43826132173448],[77.07730483962402,28.43826132173448],[77.07730483962402,28.44725171550713],[77.08752680092485,28.44725171550713],[77.08752680092485,28.456242109279778],[77.08752680092485,28.465232503052427],[77.08752680092485,28.474222896825076]]},"properties":{"type":"route"}};
console.log(geo);

map.data.addGeoJson(geo);


	}