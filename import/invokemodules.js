"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _database = require('./database');

var database = _interopRequireWildcard(_database);

// (2) Invoke the module
var processInvoke = function processInvoke() {
  database.invokeSearchFunctions("CAT");
};

processInvoke();
