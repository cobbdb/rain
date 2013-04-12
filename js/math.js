/**
 * math.js
 * 
 * @author Dan Cobb
 * @since v1.3.0
 * @date September 18, 2012
 */

// get a month's rainfall
function getRainfall(mo_index) {
    var str_val = stringToInt($("#io_rain_inputs_" + mo_index + "_box").val());
    str_val /= unit_mm[current_unit];
    return str_val;
}


// get a month's usage
function getUsage(mo_index) {
    var str_val = stringToInt($("#input_usage_" + mo_index + "_box").val());
    str_val /= unit_L[current_unit];
    return str_val;
}


// get the area of the project
function getArea() {
    var val_area = stringToInt($("#io_input_area").val());
    val_area /= unit_m2[current_unit]; // ensure metric
    return val_area;
}


// get the project's rooftop efficiency
function getEfficiency() {
    var eff = $("#input_material_box").val();
    eff = parseFloat(eff);
    return eff;
}


// get storage distance in metres
function getDistance() {
    var i_dist = stringToInt($("#input_storage_box").val());
    i_dist /= unit_m[current_unit];
    return i_dist;
}


// get tank size in litres
function getTankInput() {
    var tank = stringToInt($("#input_tank_box").val());
    tank /= unit_L[current_unit]; // to metric
    return tank;
}


// find the current estimated minimum tank size
function getTankSize() {
    var tank_size = calc_storage_all(false);
    
    // correct for error codes
    
    // too large
    if (tank_size == -99) {
        // find max tank level
        var max_level = storage_data[0];
        for (var i = 1; i < 12; i += 1) {
            max_level = Math.max(max_level, storage_data[i]);
        }
        
        // if max tank level is less than storage_max
        // then that means not enough rain
        if (max_level < storage_max) {
            // never recommend lower than storage_min
            // this occurs when all water is used
            // -> max_level == 0 or less than storage_min
            max_level = Math.max(max_level, storage_min);
            tank_size = max_level;
        } else {
            // max_level == storage_max
            tank_size = "4000000";
        }
    } else if (tank_size == -88) {
        // too small
        tank_size = "10";
    }
    
    return tank_size;
}


// calculate the total potential rain harvest for the year and
//      load it into the page
function setAnnualHarvest() {
    var rain = p_year / 1000; // mm -> m
    var area = getArea(); // in m2
    var eff = getEfficiency();
    var harvest = rain * area * eff * 1000; // m^3 -> L
    harvest *= unit_L[current_unit];
    harvest = Math.round( harvest );
    
    $("#out_harvest").html(harvest + " " + unit_name_L[current_unit]);
}


// calculate the weight of tank when full of water
// weight is 1000kg/m3
function setTankWeight() {
    var tank = getTankInput(); // in L
    tank *= 0.001; // to m^3
    
    var weight = tank * 1000; // to kg
    weight *= unit_kg[current_unit]; // to current
    
    weight = roundToFixed(weight, 0);
    
    $("#out_weight").html(weight + " " + unit_name_kg[current_unit]);
}



// calculate and set the first flush range
// FF is 1-2gal for every 100sqr ft of roof
function setFirstFlush() {
    var roof = getArea(); // in m2
    roof *= factor_m22ft2; // to ft2
    
    var gal_low = roof * 1 / 100; // low pollution
    var gal_high = roof * 2 / 100; // high pollution
    
    // to metric
    gal_low /= factor_L2gal;
    gal_high /= factor_L2gal;
    // to current
    gal_low *= unit_L[current_unit];
    gal_high *= unit_L[current_unit];
    
    gal_low = roundToFixed( gal_low, 1 );
    gal_high = roundToFixed( gal_high, 1 );
    
    $("#out_first_flush").html(
        gal_low + " - " + gal_high + " " + unit_name_L[current_unit]
    );
}


/**
 * Hf=(0.00113 x L x Q^1.85)/d^4.87
 *
 * Where Hf=head loss (feet)
 * L=pipe length (feet)
 * Q=flow (gpm)
 * d=pipe inside diameter (inches)
 */
// calculate (pipe diameter, head loss) pairs
// returns array of value pairs in (in, ft)
// NOTE: this is the only time calculations aren't done
//       in metric. this is to cater to the equation.
function getHeadLossValues() {
    var heightMin = 0.0833333333; // 1in in ft
    var heightMax = 15; // in ft
    
    var flow = calcFlow(); // in GPM
    var length = getDistance(); // in m
    length *= factor_m2ft; // m -> ft
    
    // calculate the pipe diameter range to use
    var exp = 1 / 4.87;
    var coef = 0.00113 * length * Math.pow(flow, 1.85);
    var d_max = Math.pow(coef / heightMin, exp);
    var d_min = Math.pow(coef / heightMax, exp);
    
    var head_loss = []; // array of pairs
    var diam, height, index = 0; // pipe diameter in inches
    
    // find height,diam pairs in increments of 0.05 inches
    for (var diam = d_min; diam < d_max; diam += 0.05) {
        height = coef / Math.pow(diam, 4.87);
        
        // convert height to current unit
        height /= factor_m2ft; // ft -> m
        height *= unit_m[current_unit]; // to current
        
        height = roundToFixed(height, 2);
        diam = roundToFixed(diam, 2);
        
        // store value
        head_loss[index] = [diam, height]; // (x,y) pair
        index += 1;
    }
    
    return head_loss;
}


