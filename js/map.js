$(function () {
    /*$(window).resize(function () {
        var old = $("#map").height();
        var body = $(window).height();
        var banner = $("#pebw").height();
        var page = $("#page").outerHeight(true);
        $("#map").height(old + (body - page - banner));
    });*/
    
    var map = new google.maps.Map($("#map")[0], {
        draggableCursor: "crosshair",
        draggingCursor: "move",
        // Initial center is HSU's CCAT building.
        center: new google.maps.LatLng(40.872738, -124.077417),
        zoom: 18,
        tilt: 0,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
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
    
    // Center map at user's location.
    $.ajax({
        url: "//www.geoplugin.net/json.gp",
        dataType: "jsonp",
        data: {
            ip: "96.247.225.141"
        },
        jsonp: "jsoncallback",
        success: function (res) {
            if (res.geoplugin_status == 200) {
                var lat = res.geoplugin_latitude;
                var lng = res.geoplugin_longitude;
                map.setCenter(new google.maps.LatLng(lat, lng));
            }
        },
        error: function (xhr) {
            console.error(xhr.status + " : " + xhr.statusText);
        }
    });
});
