/**
 * graphs.js
 * 
 * @author Dan Cobb
 * @since v1.3.0
 * @date September 18, 2012
 */

// sweet plotting colors
var c_red = "#DF5353";
var c_blue = "#7798BF";

var chart;
function graphPrecipitation() {
    var precipitation = [];
    var i_precip, i_dist;
    // load an array with precip values from input box
    for (var i=0; i<12; i++) {
        // check against NaN and no data
        i_precip = stringToInt($("#io_rain_inputs_" + i + "_box").val());
        
        $("#io_rain_inputs_" + i + "_box").val(i_precip);
        precipitation[i] = i_precip;
    }
    
    // load the station distance
    if (json == null) {
        // no map data
        i_dist = "(n/a)";
    } else {
        i_dist = roundToFixed(s_dist*unit_km[current_unit], 2);
    }
    
    // apply the theme -> colors
    Highcharts.theme = {
       colors: [c_blue]
    };
    Highcharts.setOptions(Highcharts.theme);
    
    
    // make the actual graph
    chart = new Highcharts.Chart({
        chart: {
            renderTo: "graph_area",
            defaultSeriesType: "column",
            width: 469
        },
        title: {
            text: "Monthly Average Rainfall (" + unit_name_mm[current_unit] + ")"
        },
        subtitle: {
            text: (
                "Station Distance: " + i_dist + unit_name_km[current_unit] + " - " +
                "Total Annual: " + roundToFixed(p_year*unit_mm[current_unit], 1) + unit_name_mm[current_unit]
            )
        },
        xAxis: {
            categories: [
                'Jan', 
                'Feb', 
                'Mar', 
                'Apr', 
                'May', 
                'Jun', 
                'Jul', 
                'Aug', 
                'Sep', 
                'Oct', 
                'Nov', 
                'Dec'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            stackLabels: {
                enabled: true,
                rotation: -35,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                },
                formatter: function () {
                    return this.total;
                }
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function () {
                return (
                    this.x + ": " + this.y + unit_name_mm[current_unit]
                );
            }
        },
        plotOptions: {
            column: {
                stacking: "normal",
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            data: precipitation
        }]
    });
}


// graph the water usage chart
function graphUsage() {
    var need = [];
    var supply = [];
    var i_use, i_total = 0;
    
    // load an array with precip values from input box
    for (var i = 0; i < 12; i += 1) {
        // check against NaN and no data
        i_use = getUsage(i);
        
        // track total
        i_total += i_use;
        
        // find supply
        supply[i] = Math.round(calc_supply(i, false));
        // find need
        need[i] = Math.round((i_use - supply[i])*unit_L[current_unit]);
        
        // adjust supply unit
        supply[i] = Math.round(supply[i]*unit_L[current_unit]);
    }
    
    i_total = roundToFixed(i_total*unit_L[current_unit], 0);
    
    // apply the theme -> colors
    Highcharts.theme = {
       colors: [c_red, c_blue]
    };
    Highcharts.setOptions(Highcharts.theme);
    
    
    // make the actual graph
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_area',
            defaultSeriesType: 'column',
            width: 469
        },
        title: {
            text: "Monthly Average Water Usage (" + unit_name_L[current_unit] + ")"
        },
        subtitle: {
            text: "Total Annual Usage: " + i_total + unit_name_L[current_unit]
        },
        xAxis: {
            categories: [
                'Jan', 
                'Feb', 
                'Mar', 
                'Apr', 
                'May', 
                'Jun', 
                'Jul', 
                'Aug', 
                'Sep', 
                'Oct', 
                'Nov', 
                'Dec'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            stackLabels: {
                enabled: true,
                rotation: -35,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                },
                formatter: function () {
                    return this.total;
                }
            }
        },
        legend: {
            layout: 'vertical',
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'top',
            x: -8,
            y: -8,
            floating: true,
            shadow: true
        },
        tooltip: {
            formatter: function () {
                return (
                    "<b>" + this.x + "</b><br/>" +
                    this.series.name + ": " + this.y + unit_name_L[current_unit] + "<br/>" +
                    "Usage: " + this.point.stackTotal + unit_name_L[current_unit]
                );
            }
        },
        plotOptions: {
            column: {
                stacking: "normal",
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: "Need",
            data: need
        }, {
            name: "Supply",
            data: supply
        }]
    });
    
}


// graph the storage levels chart
function graphStorage() {
    var tank_size = current_tank_size;
    loadStorageValues(tank_size, false);
    
    // adjust tank size unit
    tank_size = Math.round(tank_size*unit_L[current_unit]);
    
    // adjust storage_data units
    var storage_data_adjusted = [];
    for (var i = 0; i < 12; i += 1) {
        storage_data_adjusted[i] = Math.round(storage_data[i] * unit_L[current_unit]);
    }
    
    // apply the theme -> colors
    Highcharts.theme = {
       colors: [c_blue]
    };
    Highcharts.setOptions(Highcharts.theme);
    
    // make the actual graph
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_area',
            defaultSeriesType: 'column',
            width: 469
        },
        title: {
            text: "Estimated End-Of-Month Tank Levels (" + unit_name_L[current_unit] + ")"
        },
        subtitle: {
            text: "Estimated Minimum Tank Size: " + tank_size + unit_name_L[current_unit]
        },
        xAxis: {
            categories: [
                'Jan', 
                'Feb', 
                'Mar', 
                'Apr', 
                'May', 
                'Jun', 
                'Jul', 
                'Aug', 
                'Sep', 
                'Oct', 
                'Nov', 
                'Dec'
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            stackLabels: {
                enabled: true,
                rotation: -35,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                },
                formatter: function () {
                    return this.total;
                }
            }
            
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function () {
                return (
                    this.x + ": " + this.y + unit_name_L[current_unit]
                );
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            data: storage_data_adjusted
        }]
    });
}


// graph the storage levels chart
function graphHeadLoss() {
    var head_loss_vals = getHeadLossValues();
    var flow = calc_flow(); // in GPM
    flow = roundToFixed(flow, 1);
    
    // apply the theme -> colors
    Highcharts.theme = {
       colors: [c_blue]
    };
    Highcharts.setOptions(Highcharts.theme);
    
    
    // make the actual graph
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_area',
            defaultSeriesType: 'spline',
            width: 469
        },
        title: {
            text: "Head Loss vs Pipe Diameter"
        },
        subtitle: {
            text: "Estimated Maximum Flow Through Downspout: " + flow + "GPM"
        },
        xAxis: {
            title: {
                enabled: true,
                text: "Pipe Diameter"
            },
            labels: {
                formatter: function () {
                    return this.value + "in";
                }
            },
            maxPadding: 0.05,
            showLastLabel: true
        },
        yAxis: {
            min: 0,
            title: {
                text: "Head Loss"
            },
            labels: {
                formatter: function () {
                    return this.value + unit_name_m[current_unit];
                }
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function () {
                return "Diameter: " + this.x + "in<br/>Height: " + this.y + unit_name_m[current_unit];
            }
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            data: head_loss_vals
        }]
    });
}
