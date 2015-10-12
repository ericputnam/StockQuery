var fs = require('fs');
var ml = require('marklogic');
var conn = require('../config.js').admin;
var db = ml.createDatabaseClient(conn);


  // (2) Invoke the module
  return db.invoke({
    path: '/ext/invoke/searchFunctions.xqy', 
    variables: {param1: 'CAT'}
  }).result(function(response) {
    console.log(JSON.stringify(response, null, 2));
  }, function(error) {
    console.log(JSON.stringify(error, null, 2));
  });
