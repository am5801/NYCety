var map = L.map('map').fitWorld();
var lastClickedLayer;
var geojson_zips;
var geojson_comps = new L.FeatureGroup();
var layer;
var geojsonMarkerOptions = {
    radius: 4,
    fillColor: "black",
    color: "",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
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
    geojson_zips = L.geoJson(zip_codes, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
});

//this function returns a style object
function style(feature) {
    return {
        fillColor: '',
        weight: 1,
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

function mouseClickFunction(e) {
    layer = e.target;
    geojson_comps.clearLayers();
    if(lastClickedLayer != layer){
        // map.removeLayer(lastClickedLayer);
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
        
        $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&$limit=5000&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
                var comps = L.geoJson(zip_comps, {
                    pointToLayer: function(feature, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                });
                geojson_comps.addLayer(comps);
            });
        map.addLayer(geojson_comps);
    } else {
        geojson_comps.clearLayers();
    }
    lastClickedLayer = layer;
}

// this runs on mouseout
// function resetHighlight(e) {
//     geojson.resetStyle(e.target);
// }

// Clear Complaints
$("#clearComp").click(function(){
    geojson_comps.clearLayers();
});


// All Complaints
$("#allComp").click(function(){
    geojson_comps.clearLayers();
    $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&$limit=5000&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
            var comps = L.geoJson(zip_comps, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            });
            geojson_comps.addLayer(comps);
        });
    map.addLayer(geojson_comps);
});

// Dirty Conditions Complaints
$("#dirty").click(function(){
    geojson_comps.clearLayers();
    $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&complaint_type=Dirty+Conditions&$limit=5000&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
            var comps = L.geoJson(zip_comps, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            });
            geojson_comps.addLayer(comps);
        });
    map.addLayer(geojson_comps);
});

// Air Quality Complaints
$("#airQual").click(function(){
    geojson_comps.clearLayers();
    $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&complaint_type=Air+Quality&$limit=5000&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
            var comps = L.geoJson(zip_comps, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            });
            geojson_comps.addLayer(comps);
        });
    map.addLayer(geojson_comps);
});

// Noise Complaints
$("#noise").click(function(){
    geojson_comps.clearLayers();
    $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&complaint_type=Noise&$limit=5000&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
            var comps = L.geoJson(zip_comps, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            });
            geojson_comps.addLayer(comps);
        });
    map.addLayer(geojson_comps);
});

// Street Condition Complaints
$("#street").click(function(){
    geojson_comps.clearLayers();
    $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&complaint_type=Street+Condition&$limit=5000&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
            var comps = L.geoJson(zip_comps, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            });
            geojson_comps.addLayer(comps);
        });
    map.addLayer(geojson_comps);
});

// Rodents Complaints
$("#rodent").click(function(){
    geojson_comps.clearLayers();
    $.getJSON('https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$$app_token=TA8ytxeF7s5CL1q8wOU1dbmnL&complaint_type=Rodent&$limit=5000&incident_zip='+layer.feature.properties.postalCode, function(zip_comps) {
            var comps = L.geoJson(zip_comps, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            });
            geojson_comps.addLayer(comps);
        });
    map.addLayer(geojson_comps);
});

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({
    setView: true,
    maxZoom: 16
});