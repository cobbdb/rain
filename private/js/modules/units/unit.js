/**
 * @param {Object} opts
 * @param {Object} opts.control
 * @param {String} opts.control.state
 * @param {Number} opts.value
 * @param {String} opts.unit
 * @param {Array} opts.units
 * @param {String} opts.units.metric
 * @param {String} opts.units.us
 * @param {String} opts.units.conversion
 * @return {Object}
 */
module.exports = function (opts) {
    var i, unit, len, metric, us;
    var init = function (unit_met, unit_us, conversion) {
        var val_met, val_us;
        if (opts.unit === unit_met) {
            val_met = opts.value;
            val_us = opts.value * conversion;
        } else if (opts.unit === unit_us) {
            val_met = opts.value / conversion;
            val_us = opts.value;
        } else {
            return;
        }
        metric = {
            val: val_met,
            unit: unit_met
        };
        us = {
            val: val_us,
            unit: unit_us
        };
    };
    len = opts.units.length;
    for (i = 0; i < len; i += 1) {
        unit = opts.units[i];
        init(unit.metric, unit.us, unit.conversion);
    }

    return {
        get: function () {
            if (opts.control.state === 'metric') {
                return metric;
            } else if (opts.control.state === 'us') {
                return us;
            }
            throw Error('Unit state is either metric or us.');
        },
        US: us,
        metric: metric
    };
};
