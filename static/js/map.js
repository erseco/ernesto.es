var map;

function initMap() {
    const locations = portfolioPlaces;

    const position = { lat: 43.48437, lng: 57.20528 };

    map = new google.maps.Map(document.getElementById("map"), {
          zoom: 2,
          center: position,
          mapId: "8b8909e5da6fc74e",
          mapTypeControl: true, // Mostrar control de tipo de mapa
          mapTypeControlOptions: {
             style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
             position: google.maps.ControlPosition.TOP_RIGHT,
             mapTypeIds: ["roadmap", "satellite"], // Tipos de mapas a mostrar
          },
          streetViewControl: false, // Desactivar el botón de Street View
          controlSize: 20,
    });

    var infowindow = new google.maps.InfoWindow({
        headerDisabled: true, // Deshabilita el botón de cerrar en el infowindow
    });



    // Cierra el infowindow cuando se hace clic en el mapa
    map.addListener("click", () => {
        infowindow.close();
    });

    // Cierra el infowindow cuando se hace clic en el propio infowindow
    google.maps.event.addListener(infowindow, 'closeclick', function() {
        infowindow.close();
    });

    // Importa la clase AdvancedMarkerElement de forma asíncrona

// const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");


    google.maps.importLibrary("marker").then(function() {
        for (var i = 0; i < locations.length; i++) {
            var marker = new google.maps.marker.AdvancedMarkerElement({
                map: map,
                position: { lat:locations[i][1], lng:  locations[i][2] },
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                };
            })(marker, i));
        }
    }).catch(function(error) {
        console.error("Error al importar la biblioteca de marcadores:", error);
    });
}
