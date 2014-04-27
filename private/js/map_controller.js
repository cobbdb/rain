window.MapController = function ($scope) {
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
            google.maps.event.trigger($scope.map, 'resize');
        });
        resizeTimer = setInterval(function () {
            $(window).resize();
        }, 1000);

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
        $('#mapWell .navbar-search, #map').fadeIn();
        $('#graph').hide();

        $('#graph-title').text('Graphs');
        $('#map-btn').addClass('active btn-info');
        $('#graph-btn').removeClass('active btn-info');
        $('#map-btn i').addClass('icon-white');
    };

    var displayGraph = function (e) {
        $('#mapWell .navbar-search, #map').hide();
        $('#graph').fadeIn();

        var title = $(e.target).text();
        $('#graph-title').text(title);
        $('#graph-btn').addClass('active btn-info');
        $('#map-btn').removeClass('active btn-info');
        $('#map-btn i').removeClass('icon-white');
    };

    $.extend($scope, {
        showSatellite: displayMap,
        showRainfall: displayGraph,
        showUsage: displayGraph,
        showDownspout: displayGraph,
        showLevels: displayGraph,
        search: function () {
            geocoder.geocode({
                'address': $('#mapSearch').val()
            }, function (res, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.map.setCenter(res[0].geometry.location);
                } else {
                    $scope.addAlert('Search was not successful for the following reason: ' + status);
                }
            });
        }
    });
};
