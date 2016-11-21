var map = L.map('map').fitWorld();

var geojsonMarkerOptions = {
    radius: 4,
    fillColor: "red",
    color: "",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.3
};

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

//get zip codes geojson file and add it to the map
$.getJSON('data/zips.geojson', function(zip_codes) {
    geojson = L.geoJson(zip_codes, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
});

//this function returns a style object
function style(feature) {
    return {
        fillColor: '',
        weight: 1,
        opacity: 0.5,
        color: 'blue',
        dashArray: '',
        fillOpacity: 0
    };
}

//this is executed once for each feature in the data, and adds listeners
function onEachFeature(feature, layer) {
    layer.on({
        /*mouseover: mouseoverFunction,
        mouseout: resetHighlight,*/
        click: mouseClickFunction
    });
}

    var lastClickedLayer;

function mouseClickFunction(e) {
    var layer = e.target;


    if(lastClickedLayer){
        geojson.resetStyle(lastClickedLayer);
    }

    layer.setStyle({
        weight: 3,
        color: 'green',
        dashArray: '',
        fillOpacity: 0
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    //update the text in the infowindow with whatever was in the data
    console.log(layer.feature.properties.postalCode + ', ' + layer.feature.properties.borough);
    
    // $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&$where=within_circle(location, '+layer.feature.properties.latitude+', '+layer.feature.properties.longitude+ ', 402)', function(zip_comps) {
    // $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&incident_zip='+layer.feature.properties.postalCode+'&$limit=5000', function(zip_comps) {
    // $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL'+'&incident_zip='+layer.feature.properties.postalCode+'&complaint_type=Noise', function(zip_comps) {
    $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
        geojson = L.geoJson(zip_comps, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
    });

    lastClickedLayer = layer;
}

// this runs on mouseout
// function resetHighlight(e) {
//     geojson.resetStyle(e.target);
// }

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({
    setView: true,
    maxZoom: 16
});