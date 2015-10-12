'use strict';

import * as database from './database';
import * as yahoofinancelookup from './yahoofinancelookup';

var moment = require("moment"); //JS plugin called moment, that helps format dates. We use this in order to help with query ranges.
var objectToInsert = {}; //final object to be inserted

/*
processImport function returns a promise containing all the jpg and/or jpeg
files from a given folder that is provided as a paramter (2nd argument for the
script)
*/
var processImport = function () {

  var promise = new Promise(function (resolve, reject) {
    var startDate = moment("1900-10-01");
    var endDate = moment("1899-01-01");

    while(startDate > endDate){
        var queryEndDate = startDate.format("YYYY-MM-DD");
        var queryStartDate = startDate.subtract(1, 'months').format("YYYY-MM-DD")

        garbageytrash
         
        console.log("Query Range-> " + queryEndDate + " to " + queryStartDate);
        //var dateString = start.format("yyy-mm-dd");

        yahoofinancelookup.makeRequest(queryStartDate, queryEndDate).then(function (result) {

        objectToInsert.filename = result.filename;
        objectToInsert.jsondata = result.jsondata;
        console.log(objectToInsert.filename);

        database.insert("JSON", "", objectToInsert).then(function (response) {
              console.log("JSON file inserted for month -->", response.documents[0].uri);
            })["catch"](function (error) {
              console.log(error);
            });
      })["catch"](function (error) {
          console.log(error);
      });

      //console.log(dateString);
    }

    return promise;

})["catch"](function (error) {
      console.log(error);
});
  
};

processImport();
