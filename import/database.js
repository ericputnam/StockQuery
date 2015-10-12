'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _connection = require('./connection');

var fs = require('fs');
var path = require('path');
var marklogic = require('marklogic');

var db = marklogic.createDatabaseClient(_connection.connection);
var qb = marklogic.queryBuilder;

var insert = function insert(type, param, data) {
  if (type === 'JSON') {
    return db.documents.write({
      uri: '/image/' + data.filename + '.json',
      contentType: 'application/json',
      collections: ['image'],
      content: data
    }).result();
  } else if (type === 'JPEG') {
    var extension = path.extname(param).toLowerCase();
    if (!extension) {
      param = param + '/' + data.originalFilename;
    }
    var ws = db.documents.createWriteStream({
      uri: '/binary/' + data.filename,
      contentType: 'image/jpeg',
      collections: ['binary']
    });
    fs.createReadStream(param).pipe(ws);
    return ws.result();
  } else {
    console.log('Insert type has to be either "JPEG" or "JSON". Currenty it is set to ' + type);
  }
};

exports.insert = insert;
var insertCodeModules = function insertCodeModules() {
  db.config.extlibs.write({
    path: '/invoke/searchFunctions.xqy',
    contentType: 'application/xquery',
    title: 'XQuery Search Functions',
    description: 'XQuery Search Functions for Stock Query App',
    source: fs.createReadStream('./modules/searchFunctions.xqy')
  });
};

exports.insertCodeModules = insertCodeModules;
/* invoke the main search function for the CAT stock */
var invokeSearchFunctions = function invokeSearchFunctions(param) {
  db.invoke({
    path: '/ext/invoke/searchFunctions.xqy',
    variables: { param1: param }
  }).result(function (response) {
    console.log(JSON.stringify(response, null, 2));
  }, function (error) {
    console.log(JSON.stringify(error, null, 2));
  });
};

exports.invokeSearchFunctions = invokeSearchFunctions;
var getCountries = function getCountries() {
  var countries = [];
  var promise = new Promise(function (resolve, reject) {
    db.documents.query(qb.where(qb.collection('image')).orderBy(qb.sort('filename')).slice(0, 300) //return 300 documents "per page" (pagination)
    ).result().then(function (documents) {
      documents.forEach(function (document) {
        countries.push(document.content.location.country.replace(" ", "_")); //also removing spaces
        resolve(countries);
      });
    })['catch'](function (error) {
      console.log(error);
    });
  });
  return promise;
};
exports.getCountries = getCountries;
