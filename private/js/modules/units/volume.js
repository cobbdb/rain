var Unit = require('./unit.js');

/**
 * @param {Object} opts
 * @param {String} opts.state
 * @param {Number} opts.value
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
