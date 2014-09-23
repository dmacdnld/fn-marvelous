var superagent = require('superagent');
var r = require('ramda');
var multimethod = require('multimethod');
var Promise = require('./support/promise');
var template = require ('../../templates/character.handlebars');
document.querySelector('#version-number').innerHTML = 6;
document.querySelector('#search-form').classList.remove('hidden');

// Extend
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
      getEl("#loader").classList.add('hidden');
    });

  return promise;
};

var take = r.curry(function(begin, end, list) {
  return Array.prototype.slice.call(list, begin, end);
});

var first = function(num) {
  num = num > 1 ? num : 1;
  return take(0, num);
};

var join = r.curry(function(separator, list) {
  return list.join(separator);
});

var buildHtml = r.compose(join(''), r.map(template));

var getEl = function(selector) {
  return document.querySelector(selector);
};

var setHtml = r.curry(function(selector, html) {
  getEl(selector).innerHTML = html;
});

var hasSubstr = r.curry(function(a, b) {
  return b.indexOf(a) > -1;
});

var getEventTarget = function(evt) {
  return evt.target;
};

var getDataAttr = r.curry(function(attr, el) {
  return el.dataset[attr];
});

var set = r.curry(function(obj, prop, val) {
  return obj[prop] = val;
});

var searchCriteria = {};

var updateSearchCriteria = r.compose(r.converge(set(searchCriteria), getDataAttr('searchCriterion'), r.prop('value')), getEventTarget);

// App-specific

var fetchCharacters = r.once(r.lPartial(fetch, 'data/characters.json'));

var showCharacters = r.compose(setHtml('#character-list'), buildHtml);

var matchByName = multimethod()
                    .dispatch(function() {
                      return searchCriteria.name;
                    })
                    .when('', true)
                    .when(undefined, true)
                    .default(function(character) {
                      return hasSubstr(searchCriteria.name.toLowerCase(), character.name.toLowerCase());
                    });

var app = r.compose(r.map(showCharacters), r.map(first(24)), r.map(r.filter(matchByName)), fetchCharacters);

var search = r.compose(app, updateSearchCriteria);

getEl('#name-input').addEventListener('input', search);

app();
