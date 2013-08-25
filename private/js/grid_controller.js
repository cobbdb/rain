function GridController($scope) {
    _($scope).extend({
        autofill: true,
        state: function () {
            return ($scope.autofill) ? 'ON' : 'OFF';
        },
        toggle: function (e) {
            $(e.target).toggleClass('btn-success');
            $scope.autofill = !$scope.autofill;
        }
    });
}
