/**
 * rainmap.js
 * 
 * @author Dan Cobb
 * @since v2.0.0
 * @date October 15, 2012
 */

var map = null;
var geocoder = null;
var roofareanew, percentflushes;

var poly;
var count = 0;
var points = [];
var markers = [];
var icon_url = "./";
var tooltip;
var report = document.getElementById("out_area");
var mapExtension, identifyTask, layers, overlays;
var mapLocked = false;

var json;
var s_dist = 0;


function addIcon(icon) {
    // Add icon properties
    icon.shadow= icon_url + "mm_20_shadow.png";
    icon.iconSize = new GSize(12, 20);
    icon.shadowSize = new GSize(22, 20);
    icon.iconAnchor = new GPoint(6, 20);
    icon.infoWindowAnchor = new GPoint(5, 1);
}


function showTooltip(marker) {
    // Display tooltips
    tooltip.innerHTML = marker.tooltip;
    tooltip.style.display = "block";
    
    // Tooltip transparency specially for IE
    if ((typeof tooltip.style.filter) == "string") {
        tooltip.style.filter = "alpha(opacity:70)";
    }
    
    var currtype = map.getCurrentMapType().getProjection();
    var point= currtype.fromLatLngToPixel(map.fromDivPixelToLatLng(new GPoint(0, 0), true), map.getZoom());
    var offset= currtype.fromLatLngToPixel(marker.getLatLng(), map.getZoom());
    var anchor = marker.getIcon().iconAnchor;
    var width = marker.getIcon().iconSize.width + 6;
    // var height = tooltip.clientHeight +18;
    var height = 10;
    var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(
        offset.x - point.x - anchor.x + width,
        offset.y - point.y - anchor.y - height
    )); 
    pos.apply(tooltip);
}


function CustomGetTileUrlRain(a, b) {
    return "http://www.laudontech.com//save-the-rain//Z" + b + "/" + a.y + "_" + a.x + ".png"; // replace that with a "real" URL
    return G_PHYSICAL_MAP.getTileLayers()[0].getTileUrl(a, b);
}
    

function initialize() {
    var container = document.getElementById("mapcontent");
    map = new GMap2(container, {
        draggableCursor: "crosshair",
        draggingCursor: "move"
    });
    
    mapExtension = new esri.arcgis.gmaps.MapExtension(map);
    
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    map.getPane(G_MAP_MARKER_PANE).appendChild(tooltip);

    map.setUIToDefault();

    map.setMapType(G_HYBRID_MAP);
    
    map.setCenter(new GLatLng(40.872738, -124.077417), 18);
     
    var copyrightCollection = new GCopyrightCollection('Map Data:')
    var copyright = new GCopyright(1, new GLatLngBounds(
        new GLatLng(-90, -180),
        new GLatLng(90, 180)
    ), 0, "Rainfall");
    copyrightCollection.addCopyright(copyright);

    var tilelayersRain = [];

    tilelayersRain[0] = new GTileLayer(copyrightCollection, 4, 11);
    tilelayersRain[0].getTileUrl = function () {
        return "http://www.laudontech.com//zsevanston//blank2.png";
    };
    tilelayersRain[0].getOpacity = function () {
        return 1.0; //of the non transparent part
    };
    tilelayersRain[0].isPng = function () {
        return true;
    };
    tilelayersRain[1] = G_NORMAL_MAP.getTileLayers()[0];
    tilelayersRain[2] = new GTileLayer(copyrightCollection, 3, 11);
    tilelayersRain[2].getTileUrl = CustomGetTileUrlRain
    tilelayersRain[2].getOpacity = function () {
        return 0.7; //of the non transparent part
    };
    tilelayersRain[2].isPng = function () {
        return true;
    };
    
    var GMapTypeOptions = {};
    GMapTypeOptions.minResolution = 1;
    GMapTypeOptions.maxResolution = 11;
    GMapTypeOptions.errorMessage = "No map data available";
        
    var custommapRain = new GMapType(tilelayersRain, new GMercatorProjection(24), "Rainfall", GMapTypeOptions);
    custommapRain.getTextColor = function () {
        return "#ffffff";
    };
    map.addMapType(custommapRain);
    
    geocoder = new GClientGeocoder();
    map.disableDoubleClickZoom();
    
    GEvent.addListener(map, "click", leftClick);
        
    GEvent.addListener(map, "maptypechanged", function () {
        var newMapType = map.getCurrentMapType().getName(true);   
        if (newMapType == "Rainfall") {
            var zoomlevel = map.getZoom();
            if (zoomlevel >= 10) {
                map.setZoom(9);
            }
        }
    });
}


