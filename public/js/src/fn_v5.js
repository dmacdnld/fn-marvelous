var superagent = require('superagent');
var r = require('ramda');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 5;

// Curry
// ------------------------------------------------------------------

var fetch = function (resource) {
  var promise = new Promise();

  superagent
    .get(resource)
    .end(function(res) {
      if (res.ok) {
        promise.resolve(res.body);
      } else {
        promise.reject(res);
      }
    });

  return promise;
};

var fetchCharacters = r.lPartial(fetch, 'data/characters.json');

var take = r.curry(function (begin, end, list) {
  return list.slice(begin, end, list);
});

var first = function(num) {
  num = num > 1 ? num - 1 : 1;
  return take(0, num);
};

var join = r.curry(function(separator, list) {
  return list.join(separator);
});

var buildHtml = r.compose(join(''), r.map(template));

var getEl = function(selector) {
  return document.querySelector(selector);
};

var setHtml = r.curry(function(sel, html) {
  getEl(sel).innerHTML = html;
});

var showCharacters = r.compose(setHtml('#character-list'), buildHtml);

var app = r.compose(r.map(showCharacters), r.map(first(100)), fetchCharacters);

app();