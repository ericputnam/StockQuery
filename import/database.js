"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

"use strict";

var connection = require("./connection").connection;

var fs = require("fs");
var path = require("path");
var marklogic = require("marklogic");

var db = marklogic.createDatabaseClient(connection);
var qb = marklogic.queryBuilder;

var insert = function (type, param, data) {
  if (type === "JSON") {

    return db.documents.write({
      uri: "/stockquote/" + data.filename + "quote.json",
      contentType: "application/json",
      collections: ["stockquote"],
      content: JSON.parse(JSON.stringify(data.jsondata))
    }).result();
  } else {
    console.log("Insert type has to be of type \"JSON\". Currenty it is set to " + type);
  }
};

exports.insert = insert;