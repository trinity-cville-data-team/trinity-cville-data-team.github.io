var map, member_heatmap, member_points, elder_heatmap, elder_points, deacon_heatmap, deacon_points;
  
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

  function toggleHeatmap(heatmap) {
      heatmap.setMap(heatmap.getMap() ? null : map);
  }

  function togglePoints(pts) {
      for(var i=0; i < pts.length; i++) {
          pts[i].setMap(pts[i].getMap() ? null : map);
      }
  }

  function plot(theData, format, theMap, style) {
      var result
      console.log("Found "+theData.length+" data points")
      if(format == "heatmap") {
          console.log("heatmap")
          var theLatLngData = []
          for(var i=0; i < theData.length; i++) {
              theLatLngData.push(new google.maps.LatLng(theData[i]['lat'], theData[i]['lng']));
          }
          result = new google.maps.visualization.HeatmapLayer({
              data: theLatLngData,
              map: theMap,
              radius: 50
          });
      } else if(format == "point") {
          console.log("point")
          result = []
          for(var i=0; i < theData.length; i++) {
              result.push(new google.maps.Marker({
                  position: theData[i],
                  map: theMap,
                  icon: style(theData[i]["parish"])
              }));
          }
      }
      return result;
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 38.0401499, lng: -78.5199934},
      mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    $.getJSON(
            "/members", 
            {},
            function(d) { 
                members = d; 
                member_heatmap = plot(members, "heatmap", map, {});
                member_points = plot(members, "point", null, function(x) {return {url: "http://maps.google.com/mapfiles/kml/paddle/blu-blank-lv.png"}});
            });
    $.getJSON(
            "/elders",
            {},
            function(d) { 
                elders = d; 
                elder_heatmap = plot(elders, "heatmap", null, {});
                elder_points = plot(elders, "point", map, function(x) { return {url: "http://maps.google.com/mapfiles/kml/paddle/"+color(x)+"-square-lv.png"}}); 
            });
    $.getJSON(
            "/deacons",
            {},
            function(d) { 
                deacons = d; 
                deacon_heatmap = plot(deacons, "heatmap", null, {});
                deacon_points = plot(deacons, "point", map, function(x) { return {url: "http://maps.google.com/mapfiles/kml/paddle/"+color(x)+"-stars-lv.png"}}); 
            });
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
