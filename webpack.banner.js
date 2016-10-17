var toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
var PACKAGE = require('./package.json');
var NAME = toTitleCase(PACKAGE.name.split('-').join(' '));

module.exports = NAME + ' ' + PACKAGE.version + '\n' + PACKAGE.homepage + '\nCopyright (c) ' + (new Date().getFullYear()) + ' ' + NAME + ' Authors';
