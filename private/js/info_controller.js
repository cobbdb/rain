$(function () {
    $('.switch').on('click', function (e) {
        $(e.target).toggleClass('switch-on switch-off');
    });
});

function InfoController($scope) {
}
