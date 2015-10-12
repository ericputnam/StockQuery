var fs = require('fs');
var marklogic = require('marklogic');

import * as database from './database';

var processImportModule = function () {
  database.insertCodeModules();
}

processImportModule();