const regression = require('regression');

module.exports = (values) => {

    // Reduce distances to 2d matrix
    var points = [];
    values.filter((currentValue) => {
        points.push([points.length, currentValue]);
    });
    console.log(points);

    // Calculate linear regression
    var func = regression.linear(points);
    console.log(func);

    return func;
}