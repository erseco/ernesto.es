var map;
function initMap() {

    var locations = [
         ['Yecla',          38.61221,   -1.11011,   1],
         ['Granada',        37.17734,   -3.59856,   1],
         ['Bilbao',         43.26301,   -2.93499,   1],
         ['Barcelona',      41.38506,   2.17340,    1],
         ['Idanha-a-Velha', 40.00149,   -7.15209,   1],

         ['Madrid',         40.41678,   -3.70379,   1],
         ['Maury',          42.81125,   2.59303,    1],
         ['Grenoble',       45.18853,   5.72452,    1],
         ['Samso',          55.81467,   10.58863,   1],
         ['Copenhaguen',    55.67610,   12.56834,   1],
         ['Amsterdam',      52.37022,   4.89517,    1],
         ['Leiden',         52.16011,   4.49701,    1],
         ['Athens',         37.98392,   23.72936,   1],
         ['Cagliari',       39.22384,   9.12166,    1],
         ['Bologna',        44.49489,   11.34262,   1],
         ['Ascoli Piceno',  42.85360,   13.57494,   1],
         ['Heraklion',      35.33874,   25.14421,   1],
         ['Krakow',         50.06465,   19.94498,   1],
         ['Torun',          53.00604,   18.59613,   1],
         ['Prague',         50.07554,   14.43780,   1],
         ['London',         51.50735,   -0.12776,   1],
         ['Klaipeda',       55.70329,   21.14428,   1],
         ['Vilnius',        54.68716,   25.27965,   1],
         ['Riga',           56.94965,   24.10519,   1],
         ['Tallinn',        59.43696,   24.75357,   1],
         ['Stockholm',      59.32932,   18.06858,   1],
         ['Istanbul',       41.03333,   29.10136,   1],
         ['Capadoccia',     38.72049,   35.48260,   2],
         ['Izmir',          38.42373,   27.14283,   1],
         ['Bangkok',        13.75633,   100.50177,  3],
         ['Siem Reap',      13.36710,   103.84481,  3],
         ['Lanzarote',      29.04685,   -13.58997,  3],
         ['Lviv',           49.83968,   24.02972,   3],
         ['Fes',            34.01812    ,-5.00785,  4],
         ['Merzouga',       31.08017,   -4.01336,   4],
         ['Princeton',      40.35730,   -74.66722,  4],
         ['Munich',         48.135125,  11.581981,  4],
         ['Sabinov',		49.102821,  21.097860,  4],
         ['Berlin',			52.520008,  13.404954,  4],
         ['L\'isle-sur-la-sorge',		43.918660,  5.054390,   4],
         ['Paris',			48.856613, 	2.352222, 	4],
         ['Manchester', 	53.483959, -2.244644, 	4],
         ['El Hierro',		27.701660,	-17.980230, 4]


    ];

    map = new google.maps.Map(document.getElementById('map'), {
         zoom: 2,
         center: new google.maps.LatLng(43.48437, 57.20528),
         mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow;

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        // Uso de AdvancedMarkerElement en lugar de Marker
        marker = new google.maps.marker.AdvancedMarkerElement({
             position: new google.maps.LatLng(locations[i][1], locations[i][2]),
             map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
             return function() {
                 infowindow.setContent(locations[i][0]);
                 infowindow.open(map, marker);
             }
        })(marker, i));
    }

}