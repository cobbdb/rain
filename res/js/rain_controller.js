/**
 * Global app-level controller.
 */
function RainController($scope) {
    var version = '2.1.0';
    localStorage.version = localStorage.version || version;
    localStorage.showGuide = localStorage.showGuide || true;
    
    if (localStorage.version !== version) {
        // Do config resets.
        localStorage.showGuide = true;
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
        }
    });
}
