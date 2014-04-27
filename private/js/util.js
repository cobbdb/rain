Number.prototype.roundToFixed = function (radix) {
    var val = this;
    radix = radix || 0;

    val *= Math.pow(10, radix);
    val = Math.round(val);
    val /= Math.pow(10, radix);
    return val;
};
Number.prototype.toPercentage = function (radix) {
    var num = this * 100;
    return num.roundToFixed(radix);
};
