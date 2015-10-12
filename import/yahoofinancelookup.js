"use strict";

var http = require("http");
var moment = require("moment");
//require("es6-promise").polyfill();

var makeRequest = function makeRequest(startDate, endDate) {
  var promise = new Promise(function (resolve, reject) {
    var result = {};
    //var startDate = "2015-10-01";
    //var endDate = "2015-10-02";
    console.log("START" + moment(startDate).format("YYYY-MM-DD"));
    console.log("END" + moment(endDate).format("YYYY-MM-DD"));
    console.log("http://query.yahooapis.com" + "/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20(%22AA%22%2C%22AXP%22%2C%22BA%22%2C%22BAC%22%2C%22CAT%22%2C%22CSCO%22%2C%22CVX%22%2C%22DD%22%2C%22DIS%22%2C%22GE%22%2C%22HD%22%2C%22HPQ%22%2C%22IBM%22%2C%22INTC%22%2C%22JNJ%22%2C%22JPM%22%2C%22KFT%22%2C%22KO%22%2C%22MCD%22%2C%22MMM%22%2C%22MRK%22%2C%22MSFT%22%2C%22PFE%22%2C%22PG%22%2C%22T%22%2C%22TRV%22%2C%22UTX%22%2C%22VZ%22%2C%22WMT%22%2C%22XOM%22)%20and%20startDate%20%3D%20%22" + moment(startDate).format("YYYY-MM-DD") + "%22%20and%20endDate%20%3D%20%22" + moment(endDate).format("YYYY-MM-DD") + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys");

    var options = {
      hostname: "query.yahooapis.com",
      path: "/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20(%22AA%22%2C%22AXP%22%2C%22BA%22%2C%22BAC%22%2C%22CAT%22%2C%22CSCO%22%2C%22CVX%22%2C%22DD%22%2C%22DIS%22%2C%22GE%22%2C%22HD%22%2C%22HPQ%22%2C%22IBM%22%2C%22INTC%22%2C%22JNJ%22%2C%22JPM%22%2C%22KFT%22%2C%22KO%22%2C%22MCD%22%2C%22MMM%22%2C%22MRK%22%2C%22MSFT%22%2C%22PFE%22%2C%22PG%22%2C%22T%22%2C%22TRV%22%2C%22UTX%22%2C%22VZ%22%2C%22WMT%22%2C%22XOM%22)%20and%20startDate%20%3D%20%22" + moment(startDate).format("YYYY-MM-DD") + "%22%20and%20endDate%20%3D%20%22" + moment(endDate).format("YYYY-MM-DD") + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
      method: "GET"
    };

    var request = http.request(options, function (response) {
      response.setEncoding("utf8");
      var data = "";

      response.on('data', function (chunk) {
        data += chunk;
      });

      response.on('end', function () {
        //callback(data);
        console.log("Received data back. Waaahooo!");
        result = {
          jsondata: data,
          filename: startDate
        };

        resolve(result);
      });
    });

    request.on("error", function (error) {
      reject(error);
    });

    request.end();
  });
  return promise;
};
exports.makeRequest = makeRequest;
