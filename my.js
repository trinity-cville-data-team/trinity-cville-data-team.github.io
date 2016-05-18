var map, members, elders, deacons;

  function plot(theData, format) {
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
              map: map,
              radius: 50
          });
      } else if(format == "point") {
          console.log("point")
          for(var i=0; i < theData.length; i++) {
              result = new google.maps.Marker({
                  position: theData[i],
                  map: map,
                  label: theData[i]['name']
              });
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
            function(d) { members = d; plot(members, "heatmap"); }
            );
    $.getJSON(
            "/elders",
            {},
            function(d) { elders = d; plot(elders, "point"); }
            );
    $.getJSON(
            "/deacons",
            {},
            function(d) { deacons = d; plot(deacons, "point"); }
            );
  }

  function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
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
