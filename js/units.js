/**
 * units.js
 * 
 * Units in the RCC:
 *  All calculations are done in metric. By enforcing this
 *  standard, there is no need to track mismatched units
 *  that aren't made obvious in screen output. Think of the
 *  system as a filter where the only time units are
 *  converted is when they pass from internal (javascript)
 *  to the screen (HTML/HighChart) and vice versa.
 * 
 * @author Dan Cobb
 * @since v1.3.0
 * @date September 18, 2012
 */


// --- Enumerated Unit Types ---
var u_metric = 0;
var u_us = 1;

var current_unit = u_us;


var factor_L2gal = 0.264172052;
var factor_mm2in = 0.0393700787;
var factor_km2mi = 0.621371192;
var factor_m22ft2 = 10.7639104;
var factor_m2ft = 3.2808399;
var factor_kg2lb = 2.20462262;

// unit conversions
// use as (BNF): <value>*<unit_array>[current_unit]
var unit_L = [1, factor_L2gal];
var unit_mm = [1, factor_mm2in];
var unit_km = [1, factor_km2mi];
var unit_m = [1, factor_m2ft];
var unit_m2 = [1, factor_m22ft2];
var unit_kg = [1, factor_kg2lb];

// unit names
var unit_name_L = ["L", "gal"];
var unit_name_mm = ["mm", "in"];
var unit_name_km = ["km", "mi"];
var unit_name_m = ["m", "ft"];
var unit_name_m2 = ["m&sup2;", "ft&sup2;"];
var unit_name_kg = ["kg", "lb"];



// switch between US and metric
// callback for units button
function toggleGlobalUnit() {
    var new_unit = (current_unit == u_us) ? u_metric : u_us;
    setGlobalUnit(new_unit);
    
    // regraph if currently showing a graph
    if ($("#graph_area").is(":visible")) {
        changeGraphic( currentGraphic ); // regraph
    }
}


// change the global unit and update the page
function setGlobalUnit(new_unit) {
    var old_unit = current_unit;
    
    // update the global
    current_unit = new_unit;
    
    // update page button
    $("#unit_setting").html((current_unit) ? "US" : "metric");
    
    // update the page titles
    $(".unit_mm").html(unit_name_mm[current_unit]);
    $(".unit_m").html(unit_name_m[current_unit]);
    $(".unit_km").html(unit_name_km[current_unit]);
    $(".unit_L").html(unit_name_L[current_unit]);
    $(".unit_m2").html(unit_name_m2[current_unit]);
    
    // update input boxes
    convertArea(old_unit);
    convertPrecipitation(old_unit);
    convertDistance(old_unit);
    convertUsage(old_unit);
}


// convert input value to current units
function convertArea(old_unit) {
    var val_area = stringToInt($("#io_input_area").val());
    val_area /= unit_m2[old_unit]; // to metric
    val_area *= unit_m2[current_unit]; // to current
    val_area = roundToFixed(val_area, 1);
    
    $("#io_input_area").val(val_area);
    $("#out_area").html(val_area + " " + unit_name_m2[current_unit]);
    
    // adjust first flush
    setFirstFlush();
}

function convertDistance(old_unit) {
    var val_dist = stringToInt($("#input_storage_box").val());
    val_dist /= unit_m[old_unit]; // to metric
    val_dist *= unit_m[current_unit]; // to current
    val_dist = roundToFixed(val_dist, 1);
    
    $("#input_storage_box").val(val_dist);
    $("#out_flush_dist").html(val_dist + " " + unit_name_m[current_unit]);
}

function convertPrecipitation(old_unit) {
    var val_rain;
    for (var i = 0; i < 12; i += 1) {
        val_rain = stringToInt($("#io_rain_inputs_" + i + "_box").val());
        val_rain /= unit_mm[old_unit]; // to metric
        val_rain *= unit_mm[current_unit]; // to current
        val_rain = roundToFixed(val_rain, 1);
        
        $("#io_rain_inputs_" + i + "_box").val(val_rain);
    }
    
    // update the calculations for rainfall
    newPrecipitation();
}

function convertUsage(old_unit) {
    var val_use;
    for (var i = 0; i < 12; i += 1) {
        val_use = stringToInt( $("#input_usage_" + i + "_box").val() );
        val_use /= unit_L[old_unit]; // to metric
        val_use *= unit_L[current_unit]; // to current
        val_use = roundToFixed(val_use, 0);
        
        $("#input_usage_" + i + "_box").val(val_use);
    }
    
    // update the calculations for rainfall
    newUsage();
}
