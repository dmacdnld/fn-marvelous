var superagent = require('superagent');
var r = require('ramda');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 3;

// Composition
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

var first = function(num, list) {
  num = num > 1 ? num : 1;
  return take(0, num, list);
};

var first24 = function(list) {
  return first(24, list);
};

var compileTemplates = function(list) {
  return r.map(template, list);
};

var join = function(list, separator) {
  return list.join(separator);
};

var joinOnNoSpaces = function(list) {
  return join(list, '');
};

var buildHtml = r.compose(joinOnNoSpaces, compileTemplates);

var getEl = function(selector) {
  return document.querySelector(selector);
};

var setHtml = function(sel, html) {
  getEl(sel).innerHTML = html;
};

// App-specific

var fetchCharacters = function() {
  return fetch('data/characters.json');
};

var setListHtml = function(html) {
  setHtml('#character-list', html);
};

var showCharacters = r.compose(setListHtml, buildHtml);

var app = function() {
  return r.map(r.compose(showCharacters, first24), fetchCharacters());
};

app();