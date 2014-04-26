var Unit = require('./unit.js');

/**
 * @param {Object} opts
 * @param {String} opts.state
 * @param {Number} opts.value
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
