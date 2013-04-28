var MapController = function ($scope) {
    var map;
    
    // Bind map init.
    $(function () {
        // Ensure map's height fills the window.
        // TODO: This should be done by CSS!
        /*$(window).resize(function () {
            var top = $('#map').offset().top;
            var total = $(window).height();
            var footer = $('#footer').height();
            $('#map').height(total - top - footer);
        }).resize();*/
        
        $('#mapWell .dropdown ul a').click(function (e) {
            var title = $(this).attr('data-title');
            $('#mapWell .brand').text(title);
        });
        
        map = new google.maps.Map($('#map')[0], {
            draggableCursor: 'crosshair',
            draggingCursor: 'move',
            // Initial center is HSU's CCAT building.
            center: new google.maps.LatLng(40.872738, -124.077417),
            zoom: 18,
            tilt: 0,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            disableDoubleClickZoon: true,
            mapTypeControl: false,
            streetViewControl: false,
            panControl: false
        });
        
        // Center map at user's location.
        var centerError = function (xhr) {
            var tpl = _.template('Could not center map - <%= status %> : <%= text %>.');
            console.error(tpl({
                status: xhr.status,
                text: xhr.statusText
            }));
        };
        $.ajax({
            url: '//www.geoplugin.net/json.gp',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function (res, status, xhr) {
                if (res.geoplugin_status == 200) {
                    var lat = res.geoplugin_latitude;
                    var lng = res.geoplugin_longitude;
                    map.setCenter(new google.maps.LatLng(lat, lng));
                } else {
                    centerError(xhr);
                }
            },
            error: function (xhr) {
                centerError(xhr);
            }
        });
        
        displayMap();
    });
    
    var displayMap = function () {
        $('#mapWell .navbar-search').show();
        $('#graph').hide();
        $('#map').fadeIn();
    };
    
    var displayGraph = function () {
        $('#mapWell .navbar-search').hide();
        $('#graph').fadeIn();
        $('#map').hide();
    };
    
    $scope.showHybrid = function () {
        map.setOptions({
            mapTypeId: google.maps.MapTypeId.HYBRID
        });
        displayMap();
        $('#mapWell a[data-toggle="collapse"]:visible').click();
    };
    
    $scope.showSatellite = function () {
        map.setOptions({
            mapTypeId: google.maps.MapTypeId.SATELLITE
        });
        displayMap();
        $('#mapWell a[data-toggle="collapse"]:visible').click();
    };
    
    $scope.showRainfall = function () {
        displayGraph();
        $('#mapWell a[data-toggle="collapse"]:visible').click();
    };
    
    $scope.showUsage = function () {
        displayGraph();
        $('#mapWell a[data-toggle="collapse"]:visible').click();
    };
    
    $scope.showDownspout = function () {
        displayGraph();
        $('#mapWell a[data-toggle="collapse"]:visible').click();
    };
};
