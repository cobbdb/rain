/**
 * @param {Object} opts
 * @param {String} opts.state
 * @param {Number} opts.value
 * @param {Array} opts.units
 * @param {String} opts.units.metric
 * @param {String} opts.units.us
 * @param {String} opts.units.conversion
 * @return {Object}
 */
module.exports = function (opts) {
    var metric, us, i, unit, len;
    var init = function (unit_met, unit_us, conversion) {
        if (opts.unit === unit_met) {
            metric = opts.value;
            us = opts.value * conversion;
        } else if (opts.unit === unit_us) {
            metric = opts.value / conversion;
            us = opts.value;
        }
    };
    len = opts.units.length;
    for (i = 0; i < len; i += 1) {
        unit = opts.units[i];
        init(unit.metric, unit.us, unit.conversion);
    }

    return {
        val: function () {
            if (opts.state === 'metric') {
                return metric;
            } else if (opts.state === 'us') {
                return us;
            }
            throw Error('Unit state is either metric or us.');
        },
        US: us,
        metric: metric
    };
};