function leftClick(overlay, point) {
    if (point && !mapLocked) {
        count++;

        // Red marker icon
        var icon = new GIcon();
        icon.image = icon_url + "mm_20_red.png";
        addIcon(icon);

        // Make markers draggable
        var marker = new GMarker(point, {
            icon: icon,
            draggable: true,
            bouncy: false,
            dragCrossMove: true
        });
        map.addOverlay(marker);
        marker.content = count;
        markers.push(marker);
        marker.tooltip = "Point " + count;
        
        // unlock the go button on the third marker
        if (markers.length == 3) {
            enableDoneButton();
            $("#io_reset").show(); // show reset option
        }
        
        if (markers.length >= 3) {
            $("#io_input_area").attr("disabled", false);
        }
        
        GEvent.addListener(marker, "mouseover", function () {
            //showTooltip(marker);
        });

        GEvent.addListener(marker, "mouseout", function () {
            tooltip.style.display = "none";
        });

        // Drag listener
        GEvent.addListener(marker, "drag", function () {
            tooltip.style.display= "none";
            drawOverlay();
        });

        // Click listener to remove a marker
        GEvent.addListener(marker, "click", function () {
            tooltip.style.display = "none";

            // Find out which marker to remove
            for (var n = 0; n < markers.length; n += 1) {
                if (markers[n] == marker) {
                    map.removeOverlay(markers[n]);
                    break;
                }
            }

            // Shorten array of markers and adjust counter
            markers.splice(n, 1);
            if (markers.length == 0) {
                count = 0;
            } else {
                count = markers[markers.length - 1].content;
                drawOverlay();
            }
        });
        
        drawOverlay();
    }
}    


function drawOverlay() {
    if (poly) {
        map.removeOverlay(poly);
    }
    
    points.length = 0;
    for (var i = 0; i < markers.length; i += 1) {
        points.push(markers[i].getLatLng());
    }
    
    points.push(markers[0].getLatLng());
    poly = new GPolygon(points, "#FF0000", 2, 0.9, "#FF0000", 0.2);
    roofarea = poly.getArea();
    
    var unit = "m&sup2;";
    roofareanew = roofarea.toFixed(1);
    map.addOverlay(poly);
    $("#io_input_area").val(Math.round(roofarea.toFixed(1) * unit_m2[current_unit]));
    newArea(); // update standard output
}


function clearMap() {
    // Clear current map and reset globals
    map.clearOverlays();
    $("#out_harvest").html("");
    
    points.length = 0;
    markers.length = 0;
    count = 0;
    $("#out_area").html("");
    $("#out_rain").html("");
    
    clearDoneButton();
    clearResetArrow();
    $("#io_reset").hide();
    //$("#out_statation_dist").html("");
    
    json = null;
    clearAllValues(); // clear input override boxes
    mapLocked = false;
}


function removeAll() {
    map.clearOverlays();
    var boxes = document.getElementsByName("box");
    
    for (var i = 0; i < boxes.length; i += 1) {
        boxes[i].checked = false;
    }
}


