'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _database = require('./database');

var database = _interopRequireWildcard(_database);

var fs = require('fs');
var marklogic = require('marklogic');

var processImportModule = function processImportModule() {
  database.insertCodeModules();
};

processImportModule();
