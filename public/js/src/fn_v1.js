var superagent = require('superagent');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 1;

// Imperative
// ------------------------------------------------------------------

var fetch = function () {
  var promise = new Promise();

  superagent
    .get('data/characters.json')
    .end(function(res) {
      if (res.ok) {
        promise.resolve(res.body);
      } else {
        promise.reject(res);
      }
    });

  return promise;
};

var show = function(characters) {
  var compiledTemplates = [];

  for (var i = 0, len = 100; i < len; i++) {
    compiledTemplates.push(template(characters[i]));
  }

  document.querySelector('#character-list').innerHTML = compiledTemplates.join('');
};

var app = function () {
  fetch().then(show);
};

app();