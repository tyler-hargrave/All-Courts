var map;
var service;
var infowindow;

function initialize() {
 var toronto = new google.maps.LatLng(43.65107, -79.347015);

 map = new google.maps.Map(document.getElementById("map"), {
  center: toronto,
  zoom: 15,
 });

 var request = {
  location: toronto,
  radius: "25000",
 };

 service = new google.maps.places.PlacesService(map);
 service.textSearch(request, callback);
}

function callback(results, status) {
 if (status == google.maps.places.PlacesServiceStatus.OK) {
  for (var i = 0; i < results.length; i++) {
   createMarker(results[i]);
  }
 }
}

function getAPIstring(clubName, address) {
 var toronto = "43.65107, -79.347015";
 var radius = 50000; //meters
 key = process.env.GOOGLE_MAPS;

 return `https://maps.googleapis.com/maps/api/place/textsearch/output?location=${toronto}&query=${clubName} ${address}&radius=${radius}&key=${key}`;
}
