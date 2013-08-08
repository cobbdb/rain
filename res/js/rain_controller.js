/**
 * Global app-level controller.
 */
function RainController($scope) {
    var version = '2.1.0';
    localStorage.version = localStorage.version || version;
    localStorage.guideIsVisible = localStorage.guideIsVisible || true;
    
    // Reset configurations if new version.
    if (localStorage.version !== version) {
        localStorage.guideIsVisible = true;
    }
    
    _($scope).extend({
        approUrl: 'http://www.appropedia.org/Rainwater_Collection_Calculator',
        /**
         * Dismiss any element who is designated by data-dismiss attribute.
         */
        dismiss: function ($event) {
            var target = $($event.target).attr('data-dismiss');
            $(target)
                .slideUp({
                    queue: false
                })
                .fadeOut({
                    queue: false
                });
        },
        map: new google.maps.Map($('#map')[0], {
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
        }),
        mapType: google.maps.MapTypeId.SATELLITE,
        allMapTypes: _(google.maps.MapTypeId).values(),
        changeMapType: function () {
            $scope.map.setOptions({
                mapTypeId: $scope.mapType.toLowerCase()
            });
        },
        guideIsVisible: localStorage.guideIsVisible,
        showGuide: function () {
            localStorage.guideIsVisible = true;
            $scope.guideIsVisible = true;
        },
        hideGuide: function () {
            localStorage.guideIsVisible = false;
            $scope.guideIsVisible = false;
        },
        alerts: [
            "We're still under construction, but be sure to check back soon!"
        ],
        addAlert: function (msg) {
            $scope.alerts.push(msg);
            $scope.$apply();
            $scope.blink('#footErr' + ($scope.alerts.length - 1));
        },
        blink: function (id) {
            console.log('blinking ' + id);
            for (var i = 0; i < 2; i += 1) {
                $(id).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
            }
        }
    });
}
