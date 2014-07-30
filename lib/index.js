var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');
var util = require('util');
var jsonTable = require('json-table');
var debug = require('debug')('csv-table');

function csvParserHandler() {
  debug('csv parser handler');
  var err = null;
  var fileLocation = null;
  var options = null;
  var fn = null;
  var fileData = null;
  var args = Array.prototype.slice.apply(arguments, []);

  if (args.length === 3) {
    fileLocation = args[0];
    options = args[1];
    fn = args[2]
  } if (args.length === 2) {
    options = args[0];
    fn = args[1];
  }

  options = options || {};
  options.columns = options.columns || true;
  options.delimiter = options.delimiter || ';';
  fn = fn || function callbackHandler(err) {};

  function jsonTableHandler(table) {
    debug('json table handler');
    fn(err, table); 
  }

  function parseHandler(err, data) {
    debug('parse handler');
    if (err) {
      fn(err, null);
    }
    new jsonTable(data, jsonTableHandler);
  }


  if (args.length === 3 && (fs.existsSync(path.resolve(process.cwd(), fileLocation)))) {
    fileLocation = (path.resolve(process.cwd(), fileLocation)) || '';
    fileData = fs.readFileSync(fileLocation);
    parse(fileData, options, parseHandler);
  } else {
    process
      .stdin
      .pipe(parse(options, parseHandler));
  }
  
}
module.exports = exports = csvParserHandler;
