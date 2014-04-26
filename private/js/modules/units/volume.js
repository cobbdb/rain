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
        metric: 'L',
        us: 'gal',
        conversion: 0.264172052
    }];
    return Unit(opts);
};
