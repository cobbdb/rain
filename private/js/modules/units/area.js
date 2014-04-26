var Unit = require('./unit.js');

/**
 * @param {Object} opts
 * @param {String} opts.state
 * @param {Number} opts.value
 * @return {Unit}
 */
module.exports = function (opts) {
    opts.units = [{
        metric: 'm2',
        us: 'ft2',
        conversion: 10.7639104
    }];
    return Unit(opts);
};
