"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var yahoofinancelookup = _interopRequireWildcard(require("./yahoofinancelookup"));

var database = _interopRequireWildcard(require("./database"));

var objectToInsert = {}; //final object to be inserted

/*
processImport function returns a promise containing all the jpg and/or jpeg
files from a given folder that is provided as a paramter (2nd argument for the
script)
*/
var processImport = function () {

  var promise = new Promise(function (resolve, reject) {
    //var result = [];

    yahoofinancelookup.makeRequest().then(function (result) {

      objectToInsert.filename = result.filename;
      objectToInsert.jsondata = result.jsondata;
      console.log(objectToInsert.filename);

      database.insert("JSON", "", objectToInsert).then(function (response) {
              console.log("JSON file inserted ", response.documents[0].uri);
            })["catch"](function (error) {
              console.log(error);
            });

  return promise;
  })["catch"](function (error) {
      console.log(error);
  });
});
  
};

processImport();