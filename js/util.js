/**
 * util.js
 * 
 * @author Dan Cobb
 * @since v1.3.0
 * @date September 18, 2012
 */

// toggle Map with Graph
function showGraph() {
    $("#map_area").hide();
    $("#graph_area").show();
}


// toggle Graph with Map
function showMap() {
    $("#map_area").show();
    $("#graph_area").hide();
    
    // resize the GMap
    map.checkResize();
}


var currentGraphic = "map";
// change the graphic div to show a graph
// NOTE: do NOT call until AFTER the GMap has
//       been created!
function changeGraphic(type) {
    // update graphic tracker
    currentGraphic = type;
    
    // ensure graph is visible
    showGraph();
    
    // make the graph
    if (type == "precipitation") {
        graphPrecipitation();
    } else if (type == "consumption") {
        graphUsage();
    } else if (type == "storage") {
         graphStorage();
    } else if (type == "downspout") {
        graphHeadLoss();
    } else if (type == "map") {
        showMap();
    
    // add the close button
    $("#graph_area").prepend("<img onclick='showMap();' id='img_close_graph' src='close.png'/>");
}


// called when the area input has been updated
// . updates the standard output with the change
function newArea() {
    $("#out_area").html($("#io_input_area").val() + " " + unit_name_m2[current_unit]);
    
    // adjust annual harvest
    setAnnualHarvest();
    
    // adjust tank estimate
    updateTankSize();
    
    // adjust first flush
    setFirstFlush();
    
    return true;
}


// . updates the standard output with the change
function newDistance() {
    var i_dist = stringToInt($("#input_storage_box").val());
    
    $("#out_flush_dist").html(i_dist + " " + unit_name_m[current_unit]);
    
    return true;
}


// pass all input box values through the stringToInt function
function validateAllInputs() {
    var i_val;
    // first, validate all month inputs - usage and rainfall
    for (var i = 0; i < 12; i += 1) {
        // usage
        i_val = stringToInt($("#input_usage_" + i + "_box").val()) * unit_L[current_unit];
        i_val = Math.round(i_val);
        $("#input_usage_" + i + "_box").val(i_val);
        // rainfall
        i_val = stringToInt($("#io_rain_inputs_" + i + "_box").val()) * unit_mm[current_unit];
        i_val = Math.round(i_val);
        $("#io_rain_inputs_" + i + "_box").val(i_val);
    }
    
    // area
    i_val = stringToInt($("#io_input_area").val()) * unit_m2[current_unit];
    i_val = Math.round(i_val);
    $("#io_input_area").val(i_val);
    // distance
    i_val = stringToInt($("#input_storage_box").val()) * unit_L[current_unit];
    i_val = Math.round(i_val);
    $("#input_storage_box").val(i_val);
}


// resets all prcipitation and area values to those from the GMap
function resetAllValues() {
    // reset precipitation values
    if (json != null) {
        loadPrecipitationValues();
        newPrecipitation();
    }
    
    // reload area
    $("#io_input_area").val(Math.round(roofarea.toFixed(5) * unit_m2[current_unit]));
    newArea(); // update standard output
}


var defaultUsage = 11356; // Litres


// reset all the calculations on the page to their
//     onload values
// tank size is refreshed via calls to new -area and -precip
function clearAllValues() {
    // clear precipitation values
    for (var i = 0; i < 12; i += 1) {
        $("#io_rain_inputs_" + i + "_box").val(""); // rainfall
        $("#input_usage_" + i + "_box").val(Math.round(defaultUsage*unit_L[current_unit])); // usage
    }
    newPrecipitation();
    
    // clear area value
    $("#io_input_area").val("");
    newArea();
}


// loads a container with month - input pairs
// div_id is the id of the container
// the elements must be positioned absolutely
// type -> {'precip', 'usage'}
// precip callback = newPrecipitation/0
// usage callback = newUsage/0
function loadMonths(div_id, type) {
    // create an array of month names
    var mo_names = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // assign the callback
    var callback, i_space, i_len, i_val;
    if (type == "precip") {
        i_len = 5;
        i_space = 40;
        callback = "newPrecipitation();";
        i_val = "";
    } else if (type == "usage") {
        i_len = 6;
        i_space = 35;
        callback = ""; // bound in setAutoFill/1
        i_val = Math.round(defaultUsage * unit_L[current_unit]);
    }
    
    var html = "";
    // insert month names on top of input boxes in div pairs
    for (var i = 0; i < 12; i += 1) {
        html += (
            "<div id='" + div_id + "_" + i + "' " +
                "class='month_pair_" + type + "' " +
                "style='left: " + (i * i_space) + "px;'>"
        );
        
        html += "<span class='mp_text'>" + mo_names[i] + "</span><br />"
        html += (
            "<input type='text' " +
                "onkeypress='return isNumberKey(event);' " +
                "onkeyup='return " + callback + "' " +
                "id='" + div_id + "_" + i + "_box' " +
                "class='mp_box_" + type + "' " +
                "value='" + i_val + "' " +
                "maxlength='" + i_len + "' />"
        );
        
        html += "</div>";
    }
    
    // load the html into the container
    $("#" + div_id).html(html);
}


// recalculate the yearly total
function newPrecipitation() {
    p_year = 0;
    
    // find new yearly total
    for (var i = 0; i < 12; i += 1) {
        p_year += getRainfall(i); // p_year is metric mm
    }
    
    var rain = roundToFixed(p_year * unit_mm[current_unit], 1);
    
    // update output
    $("#out_rain").html(rain + " " + unit_name_mm[current_unit]);
    
    // adjust annual harvest
    setAnnualHarvest();
    
    // adjust tank estimate
    updateTankSize();
    
    return true;
}


// new usage values have been input, so recalculate page
function newUsage() {
    updateTankSize();
    return true;
}


var current_tank_size = 0;
// refresh the tank size and load it into the page
function updateTankSize() {
    current_tank_size = getTankSize();
    
    var size = current_tank_size * unit_L[current_unit];
    size = Math.round(size);
    
    $("#out_tank").html(size + " " + unit_name_L[current_unit]);
    ensureTankSize(); // update input box
    
    // update weight
    setTankWeight();
}


// turns a string into an RCC validated int
function stringToInt(str) {
    var i_check = parseFloat(str); // ensure base 10
    
    // -99 is error code for no rainfall data
    if (isNaN(i_check) || i_check == -99) {
        i_check = 0;
    }
    
    return i_check;
}


// true enables all boxes => false disables
function setPrecipitationBoxes(state) {
    for (var i = 0; i < 12; i += 1) {
        $("#io_rain_inputs_" + i + "_box").attr("disabled", !state);
    }
}


function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode <= 31 || charCode == 46 || (charCode >= 48 && charCode <= 57))
        return true;
        
    return false;
}


