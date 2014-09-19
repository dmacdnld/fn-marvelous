var superagent = require('superagent');
var r = require('ramda');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 2;

// Applicative
// ------------------------------------------------------------------

var fetch = function() {
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
  var top100Characters = characters.slice(0, 99)
  var compiledTemplates = r.map(function(character) {
    return template(character);
  }, top100Characters);

  document.querySelector('#character-list').innerHTML = compiledTemplates.join('');
};

var app = function() {
  return r.map(show, fetch());
};

app();