window.GridController = function ($scope) {
    $.extend($scope, {
        autofill: true,
        state: function () {
            return ($scope.autofill) ? 'ON' : 'OFF';
        },
        toggle: function (e) {
            $(e.target).toggleClass('btn-info active');
            $scope.autofill = !$scope.autofill;
        }
    });
};