// called when a new material was selected
function newMaterial() {
    // load the new material name into output
    $("#out_material").html($("#input_material_box option:selected").text());
    // load the new material value into output
    $("#out_efficiency").html(getEfficiency() * 100 + "%");
    
    // adjust annual harvest
    setAnnualHarvest();
    
    // adjust tank estimate
    updateTankSize();
    
    // update graphic
    if (currentGraphic == "storage") {
        changeGraphic(currentGraphic);
    }
}


// update page with value from tank size input
function newTankSize() {
    // override tank size
    current_tank_size = getTankInput();
    
    // never less than storage_min
    current_tank_size = Math.max(storage_min, current_tank_size);
    
    var tank_convert = Math.round(current_tank_size * unit_L[current_unit]);
    
    // update output
    $("#out_tank").html(tank_convert + " " + unit_name_L[current_unit]);
    
    // load in new tank values with this custom size
    loadStorageValues(current_tank_size, false);
    
    // update weight
    setTankWeight();
    
    return true;
}


// update input box if value is less than storage_min
// called onblur of input box
function ensureTankSize() {
    $("#input_tank_box").val(Math.round(current_tank_size * unit_L[current_unit]));
}


function enableDoneButton() {
    // ensure position
    clearDoneButton();
    
    // animate
    $("#b_done").attr("disabled", false);
    
    $("#img_arrow_left").show();
    $("#img_arrow_left").animate({
        left: "+=84"
    }, 500);
    
    $("#img_arrow_right").show();
    $("#img_arrow_right").animate({
        right: "+=85"
    }, 500);
}


function clearDoneButton() {
    $("#b_done").attr("disabled", true);
    
    // setup the left arrow image
    $("#img_arrow_left").css("position", "absolute");
    $("#img_arrow_left").css("left", "110px");
    $("#img_arrow_left").css("bottom", "5px");
    $("#img_arrow_left").hide();
    // the right arrow image
    $("#img_arrow_right").css("position", "absolute");
    $("#img_arrow_right").css("right", "110px");
    $("#img_arrow_right").css("bottom", "5px");
    $("#img_arrow_right").hide();
}


function clearResetArrow() {
    $("#img_arrow_reset").css("position", "absolute");
    $("#img_arrow_reset").css("left", "179px");
    $("#img_arrow_reset").css("bottom", "5px");
    $("#img_arrow_reset").hide();
}


function enableResetArrow() {
    // ensure position
    clearResetArrow();
    
    // animate
    $("#img_arrow_reset").show();
    $("#img_arrow_reset").animate({
        left: "-=85"
    }, 500);
}


// callback for onkeyup when autofilling
function doAutoFill() {
    // get autofill value
    var i_val = $("#input_usage_0_box").val();
    
    // set values of other input boxes
    for (var i = 1; i < 12; i += 1)
        $("#input_usage_" + i + "_box").val(i_val);
    
    // recalculate
    newUsage();
}


// turn on/off auto fill option on the page -> not in code
// to adjust code autofill value, see toggleAutoFill/0
// .. I know, the names suck
//
// true -> enables autofill / disables inputs
// false -> disables autofill / enables inputs
function setAutoFill(state) {
    // dis/en-able all months except january
    for (var i = 1; i < 12; i += 1) {
        $("#input_usage_" + i + "_box").attr("disabled", state);
    }
    
    // unbind old callback
    $("#input_usage_0_box").unbind("keyup");
    
    // set new onkeyup event callback
    if (state) {
        // start autofilling
        $("#input_usage_0_box").keyup(doAutoFill);
        doAutoFill(); // perform the autofill function
    } else {
        // stop autofilling
        $("#input_usage_0_box").keyup(newUsage);
    }
}


var autofill_state = false; // true = on
// toggle the autofill option
function toggleAutoFill() {
    // toggle the state
    autofill_state = !autofill_state;
    
    // set the new text
    var fill_text = (autofill_state) ? "on" : "off";
    $("#autofill_value").html(fill_text);
    
    // update the page
    setAutoFill(autofill_state);
}


// round to the specified number of radix points
// probably should be done with the Number.prototype,
// but it's the end of the project and I don't want to
// risk any problems
function roundToFixed(val, radix) {
    val *= Math.pow(10, radix);
    val = Math.round(val);
    val /= Math.pow(10, radix);
    return val;
}
