var MapController = function ($scope) {
    var map;
    
    $('#map').on('devTextDone', function () {
        // template for signals
        // http://api.jquery.com/trigger/
    });
    
    // Bind map init.
    $(function () {
        // Map height should match info height.
        var height = $('#rightRail div:nth-child(2)').height();
        $('#map').height(height);
        
        // Rebrand map well per option.
        $('#mapWell .dropdown ul a').click(function (e) {
            var title = $(this).attr('data-title');
            $('#mapWell .brand').text(title);
        });
        
        // Create the google map.
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
        $.ajax({
            url: '//www.geoplugin.net/json.gp',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function (res) {
                var lat = res.geoplugin_latitude;
                var lng = res.geoplugin_longitude;
                map.setCenter(new google.maps.LatLng(lat, lng));
            },
            error: function (xhr) {
                var tpl = _.template('Could not center map - <%= status %> : <%= text %>.');
                console.error(tpl({
                    status: xhr.status,
                    text: xhr.statusText
                }));
            }
        });
        
        // Map is default layer.
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
    
    /**
     * TODO: All these show* methods should be handled by signals.
     */
    
    $scope.showHybrid = function () {
        map.setOptions({
            mapTypeId: google.maps.MapTypeId.HYBRID
        });
        displayMap();
        // Close map options menu per click on mobile devices.
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
