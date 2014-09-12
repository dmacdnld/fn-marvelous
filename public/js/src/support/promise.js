var Promise = require('node-promise').Promise;
var p = new Promise();

p.constructor.prototype.map = function(f) {
  var promise = new Promise();

  this.then(function(response) {
    promise.resolve(f(response));
  });

  return promise;
}

module.exports = Promise;
