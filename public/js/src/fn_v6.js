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
    });

  return promise;
};

var take = r.curry(function(begin, end, list) {
  return Array.prototype.slice.call(list, begin, end, list);
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

var setHtml = r.curry(function(selector, html) {
  getEl(selector).innerHTML = html;
});

var hasSubstr = r.curry(function(a, b) {
  return b.indexOf(a) > -1;
});

// App-specific

var fetchCharacters = r.once(r.lPartial(fetch, 'data/characters.json'));

var showCharacters = r.compose(setHtml('#character-list'), buildHtml);

var searchCriteria = { name: '' };

var updateSearchCriteria = function(evt) {
  evt.preventDefault();
  searchCriteria.name = getEl('#name-input').value;
};

var matchByName = multimethod()
                    .dispatch(function() {
                      return searchCriteria.name;
                    })
                    .when('', true)
                    .default(function(character) {
                      return hasSubstr(searchCriteria.name.toLowerCase(), character.name.toLowerCase());
                    });

var app = r.compose(r.map(showCharacters), r.map(first(100)), r.map(r.filter(matchByName)), fetchCharacters);

var search = r.compose(app, updateSearchCriteria);

getEl('#name-input').addEventListener('input', search);

app();