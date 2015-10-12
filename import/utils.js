'use strict';
/*
Module with helper functions
*/

Object.defineProperty(exports, '__esModule', {
  value: true
});
var unique = function unique(array) {
  return array.reduce(function (accum, current) {
    if (accum.indexOf(current) < 0) {
      accum.push(current);
    }
    return accum;
  }, []);
};
exports.unique = unique;
