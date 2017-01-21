"use strict"
    window.onload = function(){
      var newMarker, newMarker1;
      var poly, geodesicPoly;
      var newMakerPosition;
      var playerLocation;
      var clickCount = 0;
      var usePlayerLocation = false;
      var clearButton = document.getElementById("removeCurrent");
      initMap();
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: {lat: 39.8097, lng: -98.5556},
          mapTypeId: 'satellite'
        });

        let playerLocationMode = document.getElementById("current-location");

        playerLocationMode.addEventListener("click",function(e){
          if(usePlayerLocation === false){
            usePlayerLocation = true;
            playerLocationMode.value = "Track by current location off"
            clear();
          }else{
            usePlayerLocation = false;
            playerLocationMode.value = "Track by current location on"
            clear();
          }
        });

        findUserLocation();
        initAutocomplete()
        function initAutocomplete() {
              console.log("search")

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

         // Clear out the old markers.
         markers.forEach(function(marker) {
           marker.setMap(null);
         });
         markers = [];

         // For each place, get the icon, name and location.
         var bounds = new google.maps.LatLngBounds();
         places.forEach(function(place) {
           if (!place.geometry) {
             console.log("Returned place contains no geometry");
             return;
           }
           var icon = {
             url: place.icon,
             size: new google.maps.Size(71, 71),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(17, 34),
             scaledSize: new google.maps.Size(25, 25)
           };

           // Create a marker for each place.
           markers.push(new google.maps.Marker({
             map: map,
             icon: icon,
             title: place.name,
             position: place.geometry.location
           }));

           if (place.geometry.viewport) {
             // Only geocodes have viewport.
             bounds.union(place.geometry.viewport);
           } else {
             bounds.extend(place.geometry.location);
           }
         });
         map.fitBounds(bounds);
       });
              //// Create the search box and link it to the UI element.
              // var input = document.getElementById('pac-input');
              //    var searchBox = new google.maps.places.SearchBox(input);
              //    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
              //
              //    // Bias the SearchBox results towards current map's viewport.
              //    map.addListener('bounds_changed', function() {
              //      searchBox.setBounds(map.getBounds());
              //    });
              // //var autocomplete = new google.maps.places.Autocomplete(input,options);
            }
          function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                                  'Error: The Geolocation service failed.' :
                                  'Error: Your browser doesn\'t support geolocation.');
        }

        clearButton.addEventListener("click", function(event){
          clear();
        })
        // map.controls[google.maps.ControlPosition.TOP_CENTER].push(
        //     document.getElementById('info'));
        google.maps.event.addListener(map,'click',function(e){
            newMakerPosition = {lat: e.latLng.lat(), lng: e.latLng.lng()};
            console.log("player Location " + usePlayerLocation);
            if(usePlayerLocation){
                newMarker.setMap(null);
              };
            if(usePlayerLocation){
              newMakerPosition = playerLocation;
              newMarker = new google.maps.Marker({
                map: map,
                draggable: true,
                position: newMakerPosition,
                icon: "https://maxcdn.icons8.com/Color/PNG/48/Sports/golf_ball-48.png"
              });
              clickCount++;
            }
            if(newMarker1){
              newMarker1.setMap(null);
            }
            if(poly){
              poly.setMap(null);
            }
            if(geodesicPoly){
              geodesicPoly.setMap(null);
            }

              if(clickCount < 1){
                newMarker = new google.maps.Marker({
                  map: map,
                  draggable: true,
                  position: newMakerPosition,
                  icon: "https://maxcdn.icons8.com/Color/PNG/48/Sports/golf_ball-48.png"
                });
              }
              if(clickCount >= 1){
                console.log("newMarker1");
                newMarker1 = new google.maps.Marker({
                map: map,
                draggable: true,
                position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
                icon: "https://maxcdn.icons8.com/office/PNG/40/Maps/flag_2-40.png"
              });

              console.log(earthDistance(newMarker, newMarker1));

              poly = new google.maps.Polyline({
                //strokeColor: '#FF0000',
                //strokeOpacity: 1.0,
                //strokeWeight: 3,
                map: map,
              });

              geodesicPoly = new google.maps.Polyline({
                strokeColor: "#008542",
                strokeOpacity: 1.0,
                strokeWeight: 3,
                geodesic: true,
                map: map
              });
              // var bounds = new google.maps.LatLngBounds(
              //     newMarker.getPosition(), newMarker1.getPosition());
              // map.fitBounds(bounds);
              google.maps.event.addListener(newMarker, 'position_changed', update);

              google.maps.event.addListener(newMarker1, 'position_changed', update);
              // console.log(earthDistance(newMarker, newMarker1));

              update()
            }
            clickCount++;
          });
        //
        // var bounds = new google.maps.LatLngBounds(
        //     newMarker.getPosition(), newMarker1.getPosition());
        // map.fitBounds(bounds);

        // google.maps.event.addListener(newMarker, 'position_changed', update);
        // google.maps.event.addListener(newMarker1, 'position_changed', update);


        function findUserLocation(){
          var infoWindow = new google.maps.InfoWindow({map: map});

          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                map.setZoom(19);
                playerLocation = pos;
                console.log(playerLocation)
                //infoWindow.setPosition(pos);
                //infoWindow.setContent("");
                map.setCenter(pos);
              }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
              });
            } else {
              // Browser doesn't support Geolocation
              handleLocationError(false, infoWindow, map.getCenter());
            }
          }
      }

      function update() {
        yards(newMarker, newMarker1);
        console.log("update")
        var path = [newMarker.getPosition(), newMarker1.getPosition()];
        poly.setPath(path);
        geodesicPoly.setPath(path);
        var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
        console.log(newMarker1.position.lat());
        // document.getElementById('heading').value = heading;
        // document.getElementById('origin').value = path[0].toString();
        // document.getElementById('destination').value = path[1].toString();
      }
      function earthDistance(coord1, coord2, index, result) {
          var RADIUS_OF_EARTH = 3961; // miles
            var lat1 = coord1.position.lat() * Math.PI / 180;
          var lat2 = coord2.position.lat() * Math.PI / 180;
          var lon1 = coord1.position.lng() * Math.PI / 180;
          var lon2 = coord2.position.lng() * Math.PI / 180;

          var dlon = lon2 - lon1;
          var dlat = lat2 - lat1;

          var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) *
            Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return Math.round(1760 * (RADIUS_OF_EARTH * c));
      }

      function yards(newMarker, newMarker1){
        let yardDiv = document.getElementById("yards");
        yardDiv.innerText = "";
        let paragraph = document.createElement("p");
        paragraph.style.position = "absolute";
        paragraph.style.left = "10%";
        paragraph.style.top = "33%";
        paragraph.innerText = ("Yards " + earthDistance(newMarker, newMarker1));
        yardDiv.appendChild(paragraph);
      }
      function clear(){
        if(newMarker){
          newMarker.setMap(null);
        }
        if(newMarker1){
          newMarker1.setMap(null);
        }
        if(poly){
          poly.setMap(null);
        }
        if(geodesicPoly){
          geodesicPoly.setMap(null);
        }
        clickCount = 0;
        let yardDiv = document.getElementById("yards");
        yardDiv.innerText = "";
      }
    };
