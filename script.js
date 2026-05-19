var map = L.map('map', {
    renderer: L.canvas()
}).setView([-2,118],5);

/* Basemap */
var osm = L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:'&copy; OpenStreetMap'
}).addTo(map);


/* Layer GeoJSON */
fetch('kws.geojson')

.then(response => {

    if(!response.ok){
        throw new Error("GeoJSON tidak ditemukan");
    }

    return response.json();

})

.then(data => {

    console.log(data);

    function style(feature){
        return{
            color: 'yellow',
            weight: 1,
            opacity: 1,
            fillColor: 'red',
            fillOpacity: 0.6
        }
    }

    /* Highlight saat hover */
    function highlightFeature(e){

        var layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#00ffff',
            fillOpacity: 0.9
        });

        layer.bringToFront();
    }

    /* Reset style */
    function resetHighlight(e){
        geojson.resetStyle(e.target);
    }

    /* Zoom ke polygon */
    function zoomToFeature(e){
        map.fitBounds(e.target.getBounds());
    }

    /* Interaksi tiap feature */
    function onEachFeature(feature, layer){

        var props = feature.properties;

        var popupContent = `
            <div style="font-size:14px">
                <h3>Informasi Kantah</h3>
                <hr>
                <b>Status Berkas:</b> ${props.STATUSBERK}
            </div>
        `;

        /* Popup */
        layer.bindPopup(popupContent);

        /* Tooltip */
        layer.bindTooltip(props.STATUSBERK, {
            sticky: true
        });

        /* Event */
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    var geojson = L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    map.fitBounds(geojson.getBounds());

});


/* Menampilkan koordinat klik */
map.on('click', function(e){

    console.log(
        "Koordinat:",
        e.latlng.lat,
        e.latlng.lng
    );

});


/* Legend */
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map){

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML = `
        <div style="
            background:white;
            padding:10px;
            border-radius:5px;
            box-shadow:0 0 5px rgba(0,0,0,0.3);
        ">
            <h4>Keterangan</h4>

            <div style="
                width:20px;
                height:20px;
                background:red;
                display:inline-block;
                margin-right:5px;
            "></div>

        Status Berkas
        </div>
    `;

    return div;
};

legend.addTo(map);