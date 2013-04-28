/**
 * Global app-level controller.
 */
var RainController = function ($scope) {
    $scope.approUrl = 'http://www.appropedia.org/Rainwater_Collection_Calculator';
    
    /**
     * Dismiss any element who is designated by data-dismiss attribute.
     */
    $scope.dismiss = function ($event) {
        var target = $($event.target).attr('data-dismiss');
        $(target)
            .slideUp({
                queue: false
            })
            .fadeOut({
                queue: false
            });
    };
}
