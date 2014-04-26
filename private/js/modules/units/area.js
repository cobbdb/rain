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
        metric: 'm&sup2;',
        us: 'ft&sup2;',
        conversion: 10.7639104
    }];
    return Unit(opts);
};
