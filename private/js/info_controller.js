$(function () {
    var buildSelector = _.template('.grid-option[data-prefix="<%= type %>"]');
    $('.grid-option').on('click', function (e) {
        var target = buildSelector({
            type: e.target.getAttribute('data-prefix')
        });
        $(target).toggleClass('hidden');
    });
});

function InfoController($scope) {
}
