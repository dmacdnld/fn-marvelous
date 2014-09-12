var superagent = require('superagent');
var r = require('ramda');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 4;

// Partial Application
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

var take = function (begin, end, list) {
  return list.slice(begin, end, list);
};

var first = function(num) {
  num = num > 1 ? num - 1 : 1;
  return r.lPartial(take, 0, num);
};

var compileTemplates = r.lPartial(r.map, template);

var join = function (separator, list) {
  return list.join(separator);
};

var joinOnNoSpaces = r.lPartial(join, '');

var getEl = function (selector) {
  return document.querySelector(selector);
};

var setHtml = function (sel, html) {
  getEl(sel).innerHTML = html;
};

var setListHtml = r.lPartial(setHtml, '#character-list');

var show = r.compose(setListHtml, joinOnNoSpaces, compileTemplates, first(100));

var app = function () {
  return r.map(show, fetch());
};

app();