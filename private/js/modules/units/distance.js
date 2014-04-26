var Unit = require('./unit.js');

/**
 * @param {Object} opts
 * @param {String} opts.state
 * @param {Number} opts.value
 * @return {Unit}
 */
module.exports = function (opts) {
    opts.units = [{
        metric: 'mm',
        us: 'in',
        conversion: 0.0393700787
    }, {
        metric: 'm',
        us: 'ft',
        conversion: 3.2808399
    }, {
        metric: 'km',
        us: 'mi',
        conversion: 0.621371192
    }];
    return Unit(opts);
};
