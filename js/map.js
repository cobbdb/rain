$(function () {
    $(window).resize(function () {
        var old = $("#map").height();
        var body = $(window).height();
        var banner = $("#pebw").height();
        var page = $("#page").outerHeight(true);
        $("#map").height(old + (body - page - banner));
    });
    
    $("#center").button({
        label: "Center Map",
        icons: {
            primary: "ui-icon-search"
        },
        text: false
    }).click(function () {
        showAddress();
    }).removeClass("ui-corner-all");
    
    $("#clear").button({
        label: "Reset",
        text: true,
        icons: {
            secondary: "ui-icon-refresh"
        }
    }).click(function () {
        clearMap();
    });
    
    $("#fetch").button({
        label: "Find Data",
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function () {
        callWeather();
    });
    
    $("#mapMenu input").focus(function () {
        $(this).animate({
            width: "+200px"
        });
    }).blur(function () {
        $(this).animate({
            width: "-200px"
        });
    }).outerHeight(32);
    
    var map = new google.maps.Map($("#map")[0], {
        draggableCursor: "crosshair",
        draggingCursor: "move",
        center: new google.maps.LatLng(40.872738, -124.077417),
        zoom: 18,
        tilt: 0,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDoubleClickZoon: true,
        mapTypeControlOptions: {
            mapTypeIds: [
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.HYBRID
            ]
        },
        streetViewControl: false,
        panControl: false
    });
});