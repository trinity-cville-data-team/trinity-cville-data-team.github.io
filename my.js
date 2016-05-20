var map, member_heatmap, member_points, elder_heatmap, elder_points, deacon_heatmap, deacon_points, parishes, marker;

// This is the single info window for showing info on any marker
var infoWindow;
  
  function color(x) {
      if(x == "West") {
          return "ylw"
      } else if(x == "Central") {
          return "grn"
      } else if(x == "East") {
          return "blu"
      } else if(x == "North") {
          return "red"
      } else if(x == "South") {
          return "wht"
      }
  }

  function parish_color(x) {
      return x.toLowerCase().substring(0,3);
  }

  function toggleHeatmap(heatmap) {
      heatmap.setMap(heatmap.getMap() ? null : map);
  }

  function togglePoints(pts) {
      for(var i=0; i < pts.length; i++) {
          pts[i].setMap(pts[i].getMap() ? null : map);
      }
  }
  
  function toggleParishes() {
      parishes.setMap(parishes.getMap() ? null : map);
  }

  function plot(theData, format, theMap, style) {
      var result
      if(format == "heatmap") {
          var theLatLngData = []
          for(var i=0; i < theData.length; i++) {
              theLatLngData.push(new google.maps.LatLng(theData[i]['lat'], theData[i]['lng']));
          }
          result = new google.maps.visualization.HeatmapLayer({
              data: theLatLngData,
              map: theMap,
              radius: 50,
              opacity: 0.5
          });
      } else if(format == "point") {
          result = []
          for(var i=0; i < theData.length; i++) {
              marker = new google.maps.Marker({
                  position: theData[i],
                  map: theMap,
                  icon: style(theData[i]["parish"])
              });

              google.maps.event.addListener(marker, 'click', (function(marker, i) {
                      return function() {
                          infoWindow.setOptions({options: {pixelOffset: new google.maps.Size(0,0)}});
                          infoWindow.setContent(theData[i]["name"]);
                          infoWindow.open(map, marker);
                      }
                  })(marker, i)
              );

              result.push(marker);
          }
      }
      return result;
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 38.0401499, lng: -78.5199934},
      mapTypeId: google.maps.MapTypeId.HYBRID
    });

    infoWindow = new google.maps.InfoWindow();
    var paddle = "https://cdn.rawgit.com/trinity-cville-data-team/trinity-cville-data-team.github.io/master/";

    parishes = new google.maps.KmlLayer({
        url: paddle+'parishes.kmz',
        map: null
    });
    
    $.getJSON(
        "/members", 
        {},
        function(d) { 
            members = d; 
            member_heatmap = plot(members, "heatmap", map, {});
            member_points = plot(members, "point", null, function(x) {return {url: paddle+'M.png'}});
        });
    $.getJSON(
        "/elders",
        {},
        function(d) { 
            elders = d; 
            elder_heatmap = plot(elders, "heatmap", null, {});
            elder_points = plot(elders, "point", map, function(x) { return {url: paddle+"E-"+parish_color(x)+".png"}}); 
        });
    $.getJSON(
        "/deacons",
        {},
        function(d) { 
            deacons = d; 
            deacon_heatmap = plot(deacons, "heatmap", null, {});
            deacon_points = plot(deacons, "point", map, function(x) { return {url: paddle+"D-"+parish_color(x)+".png"}}); 
        });
    $( "#autocomplete" ).autocomplete({source: "autocomplete"});
  }

  function changeGradient() {
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  }

  function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
  }

  function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
  }
$("#autocomplete").keydown(function(event) {
    if(event.keyCode == 13) {
       $.getJSON(
           "/search",
           {term: $('#autocomplete').val()},
           function(d) {
               map.setCenter({lat: d.lat, lng: d.lng});
               map.setZoom(17);
               infoWindow.setContent(d.name);
               infoWindow.setPosition({lat: d.lat, lng: d.lng});
               infoWindow.setOptions({options: {pixelOffset: new google.maps.Size(0,-16)}});
               infoWindow.open(map);
          }
        );
    }
});
