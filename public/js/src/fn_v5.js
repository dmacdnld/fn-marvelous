var superagent = require('superagent');
var r = require('ramda');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 5;

// Curry
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

var show = r.compose(setHtml('#character-list'), buildHtml);

var app = function () {
  return r.map(r.compose(show, first(100)), fetch());
};

app();