// calculate the water flow through the downspout
// returns in GPM
function calcFlow() {
    var area = getArea(); // in m^2
    
    var max_rainfall = 50; // violent rain in mm/hr
    max_rainfall /= 1000; // mm/hr -> m/hr
    max_rainfall /= 60; // m/hr -> m/min
    
    var flow = area * max_rainfall; // in m^3/min
    flow *= 264.172052; // gal / min (GPM)
    return flow;
}


// estimate the collection capacity for a given month
// mo_index is a month index in [0,11]
// returns Litres
function calc_capacity_mo(mo_index) {
    // get the values
    var i_area = getArea(); // sqr m
    var i_rain = getRainfall(mo_index); // mm
    var i_eff = getEfficiency();
    
    // convert rain units
    i_rain /= 1000; // mm -> m
    
    return (i_area * i_rain * i_eff) * 1000; // m^3 -> L
}


// estimate the storage level for a given month for a given tank size
// NOTE: may return negative
// mo_index is a month index in [0,11]
// prev_mo is the previous month's capacity in L
// tank_size is the size of the storage tank in L
function calc_storage_mo(mo_index, prev_mo, tank_size) {
    var i_use = getUsage(mo_index);
    var i_cap = calc_capacity_mo(mo_index);
    
    // find the ideal new water level -> infinite tank size
    var i_ideal = i_cap + prev_mo - i_use;
    
    // limit value at tank size
    return Math.min(i_ideal, tank_size);
}


// calculates the water supplied (if any) for a given month
// usage = supply + need
// NOTE: uses current_tank_size
function calc_supply(mo_index, full_tank) {
    var stored;
    var usage = getUsage(mo_index);
    
    // calculate the supply
    // supply = prev + cap
    var capacity = calc_capacity_mo(mo_index);
    
    if (mo_index == 0) {
        stored = (full_tank) ? current_tank_size : 0; // jan
    } else {
        stored = storage_data[ mo_index - 1 ]; // last month
    }
    
    var supply = stored + capacity;
    
    // supply cannot exceed usage
    supply = Math.min(supply, usage);
    // supply cannot exceed tank size
    //supply = Math.min( supply, current_tank_size );
    
    return supply;
}



// check each month to see if a tank_size will work
function sizeIsGood(tank_size, full_tank) {
    var this_mo; // the current month's storage level
    var prev_mo; // the previous month's storage level
    var size_is_good = true;
    
    // fill the tank or not
    prev_mo = (full_tank) ? tank_size : 0;
    
    // find all the storage values
    for (var i = 0; i < 12; i += 1) {
        // get this month's storage level
        this_mo = calc_storage_mo(i, prev_mo, tank_size);
        
        // check the tank size
        if (this_mo <= min_tank_val) {
            size_is_good = false;
            break; // exit the for loop
        }
        
        // advance the values
        prev_mo = this_mo;
    }
    
    return size_is_good;
}



var storage_max = 4000000; // 4mill max capacity of any recommended tank
var storage_min = 10; // minimum capacity of any recommended tank
var min_tank_val = 5;// minimum capacity for calculations

// find the minimum tank size, and populate storage data
// NOTE: loads storage_data with 12 values in [0,11]
// full_tank is a bool, true if tank is full on first month
function calc_storage_all(full_tank) {
    var tank_min = 0, tank_max = storage_max; // bounds in L
    var tank_size = tank_min; // starting point
    var good_size;
    var i, exit = false;
    // 0 is healthy
    // -1 is too small
    // 1 is too large
    var err_code = 0;
    
    // perform a binary search of the tank sizes to find the min
    //     value that works
    do {
        // find the next integer tank size
        tank_size = (tank_min + tank_max) / 2;
        tank_size = Math.round(tank_size);
        
        // check the tank size
        good_size = sizeIsGood(tank_size, full_tank);
        
        // check for exit
        if (tank_min == tank_max) {
            // tank_size is too large
            err_code = 1;//alert("too large");
            exit = true; // no match possible
        } else if (good_size && tank_size < storage_min) {
            // tank_size is too small
            err_code = -1;//alert("too small");
            exit = true;
        } else if (good_size && tank_size == tank_max) {
            // tank_size is just right
            err_code = 0;
            exit = true; // found match
        }
        
        // update the search bounds
        if (good_size) {
            tank_max = tank_size; // new max
        } else {
            tank_min = tank_size; // new min
        }
    } while (!exit); // search loop
    
    // return the tank size
    if (err_code > 0) {
        // too large
        tank_size = -99;
    } else if (err_code < 0) {
        // too small
        tank_size = -88;
    }
    
    loadStorageValues(tank_size, full_tank);
    
    return tank_size;
}


var storage_data = []; // monthly tank water level estimates
// load in tank level estimates
// tank_size of -99 will use storage_max
// tank_size of -88 will use storage_min
function loadStorageValues(tank_size, full_tank) {
    var this_mo;
    
    // adjust for error code
    if (tank_size == -99) {
        // too large
        tank_size = storage_max;
    } else if (tank_size == -88) {
        // too small
        tank_size = storage_min;
    }
    
    // load storage data with good tank size
    // fill the tank or not
    var prev_mo = (full_tank) ? tank_size : 0;
    // find all the storage values
    for (var i = 0; i < 12; i += 1) {
        // get this month's storage level
        this_mo = calc_storage_mo(i, prev_mo, tank_size);
        
        // bound at 0
        this_mo = Math.max(this_mo, 0);
        
        // load the value
        storage_data[i] = Math.round(this_mo); // nearest Litre
        
        // advance the values
        prev_mo = this_mo;
    }
}