// Finished button callback
function callWeather() {
    $("#b_addr").attr("disabled", true);
    $("#addressbox").attr("disabled", true);
    $("#io_reset").hide();
    
    $("#out_rain").html("..pending..");
    $("#out_harvest").html("..pending..");
    //$("#out_statation_dist").html("..pending..");
    
    // hide the arrows
    clearDoneButton();
    $("#b_reset").attr("disabled", true);
    clearResetArrow();
    
    mapLocked = true;
    $("#io_input_area").attr("disabled", true);
    
    var map_center = map.getCenter();
    
    $.ajax({
        url: "./rain.php",
        data: (
            "lat=" + map_center.lat() + "&" +
            "lng=" + map_center.lng()
        ),
        type: "GET",
        cache: false,
        dataType: "json",
        error: function (xhr) {
            alert(xhr.status + " : " + xhr.statusText);
            $("#b_reset").attr("disabled", false);
            enableResetArrow();
            // close the overlay
            $("#b_done[rel]").data("overlay").close();
        },
        success: function (json_response) {
            // response is a parsed JSON object
            json = json_response; // global data
            
            // hide map markers
            for (var i = 0; i < markers.length; i += 1) {
                markers[i].hide();
            }
            
            // center the map
            polycenter = poly.getBounds().getCenter();
            map.setCenter(polycenter);
            
            var val_convert = 0;
            
            // grab the precipitation data
            p_year = stringToInt(json["p_year"]); // in mm
            
            // station distance
            s_dist = stringToInt(json["s_dist"]);
            s_dist = roundToFixed(s_dist, 2);
            
            //val_convert = roundToFixed(s_dist*unit_km[current_unit], 2);
            //$("#out_statation_dist").html(val_convert + " " + unit_name_km[current_unit]);
            
            val_convert = roundToFixed(p_year * unit_mm[current_unit], 1);
            $("#out_rain").html(val_convert + " " + unit_name_mm[current_unit]);
            setAnnualHarvest();
            
            // show the directions
            showDirections(polycenter, json["s_lat"], json["s_lng"]);
            
            // show the graph menu options
            $("#rain_graph_link").show();
            
            // turn the UI back on
            $("#b_addr").attr("disabled", false);
            $("#addressbox").attr("disabled", false);
            $("#b_reset").attr("disabled", false);
            $("#io_reset").show();
            
            // close the overlay
            $("#b_done[rel]").data("overlay").close();
            
            // load the precipiation data into their text boxes
            setPrecipitationBoxes(true);
            loadPrecipitationValues();
            $("#io_input_area").attr("disabled", false);
            updateTankSize();
        }
    });      
}


// reset rainfall inputs to their json(map) values
function loadPrecipitationValues() {
    var rain_val;
    for (var i = 0; i < 12; i += 1) {
        rain_val = stringToInt(json["p_mo_" + i])
        rain_val *= unit_mm[current_unit];
        rain_val = roundToFixed(rain_val, 1);
        $("#io_rain_inputs_" + i + "_box").val(rain_val);
    }
}


// load directions from the current polycenter
function showDirections(gl_src, dest_lat, dest_lng) {
    var gl_dest = new GLatLng(dest_lat, dest_lng);
    
    // creat the two GMarkers
    var icon = new GIcon();
    icon.image = icon_url + "mm_20_red.png";
    addIcon(icon);
    var gm_station = new GMarker(gl_dest, {
        icon: icon
    });
    var gm_roof = new GMarker(gl_src, {
        icon: icon
    });
    map.addOverlay(gm_station);
    map.addOverlay(gm_roof);
    
    // create the GPolyline and center the map on it
    var gp_line = new GPolyline([
        gl_dest,
        gl_src
    ]);
    map.addOverlay(gp_line);
    map.setCenter(gp_line.getBounds().getCenter());
    map.setZoom(map.getBoundsZoomLevel(gp_line.getBounds()));
    
    // add map labels
    var el_html = '<div style="color:black;background-color:#ccccff;border:2px solid black">Station<\/div>';
    var el_station = new ELabel(gl_dest, el_html, null, new GSize(-24, 28), 75);
    el_html = '<div style="color:black;background-color:#ccccff;border:2px solid black">&nbsp;You&nbsp;<\/div>';
    var el_source = new ELabel(gl_src, el_html, null, new GSize(-18, 28), 75);
    map.addOverlay(el_station);
    map.addOverlay(el_source);
}


function showAddress(address) {
    var address = $("#addressbox").val();     
    clearMap();
    
    if (geocoder) {
        geocoder.getLatLng(address, function (point) {
            if (!point) {
                alert(address + " not found");
            } else {
                map.setMapType(G_HYBRID_MAP);
                map.setCenter(point, 17);
                map.clearOverlays();
            }
        });
    }
}


function mapInit() {
    initialize();
    
    // values for the starting area
    json = {
        s_lat: "40.872738",
        s_lng: "-124.077417",
        s_dist: "11.23",
        p_year: "991",
        p_mo_0:  "171",
        p_mo_1:  "145",
        p_mo_2:  "133",
        p_mo_3:  "80",
        p_mo_4:  "45",
        p_mo_5:  "18",
        p_mo_6:  "3",
        p_mo_7:  "6",
        p_mo_8:  "21",
        p_mo_9:  "64",
        p_mo_10: "135",
        p_mo_11: "170"
    };
    s_dist = 11.23;
}
