var MapController = function ($scope) {
    var map;
    
    // Bind map init.
    $(function () {
        // Map height should match info height.
        var height = $('#infoWell div:nth-child(2)').height();
        $('#map').height(height);
        
        // Map options activate when clicked.
        $('#mapWell .btn-group .btn').click(function (e) {
            $('#mapWell .btn-group .btn').removeClass('active');
            $(e.target).addClass('active');
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
            mapTypeControl: true,
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
    
    $scope.showSatellite = function () {
        displayMap();
    };
    
    $scope.showRainfall = function () {
        displayGraph();
    };
    
    $scope.showUsage = function () {
        displayGraph();
    };
    
    $scope.showDownspout = function () {
        displayGraph();
    };
};
