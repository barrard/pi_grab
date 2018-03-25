      function initMap() {
        var map_marker = {lat: 21.293184, lng: -157.828616};
        var map1 = new google.maps.Map(document.getElementById('map1'), {
          zoom: 9,
          center: map_marker,
          disableDefaultUI: true
        });
        // var map_marker = {lat: 19.4590307, lng: -155.409995};
        // var map2 = new google.maps.Map(document.getElementById('map2'), {
        //   zoom: 7,
        //   center: map_marker,
        //   disableDefaultUI: true
        // });
        
        var iconBase = 'https://maps.google.com/mapfiles/kml/pal3/';

        var map1_marker = new google.maps.Marker({
          position: map_marker,
          map: map1,
          icon: iconBase + 'icon23.png'

        });

        // var map2_marker = new google.maps.Marker({
        //   position: map_marker,
        //   map: map2,
        //   icon: iconBase + 'icon23.png'

        // });
      }


// $('#map2-wrapper').on('click', function(e){
//   console.log(e)

// })