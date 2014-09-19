var superagent = require('superagent');
var r = require('ramda');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 4;

// Partial Application
// ------------------------------------------------------------------

// General

var fetch = function(resource) {
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

var take = function(begin, end, list) {
  return list.slice(begin, end, list);
};

var first = function(num) {
  num = num > 1 ? num - 1 : 1;
  return r.lPartial(take, 0, num);
};

var mapFirst100 = r.lPartial(r.map, first(100));

var compileTemplates = r.lPartial(r.map, template);

var join = function(separator, list) {
  return list.join(separator);
};

var joinOnNoSpaces = r.lPartial(join, '');

var buildHtml = r.compose(joinOnNoSpaces, compileTemplates);

var getEl = function(selector) {
  return document.querySelector(selector);
};

var setHtml = function(sel, html) {
  getEl(sel).innerHTML = html;
};

// App-specific

var fetchCharacters = r.lPartial(fetch, 'data/characters.json');

var setListHtml = r.lPartial(setHtml, '#character-list');

var showCharacters = r.compose(setListHtml, buildHtml);

var mapShowCharacters = r.lPartial(r.map, showCharacters);

var app = r.compose(mapShowCharacters, mapFirst100, fetchCharacters);

app();