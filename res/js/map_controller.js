function MapController($scope) {
    var resizeTimer;
    var geocoder = new google.maps.Geocoder();
    
    // Bind map init.
    $(function () {
        // Map fills to bottom of screen.
        $(window).resize(function () {
            var winHeight = $(window).height();
            var mapTop = $('#map').offset().top;
            var footHeight = $('#footer').height();
            $('#map').height(winHeight - mapTop - footHeight);
            google.maps.event.trigger($scope.map, "resize");
        });
        resizeTimer = setInterval(function () {
            $(window).resize();
        }, 1000);
        
        // Map options activate when clicked.
        $('#mapWell .btn-group .btn').click(function (e) {
            $('#mapWell .btn-group .btn').removeClass('active');
            $(e.target).addClass('active');
        });
        
        // Center map at user's location.
        $.ajax({
            url: '//www.geoplugin.net/json.gp',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function (res) {
                var lat = res.geoplugin_latitude;
                var lng = res.geoplugin_longitude;
                $scope.map.setCenter(new google.maps.LatLng(lat, lng));
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
        $('#map').hide();
        $('#graph').fadeIn();
    };
    
    _($scope).extend({
        showSatellite: displayMap,
        showRainfall: displayGraph,
        showUsage: displayGraph,
        showDownspout: displayGraph,
        search: function () {
            geocoder.geocode({
                'address': $('#mapSearch').val()
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.map.setCenter(results[0].geometry.location);
                } else {
                    $scope.addAlert('Search was not successful for the following reason: ' + status);
                }
            });
        }
    });
}
