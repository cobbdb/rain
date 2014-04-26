var Unit = require('./unit.js');

/**
 * @param {Object} opts
 * @param {Object} opts.control
 * @param {String} opts.control.state
 * @param {Number} opts.value
 * @param {Number} opts.unit
 * @return {Unit}
 */
module.exports = function (opts) {
    opts.units = [{
        metric: 'kg',
        us: 'lbs',
        conversion: 2.20462262
    }];
    return Unit(opts);
};
