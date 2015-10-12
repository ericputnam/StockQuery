var fs = require('fs');
var ml = require('marklogic');
var conn = require('../config.js').admin;
var db = ml.createDatabaseClient(conn);


/*var marklogic = require('marklogic');
var my = require('../config.js').admin;
//var db = marklogic.createDatabaseClient(my.connInfo);
var db = marklogic.createDatabaseClient(conn);*/

/*db.config.resources.write({
  name: 'searchFunctions',
  contentType: 'application/xquery',
  source: fs.createReadStream('searchFunctions.xqy'),
  // everything below this is optional metadata
  title: 'XQuery Search Functions',
  description: 'XQuery Search Functions for Stock Query App',
  provider: 'MarkLogic',
  version: 1.0
}).result(function(response) {
  console.log('Installed extension: ' + response.name);
}, function(error) {
  console.log(JSON.stringify(error, null, 2));
});*/

db.config.extlibs.write({
  path: '/invoke/searchFunctions.xqy',
  contentType: 'application/xquery',
  title: 'XQuery Search Functions',
  description: 'XQuery Search Functions for Stock Query App',
  source: fs.createReadStream('searchFunctions.xqy')
})