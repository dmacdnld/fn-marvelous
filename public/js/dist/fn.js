/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var superagent = __webpack_require__(5);
	var r = __webpack_require__(3);
	var multimethod = __webpack_require__(2);
	var Promise = __webpack_require__(1);
	var template = __webpack_require__ (4);
	document.querySelector('#version-number').innerHTML = 6;
	document.querySelector('#search-form').classList.remove('hidden');

	// Extend
	// ------------------------------------------------------------------

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

	var fetchCharacters = r.once(r.lPartial(fetch, 'data/characters.json'));

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

	var showCharacters = r.compose(setHtml('#character-list'), buildHtml);

	var hasSubstr = r.curry(function(a, b) {
	  return b.indexOf(a) > -1;
	});

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Promise = __webpack_require__(7).Promise;
	var p = new Promise();

	p.constructor.prototype.map = function(f) {
	  var promise = new Promise();

	  this.then(function(response) {
	    promise.resolve(f(response));
	  });

	  return promise;
	}

	module.exports = Promise;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	//     ramda.js
	//     "version": "0.4.2"
	//     https://github.com/CrossEye/ramda
	//     (c) 2013-2014 Scott Sauyet and Michael Hurley
	//     Ramda may be freely distributed under the MIT license.

	// Ramda
	// -----
	// A practical functional library for Javascript programmers.  Ramda is a collection of tools to make it easier to
	// use Javascript as a functional programming language.  (The name is just a silly play on `lambda`.)

	// Basic Setup
	// -----------
	// Uses a technique from the [Universal Module Definition][umd] to wrap this up for use in Node.js or in the browser,
	// with or without an AMD-style loader.
	//
	//  [umd]: https://github.com/umdjs/umd/blob/master/returnExports.js

	(function(factory) {
	    if (true) {
	        module.exports = factory(this);
	    } else if (typeof define === 'function' && define.amd) {
	        define(factory);
	    } else {
	        this.R = this.ramda = factory(this);
	    }
	}(function(global) {

	    'use strict';

	    // This object is what is actually returned, with all the exposed functions attached as properties.

	    /**
	     * A practical functional library for Javascript programmers.
	     *
	     * @namespace R
	     */
	    var R = {};

	    // Internal Functions and Properties
	    // ---------------------------------

	    /**
	     * An optimized, private array `slice` implementation.
	     *
	     * @private
	     * @category Internal
	     * @param {Arguments|Array} args The array or arguments object to consider.
	     * @param {number} [from=0] The array index to slice from, inclusive.
	     * @param {number} [to=args.length] The array index to slice to, exclusive.
	     * @return {Array} A new, sliced array.
	     * @example
	     *
	     *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
	     *
	     *      var firstThreeArgs = function(a, b, c, d) {
	     *        return _slice(arguments, 0, 3);
	     *      };
	     *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
	     */
	    function _slice(args, from, to) {
	        switch (arguments.length) {
	            case 0: throw NO_ARGS_EXCEPTION;
	            case 1: return _slice(args, 0);
	            case 2: return _slice(args, from, args.length);
	            default:
	                var length = to - from, arr = new Array(length), i = -1;
	                while (++i < length) {
	                    arr[i] = args[from + i];
	                }
	                return arr;
	        }
	    }


	    /**
	     * Private `concat` function to merge two array-like objects.
	     *
	     * @private
	     * @category Internal
	     * @param {Array|Arguments} [set1=[]] An array-like object.
	     * @param {Array|Arguments} [set2=[]] An array-like object.
	     * @return {Array} A new, merged array.
	     * @example
	     *
	     *      concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	     */
	    var concat = function _concat(set1, set2) {
	        set1 = set1 || [];
	        set2 = set2 || [];
	        var length1 = set1.length,
	            length2 = set2.length,
	            result = new Array(length1 + length2);

	        for (var i = 0; i < length1; i++) {
	            result[i] = set1[i];
	        }
	        for (i = 0; i < length2; i++) {
	            result[i + length1] = set2[i];
	        }
	        return result;
	    };


	    // Private reference to toString function.
	    var toString = Object.prototype.toString;


	    /**
	     * Tests whether or not an object is an array.
	     *
	     * @private
	     * @category Internal
	     * @param {*} val The object to test.
	     * @return {boolean} `true` if `val` is an array, `false` otherwise.
	     * @example
	     *
	     *      isArray([]); //=> true
	     *      isArray(true); //=> false
	     *      isArray({}); //=> false
	     */
	    var isArray = Array.isArray || function _isArray(val) {
	        return val && val.length >= 0 && toString.call(val) === '[object Array]';
	    };


	    /**
	     * Tests whether or not an object is similar to an array.
	     *
	     * @private
	     * @category Internal
	     * @param {*} val The object to test.
	     * @return {boolean} `true` if `val` has a numeric length property; `false` otherwise.
	     * @example
	     *
	     *      isArrayLike([]); //=> true
	     *      isArrayLike(true); //=> false
	     *      isArrayLike({}); //=> false
	     *      isArrayLike({length: 10}); //=> true
	     */
	    var isArrayLike = function isArrayLike(x) {
	        return isArray(x) || (
	            !!x &&
	            typeof x === 'object' &&
	            !(x instanceof String) &&
	            (
	                !!(x.nodeType === 1 && x.length) ||
	                x.length >= 0
	            )
	        );
	    };


	    /**
	     * Creates a new version of `fn` that, when invoked, will return either:
	     * - A new function ready to accept one or more of `fn`'s remaining arguments, if all of
	     * `fn`'s expected arguments have not yet been provided
	     * - `fn`'s result if all of its expected arguments have been provided
	     *
	     * Optionally, you may provide an arity for the returned function.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (* -> a) -> Number -> (* -> a)
	     * @sig (* -> a) -> (* -> a)
	     * @param {Function} fn The function to curry.
	     * @param {number} [fnArity=fn.length] An optional arity for the returned function.
	     * @return {Function} A new, curried function.
	     * @example
	     *
	     *      var addFourNumbers = function(a, b, c, d) {
	     *        return a + b + c + d;
	     *      };
	     *
	     *      var curriedAddFourNumbers = curry(addFourNumbers);
	     *      var f = curriedAddFourNumbers(1, 2);
	     *      var g = f(3);
	     *      g(4);//=> 10
	     */
	    var curry = R.curry = function _curry(fn, fnArity) {
	        if (arguments.length < 2) {
	            return _curry(fn, fn.length);
	        }
	        return (function recurry(args) {
	            return arity(Math.max(fnArity - (args && args.length || 0), 0), function() {
	                if (arguments.length === 0) { throw NO_ARGS_EXCEPTION; }
	                var newArgs = concat(args, arguments);
	                if (newArgs.length >= fnArity) {
	                    return fn.apply(this, newArgs);
	                } else {
	                    return recurry(newArgs);
	                }
	            });
	        }([]));
	    };


	    var NO_ARGS_EXCEPTION = new TypeError('Function called with no arguments');


	    /**
	     * Optimized internal two-arity curry function.
	     *
	     * @private
	     * @category Function
	     * @param {Function} fn The function to curry.
	     * @return {Function} curried function
	     * @example
	     *
	     *      var addTwo = function(a, b) {
	     *        return a + b;
	     *      };
	     *
	     *      var curriedAddTwo = curry2(addTwo);
	     */
	    function curry2(fn) {
	        return function(a, b) {
	            switch (arguments.length) {
	                case 0:
	                    throw NO_ARGS_EXCEPTION;
	                case 1:
	                    return function(b) {
	                        return fn(a, b);
	                    };
	                default:
	                    return fn(a, b);
	            }
	        };
	    }


	    /**
	     * Optimized internal three-arity curry function.
	     *
	     * @private
	     * @category Function
	     * @param {Function} fn The function to curry.
	     * @return {Function} curried function
	     * @example
	     *
	     *      var addThree = function(a, b, c) {
	     *        return a + b + c;
	     *      };
	     *
	     *      var curriedAddThree = curry3(addThree);
	     */
	    function curry3(fn) {
	        return function(a, b, c) {
	            switch (arguments.length) {
	                case 0:
	                    throw NO_ARGS_EXCEPTION;
	                case 1:
	                    return curry2(function(b, c) {
	                        return fn(a, b, c);
	                    });
	                case 2:
	                    return function(c) {
	                        return fn(a, b, c);
	                    };
	                default:
	                    return fn(a, b, c);
	            }
	        };
	    }


	    /**
	     * Private function that determines whether or not a provided object has a given method.
	     * Does not ignore methods stored on the object's prototype chain. Used for dynamically
	     * dispatching Ramda methods to non-Array objects.
	     *
	     * @private
	     * @category Internal
	     * @param {string} methodName The name of the method to check for.
	     * @param {Object} obj The object to test.
	     * @return {boolean} `true` has a given method, `false` otherwise.
	     * @example
	     *
	     *      var person = { name: 'John' };
	     *      person.shout = function() { alert(this.name); };
	     *
	     *      hasMethod('shout', person); //=> true
	     *      hasMethod('foo', person); //=> false
	     */
	    var hasMethod = function _hasMethod(methodName, obj) {
	        return obj && !isArray(obj) && typeof obj[methodName] === 'function';
	    };


	    /**
	     * Similar to hasMethod, this checks whether a function has a [methodname]
	     * function. If it isn't an array it will execute that function otherwise it will
	     * default to the ramda implementation.
	     *
	     * @private
	     * @category Internal
	     * @param {Function} func ramda implemtation
	     * @param {String} methodname property to check for a custom implementation
	     * @return {Object} whatever the return value of the method is
	     */
	    function checkForMethod(methodname, func) {
	        return function(a, b, c) {
	            var length = arguments.length;
	            var obj = arguments[length - 1],
	                callBound = obj && !isArray(obj) && typeof obj[methodname] === 'function';
	            switch (arguments.length) {
	                case 0: return func();
	                case 1: return callBound ? obj[methodname]() : func(a);
	                case 2: return callBound ? obj[methodname](a) : func(a, b);
	                case 3: return callBound ? obj[methodname](a, b) : func(a, b, c);
	            }
	        };
	    }


	    /**
	     * Private function that generates a parameter list based on the paremeter count passed in.
	     *
	     * @private
	     * @category Internal
	     * @param {number} n The number of parameters
	     * @return {string} The parameter list
	     * @example
	     *
	     *      mkArgStr(1); //= 'arg1'
	     *      mkArgStr(2); //= 'arg1, arg2'
	     *      mkArgStr(3); //= 'arg1, arg2, arg3'
	     */
	    var mkArgStr = function _makeArgStr(n) {
	        var arr = [], idx = -1;
	        while (++idx < n) {
	            arr[idx] = 'arg' + idx;
	        }
	        return arr.join(', ');
	    };


	    /**
	     * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
	     * parameters. Any extraneous parameters will not be passed to the supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig Number -> (* -> a) -> (* -> a)
	     * @param {number} n The desired arity of the new function.
	     * @param {Function} fn The function to wrap.
	     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	     *         arity `n`.
	     * @example
	     *
	     *      var takesTwoArgs = function(a, b) {
	     *        return [a, b];
	     *      };
	     *      takesTwoArgs.length; //=> 2
	     *      takesTwoArgs(1, 2); //=> [1, 2]
	     *
	     *      var takesOneArg = R.nAry(1, takesTwoArgs);
	     *      takesOneArg.length; //=> 1
	     *      // Only `n` arguments are passed to the wrapped function
	     *      takesOneArg(1, 2); //=> [1, undefined]
	     */
	    var nAry = R.nAry = (function() {
	        var cache = {
	            0: function(func) {
	                return function() {
	                    return func.call(this);
	                };
	            },
	            1: function(func) {
	                return function(arg0) {
	                    return func.call(this, arg0);
	                };
	            },
	            2: function(func) {
	                return function(arg0, arg1) {
	                    return func.call(this, arg0, arg1);
	                };
	            },
	            3: function(func) {
	                return function(arg0, arg1, arg2) {
	                    return func.call(this, arg0, arg1, arg2);
	                };
	            }
	        };


	        //     For example:
	        //     cache[5] = function(func) {
	        //         return function(arg0, arg1, arg2, arg3, arg4) {
	        //             return func.call(this, arg0, arg1, arg2, arg3, arg4);
	        //         }
	        //     };

	        var makeN = function(n) {
	            var fnArgs = mkArgStr(n);
	            var body = [
	                '    return function(' + fnArgs + ') {',
	                '        return func.call(this' + (fnArgs ? ', ' + fnArgs : '') + ');',
	                '    }'
	            ].join('\n');
	            return new Function('func', body);
	        };

	        return function _nAry(n, fn) {
	            return (cache[n] || (cache[n] = makeN(n)))(fn);
	        };
	    }());


	    /**
	     * Wraps a function of any arity (including nullary) in a function that accepts exactly 1
	     * parameter. Any extraneous parameters will not be passed to the supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (* -> b) -> (a -> b)
	     * @param {Function} fn The function to wrap.
	     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	     *         arity 1.
	     * @example
	     *
	     *      var takesTwoArgs = function(a, b) {
	     *        return [a, b];
	     *      };
	     *      takesTwoArgs.length; //=> 2
	     *      takesTwoArgs(1, 2); //=> [1, 2]
	     *
	     *      var takesOneArg = R.unary(1, takesTwoArgs);
	     *      takesOneArg.length; //=> 1
	     *      // Only 1 argument is passed to the wrapped function
	     *      takesOneArg(1, 2); //=> [1, undefined]
	     */
	    R.unary = function _unary(fn) {
	        return nAry(1, fn);
	    };


	    /**
	     * Wraps a function of any arity (including nullary) in a function that accepts exactly 2
	     * parameters. Any extraneous parameters will not be passed to the supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (* -> c) -> (a, b -> c)
	     * @param {Function} fn The function to wrap.
	     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
	     *         arity 2.
	     * @example
	     *
	     *      var takesThreeArgs = function(a, b, c) {
	     *        return [a, b, c];
	     *      };
	     *      takesThreeArgs.length; //=> 3
	     *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
	     *
	     *      var takesTwoArgs = R.binary(1, takesThreeArgs);
	     *      takesTwoArgs.length; //=> 2
	     *      // Only 2 arguments are passed to the wrapped function
	     *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
	     */
	    var binary = R.binary = function _binary(fn) {
	        return nAry(2, fn);
	    };


	    /**
	     * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
	     * parameters. Unlike `nAry`, which passes only `n` arguments to the wrapped function,
	     * functions produced by `arity` will pass all provided arguments to the wrapped function.
	     *
	     * @func
	     * @memberOf R
	     * @sig (Number, (* -> *)) -> (* -> *)
	     * @category Function
	     * @param {number} n The desired arity of the returned function.
	     * @param {Function} fn The function to wrap.
	     * @return {Function} A new function wrapping `fn`. The new function is
	     *         guaranteed to be of arity `n`.
	     * @example
	     *
	     *      var takesTwoArgs = function(a, b) {
	     *        return [a, b];
	     *      };
	     *      takesTwoArgs.length; //=> 2
	     *      takesTwoArgs(1, 2); //=> [1, 2]
	     *
	     *      var takesOneArg = R.unary(1, takesTwoArgs);
	     *      takesOneArg.length; //=> 1
	     *      // All arguments are passed through to the wrapped function
	     *      takesOneArg(1, 2); //=> [1, 2]
	     */
	    var arity = R.arity = (function() {
	        var cache = {
	            0: function(func) {
	                return function() {
	                    return func.apply(this, arguments);
	                };
	            },
	            1: function(func) {
	                return function(arg0) {
	                    return func.apply(this, arguments);
	                };
	            },
	            2: function(func) {
	                return function(arg0, arg1) {
	                    return func.apply(this, arguments);
	                };
	            },
	            3: function(func) {
	                return function(arg0, arg1, arg2) {
	                    return func.apply(this, arguments);
	                };
	            }
	        };

	        //     For example:
	        //     cache[5] = function(func) {
	        //         return function(arg0, arg1, arg2, arg3, arg4) {
	        //             return func.apply(this, arguments);
	        //         }
	        //     };

	        var makeN = function(n) {
	            var fnArgs = mkArgStr(n);
	            var body = [
	                '    return function(' + fnArgs + ') {',
	                '        return func.apply(this, arguments);',
	                '    }'
	            ].join('\n');
	            return new Function('func', body);
	        };

	        return function _arity(n, fn) {
	            return (cache[n] || (cache[n] = makeN(n)))(fn);
	        };
	    }());


	    /**
	     * Turns a named method of an object (or object prototype) into a function that can be
	     * called directly. Passing the optional `len` parameter restricts the returned function to
	     * the initial `len` parameters of the method.
	     *
	     * The returned function is curried and accepts `len + 1` parameters (or `method.length + 1`
	     * when `len` is not specified), and the final parameter is the target object.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (String, Object, Number) -> (* -> *)
	     * @param {string} name The name of the method to wrap.
	     * @param {Object} obj The object to search for the `name` method.
	     * @param [len] The desired arity of the wrapped method.
	     * @return {Function} A new function or `undefined` if the specified method is not found.
	     * @example
	     *
	     *      var charAt = R.invoker('charAt', String.prototype);
	     *      charAt(6, 'abcdefghijklm'); //=> 'g'
	     *
	     *      var join = R.invoker('join', Array.prototype);
	     *      var firstChar = charAt(0);
	     *      join('', R.map(firstChar, ['light', 'ampliifed', 'stimulated', 'emission', 'radiation']));
	     *      //=> 'laser'
	     */
	    var invoker = R.invoker = function _invoker(name, obj, len) {
	        var method = obj[name];
	        var length = len === void 0 ? method.length : len;
	        return method && curry(function() {
	            if (arguments.length) {
	                var target = Array.prototype.pop.call(arguments);
	                var targetMethod = target[name];
	                if (targetMethod == method) {
	                    return targetMethod.apply(target, arguments);
	                }
	            }
	        }, length + 1);
	    };


	    /**
	     * Accepts a function `fn` and any number of transformer functions and returns a new
	     * function. When the new function is invoked, it calls the function `fn` with parameters
	     * consisting of the result of calling each supplied handler on successive arguments to the
	     * new function. For example:
	     *
	     * ```javascript
	     *   var useWithExample = R.useWith(someFn, transformerFn1, transformerFn2);
	     *
	     *   // This invocation:
	     *   useWithExample('x', 'y');
	     *   // Is functionally equivalent to:
	     *   someFn(transformerFn1('x'), transformerFn2('y'))
	     * ```
	     *
	     * If more arguments are passed to the returned function than transformer functions, those
	     * arguments are passed directly to `fn` as additional parameters. If you expect additional
	     * arguments that don't need to be transformed, although you can ignore them, it's best to
	     * pass an identity function so that the new function reports the correct arity.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig ((* -> *), (* -> *)...) -> (* -> *)
	     * @param {Function} fn The function to wrap.
	     * @param {...Function} transformers A variable number of transformer functions
	     * @return {Function} The wrapped function.
	     * @example
	     *
	     *      var double = function(y) { return y * 2; };
	     *      var square = function(x) { return x * x; };
	     *      var add = function(a, b) { return a + b; };
	     *      // Adds any number of arguments together
	     *      var addAll = function() {
	     *        return R.reduce(add, 0, arguments);
	     *      };
	     *
	     *      // Basic example
	     *      var addDoubleAndSquare = R.useWith(addAll, double, square);
	     *
	     *      addDoubleAndSquare(10, 5); //≅ addAll(double(10), square(5));
	     *      //=> 125
	     *
	     *      // Example of passing more arguments than transformers
	     *      addDoubleAndSquare(10, 5, 100); //≅ addAll(double(10), square(5), 100);
	     *      //=> 225
	     *
	     *      // But if you're expecting additional arguments that don't need transformation, it's best
	     *      // to pass transformer functions so the resulting function has the correct arity
	     *      var addDoubleAndSquareWithExtraParams = R.useWith(addAll, double, square, R.identity);
	     *      addDoubleAndSquare(10, 5, 100); //≅ addAll(double(10), square(5), R.identity(100));
	     *      //=> 225
	     */
	    var useWith = R.useWith = function _useWith(fn /*, transformers */) {
	        var transformers = _slice(arguments, 1);
	        var tlen = transformers.length;
	        return curry(arity(tlen, function() {
	            var args = [], idx = -1;
	            while (++idx < tlen) {
	                args.push(transformers[idx](arguments[idx]));
	            }
	            return fn.apply(this, args.concat(_slice(arguments, tlen)));
	        }));
	    };


	    /**
	     * Iterate over an input `list`, calling a provided function `fn` for each element in the
	     * list.
	     *
	     * `fn` receives one argument: *(value)*.
	     *
	     * Note: `R.forEach` does not skip deleted or unassigned indices (sparse arrays), unlike
	     * the native `Array.prototype.forEach` method. For more details on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
	     *
	     * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns the original
	     * array. In some libraries this function is named `each`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> *) -> [a] -> [a]
	     * @param {Function} fn The function to invoke. Receives one argument, `value`.
	     * @param {Array} list The list to iterate over.
	     * @return {Array} The original list.
	     * @example
	     *
	     *      R.forEach(function(num) {
	     *        console.log(num + 100);
	     *      }, [1, 2, 3]); //=> [1, 2, 3]
	     *      //-> 101
	     *      //-> 102
	     *      //-> 103
	     */
	    function forEach(fn, list) {
	        var idx = -1, len = list.length;
	        while (++idx < len) {
	            fn(list[idx]);
	        }
	        // i can't bear not to return *something*
	        return list;
	    }
	    R.forEach = curry2(forEach);


	    /**
	     * Like `forEach`, but but passes additional parameters to the predicate function.
	     *
	     * `fn` receives three arguments: *(value, index, list)*.
	     *
	     * Note: `R.forEach.idx` does not skip deleted or unassigned indices (sparse arrays),
	     * unlike the native `Array.prototype.forEach` method. For more details on this behavior,
	     * see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
	     *
	     * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns the original
	     * array. In some libraries this function is named `each`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a, i, [a] -> ) -> [a] -> [a]
	     * @param {Function} fn The function to invoke. Receives three arguments:
	     *        (`value`, `index`, `list`).
	     * @param {Array} list The list to iterate over.
	     * @return {Array} The original list.
	     * @alias forEach.idx
	     * @example
	     *
	     *      // Note that having access to the original `list` allows for
	     *      // mutation. While you *can* do this, it's very un-functional behavior:
	     *      R.forEach.idx(function(num, idx, list) {
	     *        list[idx] = num + 100;
	     *      }, [1, 2, 3]); //=> [101, 102, 103]
	     */
	    R.forEach.idx = curry2(function forEachIdx(fn, list) {
	        var idx = -1, len = list.length;
	        while (++idx < len) {
	            fn(list[idx], idx, list);
	        }
	        // i can't bear not to return *something*
	        return list;
	    });


	    /**
	     * Creates a shallow copy of an array.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig [a] -> [a]
	     * @param {Array} list The list to clone.
	     * @return {Array} A new copy of the original list.
	     * @example
	     *
	     *      var numbers = [1, 2, 3];
	     *      var numbersClone = R.clone(numbers); //=> [1, 2, 3]
	     *      numbers === numbersClone; //=> false
	     *
	     *      // Note that this is a shallow clone--it does not clone complex values:
	     *      var objects = [{}, {}, {}];
	     *      var objectsClone = R.clone(objects);
	     *      objects[0] === objectsClone[0]; //=> true
	     */
	    var clone = R.clone = function _clone(list) {
	        return _slice(list);
	    };

	    // Core Functions
	    // --------------
	    //


	    /**
	     * Reports whether an array is empty.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig [a] -> Boolean
	     * @param {Array} arr The array to consider.
	     * @return {boolean} `true` if the `arr` argument has a length of 0 or
	     *         if `arr` is a falsy value (e.g. undefined).
	     * @example
	     *
	     *      R.isEmpty([1, 2, 3]); //=> false
	     *      R.isEmpty([]); //=> true
	     *      R.isEmpty(); //=> true
	     *      R.isEmpty(null); //=> true
	     */
	    function isEmpty(arr) {
	        return !arr || !arr.length;
	    }
	    R.isEmpty = isEmpty;


	    /**
	     * Returns a new list with the given element at the front, followed by the contents of the
	     * list.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig a -> [a] -> [a]
	     * @param {*} el The item to add to the head of the output list.
	     * @param {Array} arr The array to add to the tail of the output list.
	     * @return {Array} A new array.
	     * @example
	     *
	     *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
	     */
	    R.prepend = function prepend(el, arr) {
	        return concat([el], arr);
	    };

	    /**
	     * @func
	     * @memberOf R
	     * @category Array
	     * @see R.prepend
	     */
	    R.cons = R.prepend;


	    /**
	     * Returns the first element in a list.
	     * In some libraries this function is named `first`.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig [a] -> a
	     * @param {Array} [arr=[]] The array to consider.
	     * @return {*} The first element of the list, or `undefined` if the list is empty.
	     * @example
	     *
	     *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
	     */
	    var head = R.head = function head(arr) {
	        arr = arr || [];
	        return arr[0];
	    };

	    /**
	     * @func
	     * @memberOf R
	     * @category Array
	     * @see R.head
	     */
	    R.car = R.head;


	    /**
	     * Returns the last element from a list.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig [a] -> a
	     * @param {Array} [arr=[]] The array to consider.
	     * @return {*} The last element of the list, or `undefined` if the list is empty.
	     * @example
	     *
	     *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
	     */
	    R.last = function _last(arr) {
	        arr = arr || [];
	        return arr[arr.length - 1];
	    };


	    /**
	     * Returns all but the first element of a list. If the list provided has the `tail` method,
	     * it will instead return `list.tail()`.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig [a] -> [a]
	     * @param {Array} [arr=[]] The array to consider.
	     * @return {Array} A new array containing all but the first element of the input list, or an
	     *         empty list if the input list is a falsy value (e.g. `undefined`).
	     * @example
	     *
	     *      R.tail(['fi', 'fo', 'fum']); //=> ['fo', 'fum']
	     */
	    var tail = R.tail = checkForMethod('tail', function(arr) {
	        arr = arr || [];
	        return (arr.length > 1) ? _slice(arr, 1) : [];
	    });

	    /**
	     * @func
	     * @memberOf R
	     * @category Array
	     * @see R.tail
	     */
	    R.cdr = R.tail;


	    /**
	     * Returns `true` if the argument is an atom; `false` otherwise. An atom is defined as any
	     * value that is not an array, `undefined`, or `null`.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig a -> Boolean
	     * @param {*} x The element to consider.
	     * @return {boolean} `true` if `x` is an atom, and `false` otherwise.
	     * @example
	     *
	     *      R.isAtom([]); //=> false
	     *      R.isAtom(null); //=> false
	     *      R.isAtom(undefined); //=> false
	     *
	     *      R.isAtom(0); //=> true
	     *      R.isAtom(''); //=> true
	     *      R.isAtom('test'); //=> true
	     *      R.isAtom({}); //=> true
	     */
	    R.isAtom = function _isAtom(x) {
	        return x != null && !isArray(x);
	    };


	    /**
	     * Returns a new list containing the contents of the given list, followed by the given
	     * element.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig a -> [a] -> [a]
	     * @param {*} el The element to add to the end of the new list.
	     * @param {Array} list The list whose contents will be added to the beginning of the output
	     *        list.
	     * @return {Array} A new list containing the contents of the old list followed by `el`.
	     * @example
	     *
	     *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
	     *      R.append('tests', []); //=> ['tests']
	     *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
	     */
	    var append = R.append = function _append(el, list) {
	        return concat(list, [el]);
	    };

	    /**
	     * @func
	     * @memberOf R
	     * @category Array
	     * @see R.append
	     */
	    R.push = R.append;


	    /**
	     * Returns a new list consisting of the elements of the first list followed by the elements
	     * of the second.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig [a] -> [a] -> [a]
	     * @param {Array} list1 The first list to merge.
	     * @param {Array} list2 The second set to merge.
	     * @return {Array} A new array consisting of the contents of `list1` followed by the
	     *         contents of `list2`. If, instead of an {Array} for `list1`, you pass an
	     *         object with a `concat` method on it, `concat` will call `list1.concat`
	     *         and it the value of `list2`.
	     * @example
	     *
	     *      R.concat([], []); //=> []
	     *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	     *      R.concat('ABC', 'DEF'); // 'ABCDEF'
	     */
	    R.concat = curry2(function(set1, set2) {
	        if (isArray(set2)) {
	            return concat(set1, set2);
	        } else if (R.is(String, set1)) {
	            return set1.concat(set2);
	        } else if (hasMethod('concat', set2)) {
	            return set2.concat(set1);
	        } else {
	            throw new TypeError("can't concat " + typeof set2);
	        }
	    });


	    /**
	     * A function that does nothing but return the parameter supplied to it. Good as a default
	     * or placeholder function.
	     *
	     * @func
	     * @memberOf R
	     * @category Core
	     * @sig a -> a
	     * @param {*} x The value to return.
	     * @return {*} The input value, `x`.
	     * @example
	     *
	     *      R.identity(1); //=> 1
	     *
	     *      var obj = {};
	     *      R.identity(obj) === obj; //=> true
	     */
	    var identity = R.identity = function _I(x) {
	        return x;
	    };

	    /**
	     * @func
	     * @memberOf R
	     * @category Core
	     * @see R.identity
	     */
	    R.I = R.identity;


	    /**
	     * Calls an input function `n` times, returning an array containing the results of those
	     * function calls.
	     *
	     * `fn` is passed one argument: The current value of `n`, which begins at `0` and is
	     * gradually incremented to `n - 1`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (i -> a) -> i -> [a]
	     * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
	     * @param {number} n A value between `0` and `n - 1`. Increments after each function call.
	     * @return {Array} An array containing the return values of all calls to `fn`.
	     * @example
	     *
	     *      R.times(function(n) { return n; }, 5); //=> [0, 1, 2, 3, 4]
	     */
	    R.times = curry2(function _times(fn, n) {
	        var arr = new Array(n);
	        var i = -1;
	        while (++i < n) {
	            arr[i] = fn(i);
	        }
	        return arr;
	    });


	    /**
	     * Returns a fixed list of size `n` containing a specified identical value.
	     *
	     * @func
	     * @memberOf R
	     * @category Array
	     * @sig a -> n -> [a]
	     * @param {*} value The value to repeat.
	     * @param {number} n The desired size of the output list.
	     * @return {Array} A new array containing `n` `value`s.
	     * @example
	     *
	     *      R.repeatN('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
	     *
	     *      var obj = {};
	     *      var repeatedObjs = R.repeatN(obj, 5); //=> [{}, {}, {}, {}, {}]
	     *      repeatedObjs[0] === repeatedObjs[1]; //=> true
	     */
	    R.repeatN = curry2(function _repeatN(value, n) {
	        return R.times(R.always(value), n);
	    });



	    // Function functions :-)
	    // ----------------------
	    //
	    // These functions make new functions out of old ones.

	    // --------

	    /**
	     * Basic, right-associative composition function. Accepts two functions and returns the
	     * composite function; this composite function represents the operation `var h = f(g(x))`,
	     * where `f` is the first argument, `g` is the second argument, and `x` is whatever
	     * argument(s) are passed to `h`.
	     *
	     * This function's main use is to build the more general `compose` function, which accepts
	     * any number of functions.
	     *
	     * @private
	     * @category Function
	     * @param {Function} f A function.
	     * @param {Function} g A function.
	     * @return {Function} A new function that is the equivalent of `f(g(x))`.
	     * @example
	     *
	     *      var double = function(x) { return x * 2; };
	     *      var square = function(x) { return x * x; };
	     *      var squareThenDouble = internalCompose(double, square);
	     *
	     *      squareThenDouble(5); //≅ double(square(5)) => 50
	     */
	    function internalCompose(f, g) {
	        return function() {
	            return f.call(this, g.apply(this, arguments));
	        };
	    }


	    /**
	     * Creates a new function that runs each of the functions supplied as parameters in turn,
	     * passing the return value of each function invocation to the next function invocation,
	     * beginning with whatever arguments were passed to the initial invocation.
	     *
	     * Note that `compose` is a right-associative function, which means the functions provided
	     * will be invoked in order from right to left. In the example `var h = compose(f, g)`,
	     * the function `h` is equivalent to `f( g(x) )`, where `x` represents the arguments
	     * originally passed to `h`.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig ((y -> z), (x -> y), ..., (b -> c), (a... -> b)) -> (a... -> z)
	     * @param {...Function} functions A variable number of functions.
	     * @return {Function} A new function which represents the result of calling each of the
	     *         input `functions`, passing the result of each function call to the next, from
	     *         right to left.
	     * @example
	     *
	     *      var triple = function(x) { return x * 3; };
	     *      var double = function(x) { return x * 2; };
	     *      var square = function(x) { return x * x; };
	     *      var squareThenDoubleThenTriple = R.compose(triple, double, square);
	     *
	     *      squareThenDoubleThenTriple(5); //≅ triple(double(square(5))) => 150
	     */
	    var compose = R.compose = function _compose() {
	        switch (arguments.length) {
	            case 0: throw NO_ARGS_EXCEPTION;
	            case 1: return arguments[0];
	            default:
	                var idx = arguments.length - 1, func = arguments[idx], fnArity = func.length;
	                while (idx--) {
	                    func = internalCompose(arguments[idx], func);
	                }
	                return arity(fnArity, func);
	        }
	    };


	    /**
	     * Creates a new function that runs each of the functions supplied as parameters in turn,
	     * passing the return value of each function invocation to the next function invocation,
	     * beginning with whatever arguments were passed to the initial invocation.
	     *
	     * `pipe` is the mirror version of `compose`. `pipe` is left-associative, which means that
	     * each of the functions provided is executed in order from left to right.
	     *
	     * In some libraries this function is named `sequence`.
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig ((a... -> b), (b -> c), ..., (x -> y), (y -> z)) -> (a... -> z)
	     * @param {...Function} functions A variable number of functions.
	     * @return {Function} A new function which represents the result of calling each of the
	     *         input `functions`, passing the result of each function call to the next, from
	     *         right to left.
	     * @example
	     *
	     *      var triple = function(x) { return x * 3; };
	     *      var double = function(x) { return x * 2; };
	     *      var square = function(x) { return x * x; };
	     *      var squareThenDoubleThenTriple = R.pipe(square, double, triple);
	     *
	     *      squareThenDoubleThenTriple(5); //≅ triple(double(square(5))) => 150
	     */
	    R.pipe = function _pipe() {
	        return compose.apply(this, _slice(arguments).reverse());
	    };


	    /**
	     * Returns a new function much like the supplied one, except that the first two arguments'
	     * order is reversed.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (a -> b -> c -> ... -> z) -> (b -> a -> c -> ... -> z)
	     * @param {Function} fn The function to invoke with its first two parameters reversed.
	     * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
	     * @example
	     *
	     *      var mergeThree = function(a, b, c) {
	     *        ([]).concat(a, b, c);
	     *      };
	     *      var numbers = [1, 2, 3];
	     *
	     *      mergeThree(numbers); //=> [1, 2, 3]
	     *
	     *      R.flip([1, 2, 3]); //=> [2, 1, 3]
	     */
	    var flip = R.flip = function _flip(fn) {
	        return function(a, b) {
	            switch (arguments.length) {
	                case 0: throw NO_ARGS_EXCEPTION;
	                case 1: return function(b) { return fn.apply(this, [b, a].concat(_slice(arguments, 1))); };
	                default: return fn.apply(this, concat([b, a], _slice(arguments, 2)));
	            }
	        };
	    };


	    /**
	     * Accepts as its arguments a function and any number of values and returns a function that,
	     * when invoked, calls the original function with all of the values prepended to the
	     * original function's arguments list. In some libraries this function is named `applyLeft`.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (a -> b -> ... -> i -> j -> ... -> m -> n) -> a -> b-> ... -> i -> (j -> ... -> m -> n)
	     * @param {Function} fn The function to invoke.
	     * @param {...*} [args] Arguments to prepend to `fn` when the returned function is invoked.
	     * @return {Function} A new function wrapping `fn`. When invoked, it will call `fn`
	     *         with `args` prepended to `fn`'s arguments list.
	     * @example
	     *
	     *      var multiply = function(a, b) { return a * b; };
	     *      var double = R.lPartial(multiply, 2);
	     *      double(2); //=> 4
	     *
	     *      var greet = function(salutation, title, firstName, lastName) {
	     *        return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	     *      };
	     *      var sayHello = R.lPartial(greet, 'Hello');
	     *      var sayHelloToMs = R.lPartial(sayHello, 'Ms.');
	     *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
	     */
	    R.lPartial = function _lPartial(fn /*, args */) {
	        var args = _slice(arguments, 1);
	        return arity(Math.max(fn.length - args.length, 0), function() {
	            return fn.apply(this, concat(args, arguments));
	        });
	    };


	    /**
	     * Accepts as its arguments a function and any number of values and returns a function that,
	     * when invoked, calls the original function with all of the values appended to the original
	     * function's arguments list.
	     *
	     * Note that `rPartial` is the opposite of `lPartial`: `rPartial` fills `fn`'s arguments
	     * from the right to the left.  In some libraries this function is named `applyRight`.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (a -> b-> ... -> i -> j -> ... -> m -> n) -> j -> ... -> m -> n -> (a -> b-> ... -> i)
	     * @param {Function} fn The function to invoke.
	     * @param {...*} [args] Arguments to append to `fn` when the returned function is invoked.
	     * @return {Function} A new function wrapping `fn`. When invoked, it will call `fn` with
	     *         `args` appended to `fn`'s arguments list.
	     * @example
	     *
	     *      var greet = function(salutation, title, firstName, lastName) {
	     *        return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	     *      };
	     *      var greetMsJaneJones = R.rPartial(greet, 'Ms.', 'Jane', 'Jones');
	     *
	     *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
	     */
	    R.rPartial = function _rPartial(fn) {
	        var args = _slice(arguments, 1);
	        return arity(Math.max(fn.length - args.length, 0), function() {
	            return fn.apply(this, concat(arguments, args));
	        });
	    };


	    /**
	     * Creates a new function that, when invoked, caches the result of calling `fn` for a given
	     * argument set and returns the result. Subsequent calls to the memoized `fn` with the same
	     * argument set will not result in an additional call to `fn`; instead, the cached result
	     * for that set of arguments will be returned.
	     *
	     * Note that this version of `memoize` effectively handles only string and number
	     * parameters.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (a... -> b) -> (a... -> b)
	     * @param {Function} fn The function to be wrapped by `memoize`.
	     * @return {Function}  Returns a memoized version of `fn`.
	     * @example
	     *
	     *      var numberOfCalls = 0;
	     *      var tracedAdd = function(a, b) {
	     *        numberOfCalls += 1;
	     *        return a + b;
	     *      };
	     *      var memoTrackedAdd = R.memoize(trackedAdd);
	     *
	     *      memoAdd(1, 2); //=> 3 (numberOfCalls => 1)
	     *      memoAdd(1, 2); //=> 3 (numberOfCalls => 1)
	     *      memoAdd(2, 3); //=> 5 (numberOfCalls => 2)
	     *
	     *      // Note that argument order matters
	     *      memoAdd(2, 1); //=> 3 (numberOfCalls => 3)
	     */
	    R.memoize = function _memoize(fn) {
	        var cache = {};
	        return function() {
	            var position = foldl(function(cache, arg) {
	                    return cache[arg] || (cache[arg] = {});
	                }, cache,
	                _slice(arguments, 0, arguments.length - 1));
	            var arg = arguments[arguments.length - 1];
	            return (position[arg] || (position[arg] = fn.apply(this, arguments)));
	        };
	    };


	    /**
	     * Accepts a function `fn` and returns a function that guards invocation of `fn` such that
	     * `fn` can only ever be called once, no matter how many times the returned function is
	     * invoked.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (a... -> b) -> (a... -> b)
	     * @param {Function} fn The function to wrap in a call-only-once wrapper.
	     * @return {Function} The wrapped function.
	     * @example
	     *
	     *      var alertOnce = R.once(alert);
	     *      alertOnce('Hello!'); // Alerts 'Hello!'
	     *      alertOnce('Nothing'); // Doesn't alert
	     *      alertOnce('Again'); // Doesn't alert
	     */
	    R.once = function _once(fn) {
	        var called = false, result;
	        return function() {
	            if (called) {
	                return result;
	            }
	            called = true;
	            result = fn.apply(this, arguments);
	            return result;
	        };
	    };


	    /**
	     * Wrap a function inside another to allow you to make adjustments to the parameters, or do
	     * other processing either before the internal function is called or with its results.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * ((* -> *) -> ((* -> *), a...) -> (*, a... -> *)
	     * @param {Function} fn The function to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @return {Function} The wrapped function.
	     * @example
	     *
	     *      var slashify = wrap(flip(add)('/'), function(f, x) {
	     *        return match(/\/$/)(x) ? x : f(x)
	     *      });
	     *
	     * slashify('a') //= 'a/'
	     * slashify('a/') //= 'a/'
	     */
	    R.wrap = function _wrap(fn, wrapper) {
	        return function() {
	            return wrapper.apply(this, concat([fn], arguments));
	        };
	    };


	    /**
	     * Wraps a constructor function inside a curried function that can be called with the same
	     * arguments and returns the same type. The arity of the function returned is specified
	     * to allow using variadic constructor functions.
	     *
	     * NOTE: Does not work with some built-in objects such as Date.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig Number -> (* -> {*}) -> (* -> {*})
	     * @param {number} n The arity of the constructor function.
	     * @param {Function} Fn The constructor function to wrap.
	     * @return {Function} A wrapped, curried constructor function.
	     * @example
	     *
	     *      // Variadic constructor function
	     *      var Widget = function() {
	     *        this.children = Array.prototype.slice.call(arguments);
	     *        // ...
	     *      };
	     *      Widget.prototype = {
	     *        // ...
	     *      };
	     *      map(constructN(1, Widget), allConfigs); //=> a list of Widgets
	     */
	    var constructN = R.constructN = function _constructN(n, Fn) {
	        var f = function() {
	            var Temp = function() {}, inst, ret;
	            Temp.prototype = Fn.prototype;
	            inst = new Temp();
	            ret = Fn.apply(inst, arguments);
	            return Object(ret) === ret ? ret : inst;
	        };
	        return n > 1 ? curry(nAry(n, f)) : f;
	    };


	    /**
	     * Wraps a constructor function inside a curried function that can be called with the same
	     * arguments and returns the same type.
	     *
	     * NOTE: Does not work with some built-in objects such as Date.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (* -> {*}) -> (* -> {*})
	     * @param {Function} Fn The constructor function to wrap.
	     * @return {Function} A wrapped, curried constructor function.
	     * @example
	     *
	     *      // Constructor function
	     *      var Widget = function(config) {
	     *        // ...
	     *      };
	     *      Widget.prototype = {
	     *        // ...
	     *      };
	     *      map(construct(Widget), allConfigs); //=> a list of Widgets
	     */
	    R.construct = function _construct(Fn) {
	        return constructN(Fn.length, Fn);
	    };


	    /**
	     * Accepts three functions and returns a new function. When invoked, this new function will
	     * invoke the first function, `after`, passing as its arguments the results of invoking the
	     * second and third functions with whatever arguments are passed to the new function.
	     *
	     * For example, a function produced by `converge` is equivalent to:
	     *
	     * ```javascript
	     *   var h = R.converge(e, f, g);
	     *   h(1, 2); //≅ e( f(1, 2), g(1, 2) )
	     * ```
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig ((a, b -> c) -> (((* -> a), (* -> b), ...) -> c)
	     * @param {Function} after A function. `after` will be invoked with the return values of
	     *        `fn1` and `fn2` as its arguments.
	     * @param {Function} fn1 A function. It will be invoked with the arguments passed to the
	     *        returned function. Afterward, its resulting value will be passed to `after` as
	     *        its first argument.
	     * @param {Function} fn2 A function. It will be invoked with the arguments passed to the
	     *        returned function. Afterward, its resulting value will be passed to `after` as
	     *        its second argument.
	     * @return {Function} A new function.
	     * @example
	     *
	     *      var add = function(a, b) { return a + b; };
	     *      var multiply = function(a, b) { return a * b; };
	     *      var subtract = function(a, b) { return a - b; };
	     *
	     *      R.converge(multiply, add, subtract)(1, 2);
	     *      //≅ multiply( add(1, 2), subtract(1, 2) );
	     *      //=> -3
	     */
	    R.converge = function(after) {
	        var fns = _slice(arguments, 1);
	        return function() {
	            var args = arguments;
	            return after.apply(this, map(function(fn) {
	                return fn.apply(this, args);
	            }, fns));
	        };
	    };



	    // List Functions
	    // --------------
	    //
	    // These functions operate on logical lists, here plain arrays.  Almost all of these are curried, and the list
	    // parameter comes last, so you can create a new function by supplying the preceding arguments, leaving the
	    // list parameter off.  For instance:
	    //
	    //     // skip third parameter
	    //     var checkAllPredicates = reduce(andFn, alwaysTrue);
	    //     // ... given suitable definitions of odd, lt20, gt5
	    //     var test = checkAllPredicates([odd, lt20, gt5]);
	    //     // test(7) => true, test(9) => true, test(10) => false,
	    //     // test(3) => false, test(21) => false,

	    // --------

	    /**
	     * Returns a single item by iterating through the list, successively calling the iterator
	     * function and passing it an accumulator value and the current value from the array, and
	     * then passing the result to the next call.
	     *
	     * The iterator function receives two values: *(acc, value)*
	     *
	     * Note: `R.reduce` does not skip deleted or unassigned indices (sparse arrays), unlike
	     * the native `Array.prototype.reduce` method. For more details on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a,b -> a) -> a -> [b] -> a
	     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	     *        current element from the array.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @example
	     *
	     *      var numbers = [1, 2, 3];
	     *      var add = function(a, b) {
	     *        return a + b;
	     *      };
	     *
	     *      reduce(add, 10, numbers); //=> 16
	     */
	    R.reduce = curry3(checkForMethod('reduce', function _reduce(fn, acc, list) {
	        var idx = -1, len = list.length;
	        while (++idx < len) {
	            acc = fn(acc, list[idx]);
	        }
	        return acc;
	    }));

	    /**
	     * @func
	     * @memberOf R
	     * @category List
	     * @see R.reduce
	     */
	    var foldl = R.foldl = R.reduce;


	    /**
	     * Like `reduce`, but passes additional parameters to the predicate function.
	     *
	     * The iterator function receives four values: *(acc, value, index, list)*
	     *
	     * Note: `R.reduce.idx` does not skip deleted or unassigned indices (sparse arrays),
	     * unlike the native `Array.prototype.reduce` method. For more details on this behavior,
	     * see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a,b,i,[b] -> a) -> a -> [b] -> a
	     * @param {Function} fn The iterator function. Receives four values: the accumulator, the
	     *        current element from `list`, that element's index, and the entire `list` itself.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @alias reduce.idx
	     * @example
	     *
	     *      var letters = ['a', 'b', 'c'];
	     *      var objectify = function(accObject, elem, idx, list) {
	     *        return accObject[elem] = idx;
	     *      };
	     *
	     *      reduce.idx(letters, objectify, {}); //=> { 'a': 0, 'b': 1, 'c': 2 }
	     */
	    R.reduce.idx = curry3(function _reduceIdx(fn, acc, list) {
	        var idx = -1, len = list.length;
	        while (++idx < len) {
	            acc = fn(acc, list[idx], idx, list);
	        }
	        return acc;
	    });


	    /**
	     * @func
	     * @memberOf R
	     * @category List
	     * @alias foldl.idx
	     * @see R.reduce.idx
	     */
	    R.foldl.idx = R.reduce.idx;


	    /**
	     * Returns a single item by iterating through the list, successively calling the iterator
	     * function and passing it an accumulator value and the current value from the array, and
	     * then passing the result to the next call.
	     *
	     * Similar to `reduce`, except moves through the input list from the right to the left.
	     *
	     * The iterator function receives two values: *(acc, value)*
	     *
	     * Note: `R.reduce` does not skip deleted or unassigned indices (sparse arrays), unlike
	     * the native `Array.prototype.reduce` method. For more details on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a,b -> a) -> a -> [b] -> a
	     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	     *        current element from the array.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @example
	     *
	     *      var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
	     *      var flattenPairs = function(acc, pair) {
	     *        return acc.concat(pair);
	     *      };
	     *
	     *      reduceRight(numbers, flattenPairs, []); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
	     */
	    R.reduceRight = curry3(checkForMethod('reduceRight', function _reduceRight(fn, acc, list) {
	        var idx = list.length;
	        while (idx--) {
	            acc = fn(acc, list[idx]);
	        }
	        return acc;
	    }));

	    /**
	     * @func
	     * @memberOf R
	     * @category List
	     * @see R.reduceRight
	     */
	    var foldr = R.foldr = R.reduceRight;


	    /**
	     * Like `reduceRight`, but passes additional parameters to the predicate function. Moves through
	     * the input list from the right to the left.
	     *
	     * The iterator function receives four values: *(acc, value, index, list)*.
	     *
	     * Note: `R.reduceRight.idx` does not skip deleted or unassigned indices (sparse arrays),
	     * unlike the native `Array.prototype.reduce` method. For more details on this behavior,
	     * see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a,b,i,[b] -> a -> [b] -> a
	     * @param {Function} fn The iterator function. Receives four values: the accumulator, the
	     *        current element from `list`, that element's index, and the entire `list` itself.
	     * @param {*} acc The accumulator value.
	     * @param {Array} list The list to iterate over.
	     * @return {*} The final, accumulated value.
	     * @alias reduceRight.idx
	     * @example
	     *
	     *      var letters = ['a', 'b', 'c'];
	     *      var objectify = function(accObject, elem, idx, list) {
	     *        return accObject[elem] = idx;
	     *      };
	     *
	     *      reduceRight.idx(letters, objectify, {}); //=> { 'c': 2, 'b': 1, 'a': 0 }
	     */
	    R.reduceRight.idx = curry3(function _reduceRightIdx(fn, acc, list) {
	        var idx = list.length;
	        while (idx--) {
	            acc = fn(acc, list[idx], idx, list);
	        }
	        return acc;
	    });


	    /**
	     * @func
	     * @memberOf R
	     * @category List
	     * @alias foldr.idx
	     * @see R.reduceRight.idx
	     */
	    R.foldr.idx = R.reduceRight.idx;


	    /**
	     * Builds a list from a seed value. Accepts an iterator function, which returns either false
	     * to stop iteration or an array of length 2 containing the value to add to the resulting
	     * list and the seed to be used in the next call to the iterator function.
	     *
	     * The iterator function receives one argument: *(seed)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> [b]) -> * -> [b]
	     * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
	     *        either false to quit iteration or an array of length two to proceed. The element
	     *        at index 0 of this array will be added to the resulting array, and the element
	     *        at index 1 will be passed to the next call to `fn`.
	     * @param {*} seed The seed value.
	     * @return {Array} The final list.
	     * @example
	     *
	     *      var f = function(n) { return n > 50 ? false : [-n, n + 10] };
	     *      unfoldr(f, 10) //= [-10, -20, -30, -40, -50]
	     */
	    R.unfoldr = curry2(function _unfoldr(fn, seed) {
	        var pair = fn(seed);
	        var result = [];
	        while (pair && pair.length) {
	            result.push(pair[0]);
	            pair = fn(pair[1]);
	        }
	        return result;
	    });


	    /**
	     * Returns a new list, constructed by applying the supplied function to every element of the
	     * supplied list.
	     *
	     * Note: `R.map` does not skip deleted or unassigned indices (sparse arrays), unlike the
	     * native `Array.prototype.map` method. For more details on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Description
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> b) -> [a] -> [b]
	     * @param {Function} fn The function to be called on every element of the input `list`.
	     * @param {Array} list The list to be iterated over.
	     * @return {Array} The new list.
	     * @example
	     *
	     *      var double = function(x) {
	     *        return x * 2;
	     *      };
	     *
	     *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
	     */
	    function map(fn, list) {
	        var idx = -1, len = list.length, result = new Array(len);
	        while (++idx < len) {
	            result[idx] = fn(list[idx]);
	        }
	        return result;
	    }

	    R.map = curry2(checkForMethod('map', map));


	    /**
	     * Like `map`, but but passes additional parameters to the mapping function.
	     * `fn` receives three arguments: *(value, index, list)*.
	     *
	     * Note: `R.map.idx` does not skip deleted or unassigned indices (sparse arrays), unlike
	     * the native `Array.prototype.map` method. For more details on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Description
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a,i,[b] -> b) -> [a] -> [b]
	     * @param {Function} fn The function to be called on every element of the input `list`.
	     * @param {Array} list The list to be iterated over.
	     * @return {Array} The new list.
	     * @alias map.idx
	     * @example
	     *
	     *      var squareEnds = function(elt, idx, list) {
	     *        if (idx === 0 || idx === list.length - 1) {
	     *          return elt * elt;
	     *        }
	     *        return elt;
	     *      };
	     *
	     *      R.map.idx(squareEnds, [8, 6, 7, 5, 3, 0, 9];
	     *      //=> [64, 6, 7, 5, 3, 0, 81]
	     */
	    R.map.idx = curry2(function _mapIdx(fn, list) {
	        var idx = -1, len = list.length, result = new Array(len);
	        while (++idx < len) {
	            result[idx] = fn(list[idx], idx, list);
	        }
	        return result;
	    });


	    /**
	     * Map, but for objects. Creates an object with the same keys as `obj` and values
	     * generated by running each property of `obj` through `fn`. `fn` is passed one argument:
	     * *(value)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (v -> v) -> {k: v} -> {k: v}
	     * @param {Array} fn A function called for each property in `obj`. Its return value will
	     * become a new property on the return object.
	     * @param {Object} obj The object to iterate over.
	     * @return {Object} A new object with the same keys as `obj` and values that are the result
	     * of running each property through `fn`.
	     * @example
	     *
	     *      var values = { x: 1, y: 2, z: 3 };
	     *      var double = function(num) {
	     *        return num * 2;
	     *      };
	     *
	     *      R.mapObj(double, values); //=> { x: 2, y: 4, z: 6 }
	     */
	    // TODO: consider mapObj.key in parallel with mapObj.idx.  Also consider folding together with `map` implementation.
	    R.mapObj = curry2(function _mapObject(fn, obj) {
	        return foldl(function(acc, key) {
	            acc[key] = fn(obj[key]);
	            return acc;
	        }, {}, keys(obj));
	    });


	    /**
	     * Like `mapObj`, but but passes additional arguments to the predicate function. The
	     * predicate function is passed three arguments: *(value, key, obj)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (v, k, {k: v} -> v) -> {k: v} -> {k: v}
	     * @param {Array} fn A function called for each property in `obj`. Its return value will
	     * @param {Array} fn A function called for each property in `obj`. Its return value will
	     *        become a new property on the return object.
	     * @param {Object} obj The object to iterate over.
	     * @return {Object} A new object with the same keys as `obj` and values that are the result
	     *         of running each property through `fn`.
	     * @alias mapObj.idx
	     * @example
	     *
	     *      var values = { x: 1, y: 2, z: 3 };
	     *      var double = function(num, key, obj) {
	     *        return key + num;
	     *      };
	     *
	     *      R.mapObj(double, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
	     */
	    R.mapObj.idx = curry2(function mapObjectIdx(fn, obj) {
	        return foldl(function(acc, key) {
	            acc[key] = fn(obj[key], key, obj);
	            return acc;
	        }, {}, keys(obj));
	    });


	    /**
	     * ap applies a list of functions to a list of values.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig [f] -> [a] -> [f a]
	     * @param {Array} fns An array of functions
	     * @param {Array} vs An array of values
	     * @return the value of applying each the function `fns` to each value in `vs`
	     * @example
	     *
	     *      R.ap([R.multiply(2), R.add(3), [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
	     */
	    R.ap = curry2(checkForMethod('ap', function _ap(fns, vs) {
	        return foldl(function(acc, fn) {
	            return concat(acc, map(fn, vs));
	        },  [], fns);
	    }));


	    /**
	     *
	     * `of` wraps any object in an Array. This implementation is compatible with the
	     * Fantasy-land Applicative spec, and will work with types that implement that spec.
	     * Note this `of` is different from the ES6 `of`; See
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig a -> [a]
	     * @param x any value
	     * @return [x]
	     * @example
	     *
	     *      R.of(1); // => [1]
	     *      R.of([2]); // => [[2]]
	     *      R.of({}); // => [{}]
	     */
	    R.of = function _of(x, container) {
	        return (hasMethod('of', container)) ? container.of(x) : [x];
	    };


	    /**
	     * `empty` wraps any object in an array. This implementation is compatible with the
	     * Fantasy-land Monoid spec, and will work with types that implement that spec.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig * -> []
	     * @return {Array} an empty array
	     * @example
	     *
	     * R.empty([1,2,3,4,5]); // => []
	     */
	    R.empty = function _empty(x) {
	        return (hasMethod('empty', x)) ? x.empty() : [];
	    };


	    /**
	     * `chain` maps a function over a list and concatenates the results.
	     * This implementation is compatible with the
	     * Fantasy-land Chain spec, and will work with types that implement that spec.
	     * `chain` is also known as `flatMap` in some libraries
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> [b]) -> [a] -> [b]
	     * @param {Function}
	     * @param {Array}
	     * @return {Array}
	     * @example
	     *
	     * var duplicate = function(n) {
	     *     return [n, n];
	     * };
	     * R.chain(duplicate, [1, 2, 3]); // => [1, 1, 2, 2, 3, 3]
	     *
	     */
	    R.chain = curry2(checkForMethod('chain', function _chain(f, list) {
	        return unnest(map(f, list));
	    }));


	    /**
	     * Returns the number of elements in the array by returning `arr.length`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig [a] -> Number
	     * @param {Array} arr The array to inspect.
	     * @return {number} The size of the array.
	     * @example
	     *
	     *      R.size([]); //=> 0
	     *      R.size([1, 2, 3]); //=> 3
	     */
	    R.size = function _size(arr) {
	        return arr.length;
	    };

	    /**
	     * @func
	     * @memberOf R
	     * @category List
	     * @see R.size
	     */
	    R.length = R.size;


	    /**
	     * Returns a new list containing only those items that match a given predicate function.
	     * The predicate function is passed one argument: *(value)*.
	     *
	     * Note that `R.filter` does not skip deleted or unassigned indices, unlike the native
	     * `Array.prototype.filter` method. For more details on this behavior, see:
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Description
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} The new filtered array.
	     * @example
	     *
	     *      var isEven = function(n) {
	     *        return n % 2 === 0;
	     *      };
	     *      var evens = R.filter(isEven, [1, 2, 3, 4]); // => [2, 4]
	     */
	    var filter = function _filter(fn, list) {
	        var idx = -1, len = list.length, result = [];
	        while (++idx < len) {
	            if (fn(list[idx])) {
	                result.push(list[idx]);
	            }
	        }
	        return result;
	    };

	    R.filter = curry2(checkForMethod('filter', filter));


	    /**
	     * Like `filter`, but passes additional parameters to the predicate function. The predicate
	     * function is passed three arguments: *(value, index, list)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a, i, [a] -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} The new filtered array.
	     * @alias filter.idx
	     * @example
	     *
	     *      var lastTwo = function(val, idx, list) {
	     *        return list.length - idx <= 2;
	     *      };
	     *      R.filter.idx(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [0, 9]
	     */
	    function filterIdx(fn, list) {
	        var idx = -1, len = list.length, result = [];
	        while (++idx < len) {
	            if (fn(list[idx], idx, list)) {
	                result.push(list[idx]);
	            }
	        }
	        return result;
	    }
	    R.filter.idx = curry2(filterIdx);


	    /**
	     * Similar to `filter`, except that it keeps only values for which the given predicate
	     * function returns falsy. The predicate function is passed one argument: *(value)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} The new filtered array.
	     * @example
	     *
	     *      var isOdd = function(n) {
	     *        return n % 2 === 1;
	     *      };
	     *      var evens = R.reject(isOdd, [1, 2, 3, 4]); // => [2, 4]
	     */
	    var reject = function _reject(fn, list) {
	        return filter(not(fn), list);
	    };
	    R.reject = curry2(reject);


	    /**
	     * Like `reject`, but passes additional parameters to the predicate function. The predicate
	     * function is passed three arguments: *(value, index, list)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a, i, [a] -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} The new filtered array.
	     * @alias reject.idx
	     * @example
	     *
	     *      var lastTwo = function(val, idx, list) {
	     *        return list.length - idx <= 2;
	     *      };
	     *
	     *      reject.idx(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [8, 6, 7, 5, 3]
	     */
	    R.reject.idx = curry2(function _rejectIdx(fn, list) {
	        return filterIdx(not(fn), list);
	    });


	    /**
	     * Returns a new list containing the first `n` elements of a given list, passing each value
	     * to the supplied predicate function, and terminating when the predicate function returns
	     * `false`. Excludes the element that caused the predicate function to fail. The predicate
	     * function is passed one argument: *(value)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} A new array.
	     * @example
	     *
	     *      var isNotFour = function(x) {
	     *        return !(x === 4);
	     *      };
	     *
	     *      takeWhile(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
	     */
	    R.takeWhile = curry2(checkForMethod('takeWhile', function(fn, list) {
	        var idx = -1, len = list.length;
	        while (++idx < len && fn(list[idx])) {}
	        return _slice(list, 0, idx);
	    }));


	    /**
	     * Returns a new list containing the first `n` elements of the given list.  If
	     * `n > * list.length`, returns a list of `list.length` elements.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig Number -> [a] -> [a]
	     * @param {number} n The number of elements to return.
	     * @param {Array} list The array to query.
	     * @return {Array} A new array containing the first elements of `list`.
	     */
	    R.take = curry2(checkForMethod('take', function(n, list) {
	        return _slice(list, 0, Math.min(n, list.length));
	    }));


	    /**
	     * Returns a new list containing the last `n` elements of a given list, passing each value
	     * to the supplied predicate function, beginning when the predicate function returns
	     * `true`. Excludes the element that caused the predicate function to fail. The predicate
	     * function is passed one argument: *(value)*.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [a]
	     * @param {Function} fn The function called per iteration.
	     * @param {Array} list The collection to iterate over.
	     * @return {Array} A new array.
	     * @example
	     *
	     *      var isNotTwo = function(x) {
	     *        return !(x === 2);
	     *      };
	     *
	     *      skipUntil(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
	     */
	    R.skipUntil = curry2(function _skipUntil(fn, list) {
	        var idx = -1, len = list.length;
	        while (++idx < len && !fn(list[idx])) {}
	        return _slice(list, idx);
	    });


	    /**
	     * Returns a new list containing all but the first `n` elements of the given `list`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig Number -> [a] -> [a]
	     * @param {number} n The number of elements of `list` to skip.
	     * @param {Array} list The array to consider.
	     * @return {Array} The last `n` elements of `list`.
	     * @example
	     *
	     *     skip(3, [1,2,3,4,5,6,7]); // => [4,5,6,7]
	     */
	    R.skip = curry2(checkForMethod('skip', function _skip(n, list) {
	        return _slice(list, n);
	    }));


	    /**
	     * Returns the first element of the list which matches the predicate, or `undefined` if no
	     * element matches.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> a | undefined
	     * @param {Function} fn The predicate function used to determine if the element is the
	     *        desired one.
	     * @param {Array} list The array to consider.
	     * @return {Object} The element found, or `undefined`.
	     * @example
	     *
	     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	     *      find(propEq('a', 2))(xs); //= {a: 2}
	     *      find(propEq('a', 4))(xs); //= undefined
	     */
	    R.find = curry2(function find(fn, list) {
	        var idx = -1;
	        var len = list.length;
	        while (++idx < len) {
	            if (fn(list[idx])) {
	                return list[idx];
	            }
	        }
	    });


	    /**
	     * Returns the index of the first element of the list which matches the predicate, or `-1`
	     * if no element matches.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Number
	     * @param {Function} fn The predicate function used to determine if the element is the
	     * desired one.
	     * @param {Array} list The array to consider.
	     * @return {number} The index of the element found, or `-1`.
	     * @example
	     *
	     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	     *      findIndex(propEq('a', 2))(xs); //= 1
	     *      findIndex(propEq('a', 4))(xs); //= -1
	     */
	    R.findIndex = curry2(function _findIndex(fn, list) {
	        var idx = -1;
	        var len = list.length;
	        while (++idx < len) {
	            if (fn(list[idx])) {
	                return idx;
	            }
	        }
	        return -1;
	    });


	    /**
	     * Returns the last element of the list which matches the predicate, or `undefined` if no
	     * element matches.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> a | undefined
	     * @param {Function} fn The predicate function used to determine if the element is the
	     * desired one.
	     * @param {Array} list The array to consider.
	     * @return {Object} The element found, or `undefined`.
	     * @example
	     *
	     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
	     *      findLast(propEq('a', 1))(xs); //= {a: 1, b: 1}
	     *      findLast(propEq('a', 4))(xs); //= undefined
	     */
	    R.findLast = curry2(function _findLast(fn, list) {
	        var idx = list.length;
	        while (idx--) {
	            if (fn(list[idx])) {
	                return list[idx];
	            }
	        }
	    });


	    /**
	     * Returns the index of the last element of the list which matches the predicate, or
	     * `-1` if no element matches.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Number
	     * @param {Function} fn The predicate function used to determine if the element is the
	     * desired one.
	     * @param {Array} list The array to consider.
	     * @return {number} The index of the element found, or `-1`.
	     * @example
	     *
	     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
	     *      findLastIndex(propEq('a', 1))(xs); //= 1
	     *      findLastIndex(propEq('a', 4))(xs); //= -1
	     */
	    R.findLastIndex = curry2(function _findLastIndex(fn, list) {
	        var idx = list.length;
	        while (idx--) {
	            if (fn(list[idx])) {
	                return idx;
	            }
	        }
	        return -1;
	    });


	    /**
	     * Returns `true` if all elements of the list match the predicate, `false` if there are any
	     * that don't.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Boolean
	     * @param {Function} fn The predicate function.
	     * @param {Array} list The array to consider.
	     * @return {boolean} `true` if the predicate is satisfied by every element, `false`
	     *         otherwise
	     * @example
	     *
	     *      var lessThan2 = flip(lt)(2);
	     *      var lessThan3 = flip(lt)(3);
	     *      var xs = range(1, 3); //= [1, 2]
	     *      every(lessThan2)(xs); //= false
	     *      every(lessThan3)(xs); //= true
	     */
	    function every(fn, list) {
	        var i = -1;
	        while (++i < list.length) {
	            if (!fn(list[i])) {
	                return false;
	            }
	        }
	        return true;
	    }
	    R.every = curry2(every);


	    /**
	     * Returns `true` if at least one of elements of the list match the predicate, `false`
	     * otherwise.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> Boolean
	     * @param {Function} fn The predicate function.
	     * @param {Array} list The array to consider.
	     * @return {boolean} `true` if the predicate is satisfied by at least one element, `false`
	     *         otherwise
	     * @example
	     *
	     *      var lessThan0 = flip(lt)(0);
	     *      var lessThan2 = flip(lt)(2);
	     *      var xs = range(1, 3); //= [1, 2]
	     *      some(lessThan0)(xs); //= false
	     *      some(lessThan2)(xs); //= true
	     */
	    function some(fn, list) {
	        var i = -1;
	        while (++i < list.length) {
	            if (fn(list[i])) {
	                return true;
	            }
	        }
	        return false;
	    }
	    R.some = curry2(some);


	    /**
	     * Internal implementation of `indexOf`.
	     * Returns the position of the first occurrence of an item in an array
	     * (by strict equality),
	     * or -1 if the item is not included in the array.
	     *
	     * @private
	     * @category Internal
	     * @param {Array} The array to search
	     * @param item the item to find in the Array
	     * @param {Number} from (optional) the index to start searching the Array
	     * @return {Number} the index of the found item, or -1
	     *
	     */
	    var indexOf = function _indexOf(array, item, from) {
	        var i = 0, length = array.length;
	        if (typeof from == 'number') {
	            i = from < 0 ? Math.max(0, length + from) : from;
	        }
	        for (; i < length; i++) {
	            if (array[i] === item) {
	                return i;
	            }
	        }
	        return -1;
	    };


	    /**
	     * Internal implementation of `lastIndexOf`.
	     * Returns the position of the last occurrence of an item in an array
	     * (by strict equality),
	     * or -1 if the item is not included in the array.
	     *
	     * @private
	     * @category Internal
	     * @param {Array} The array to search
	     * @param item the item to find in the Array
	     * @param {Number} from (optional) the index to start searching the Array
	     * @return {Number} the index of the found item, or -1
	     *
	     */
	    var lastIndexOf = function _lastIndexOf(array, item, from) {
	        var idx = array.length;
	        if (typeof from == 'number') {
	            idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
	        }
	        while (--idx >= 0) {
	            if (array[idx] === item) {
	                return idx;
	            }
	        }
	        return -1;
	    };


	    /**
	     * Returns the position of the first occurrence of an item in an array
	     * (by strict equality),
	     * or -1 if the item is not included in the array.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig a -> [a] -> Number
	     * @param target The item to find.
	     * @param {Array} list The array to search in.
	     * @return {Number} the index of the target, or -1 if the target is not found.
	     *
	     * @example
	     *
	     *      indexOf(3, [1,2,3,4]) // => 2
	     *      indexOf(10, [1,2,3,4]) // => -1
	     */
	    R.indexOf = curry2(function _indexOf(target, list) {
	        return indexOf(list, target);
	    });


	    /**
	     * Returns the position of the first occurrence of an item (by strict equality) in
	     * an array, or -1 if the item is not included in the array. However,
	     * `indexOf.from` will only search the tail of the array, starting from the
	     * `fromIdx` parameter.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig a -> Number -> [a] -> Number
	     * @param target The item to find.
	     * @param {Array} list The array to search in.
	     * @param {Number} fromIdx the index to start searching from
	     * @return {Number} the index of the target, or -1 if the target is not found.
	     *
	     * @example
	     *
	     *      indexOf.from(3, 2, [-1,0,1,2,3,4]) // => 4
	     *      indexOf.from(10, 2, [1,2,3,4]) // => -1
	     */
	    R.indexOf.from = curry3(function indexOfFrom(target, fromIdx, list) {
	        return indexOf(list, target, fromIdx);
	    });


	    /**
	     * Returns the position of the last occurrence of an item (by strict equality) in
	     * an array, or -1 if the item is not included in the array.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig a -> [a] -> Number
	     * @param target The item to find.
	     * @param {Array} list The array to search in.
	     * @return {Number} the index of the target, or -1 if the target is not found.
	     *
	     * @example
	     *
	     *      lastIndexOf(3, [-1,3,3,0,1,2,3,4]) // => 6
	     *      lastIndexOf(10, [1,2,3,4]) // => -1
	     */
	    R.lastIndexOf = curry2(function _lastIndexOf(target, list) {
	        return lastIndexOf(list, target);
	    });


	    /**
	     * Returns the position of the last occurrence of an item (by strict equality) in
	     * an array, or -1 if the item is not included in the array. However,
	     * `lastIndexOf.from` will only search the tail of the array, starting from the
	     * `fromIdx` parameter.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig a -> Number -> [a] -> Number
	     * @param target The item to find.
	     * @param {Array} list The array to search in.
	     * @param {Number} fromIdx the index to start searching from
	     * @return {Number} the index of the target, or -1 if the target is not found.
	     *
	     * @example
	     *
	     *      lastIndexOf.from(3, 2, [-1,3,3,0,1,2,3,4]) // => 6
	     *      lastIndexOf.from(10, 2, [1,2,3,4]) // => -1
	     */
	    R.lastIndexOf.from = curry3(function lastIndexOfFrom(target, fromIdx, list) {
	        return lastIndexOf(list, target, fromIdx);
	    });


	    /**
	     * Returns `true` if the specified item is somewhere in the list, `false` otherwise.
	     * Equivalent to `indexOf(a)(list) > -1`. Uses strict (`===`) equality checking.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig a -> [a] -> Boolean
	     * @param {Object} a The item to compare against.
	     * @param {Array} list The array to consider.
	     * @return {boolean} `true` if the item is in the list, `false` otherwise.
	     * @example
	     *
	     *      contains(3)([1, 2, 3]); //= true
	     *      contains(4)([1, 2, 3]); //= false
	     *      contains({})([{}, {}]); //= false
	     *      var obj = {};
	     *      contains(obj)([{}, obj, {}]); //= true
	     */
	    function contains(a, list) {
	        return indexOf(list, a) > -1;
	    }

	    R.contains = curry2(contains);


	    /**
	     * Returns `true` if the `x` is found in the `list`, using `pred` as an
	     * equality predicate for `x`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (x, a -> Boolean) -> x -> [a] -> Boolean
	     * @param {Function} pred :: x -> x -> Bool
	     * @param x the item to find
	     * @param {Array} list the list to iterate over
	     * @return {Boolean} `true` if `x` is in `list`, else `false`
	     * @example
	     *
	     *     var xs = [{x: 12}, {x: 11}, {x: 10}];
	     *     containsWith(function(a, b) { return a.x === b.x; }, {x: 10}, xs); // true
	     *     containsWith(function(a, b) { return a.x === b.x; }, {x: 1}, xs); // false
	     */
	    function containsWith(pred, x, list) {
	        var idx = -1, len = list.length;
	        while (++idx < len) {
	            if (pred(x, list[idx])) {
	                return true;
	            }
	        }
	        return false;
	    }

	    R.containsWith = curry3(containsWith);


	    /**
	     * Returns a new list containing only one copy of each element in the original list.
	     * Equality is strict here, meaning reference equality for objects and non-coercing equality
	     * for primitives.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig [a] -> [a]
	     * @param {Array} list The array to consider.
	     * @return {Array} The list of unique items.
	     * @example
	     *
	     *      uniq([1, 1, 2, 1]); //= [1, 2]
	     *      uniq([{}, {}]);     //= [{}, {}]
	     *      uniq([1, '1']);     //= [1, '1']
	     */
	    var uniq = R.uniq = function uniq(list) {
	        var idx = -1, len = list.length;
	        var result = [], item;
	        while (++idx < len) {
	            item = list[idx];
	            if (!contains(item, result)) {
	                result.push(item);
	            }
	        }
	        return result;
	    };


	    /**
	     * Returns `true` if all elements are unique, otherwise `false`.
	     * Uniqueness is determined using strict equality (`===`).
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig [a] -> Boolean
	     * @param {Array} list The array to consider.
	     * @return {boolean} `true` if all elements are unique, else `false`.
	     * @example
	     *
	     *      isSet(['1', 1]); //= true
	     *      isSet([1, 1]);   //= false
	     *      isSet([{}, {}]); //= true
	     */
	    R.isSet = function _isSet(list) {
	        var len = list.length;
	        var i = -1;
	        while (++i < len) {
	            if (indexOf(list, list[i], i + 1) >= 0) {
	                return false;
	            }
	        }
	        return true;
	    };


	    /**
	     * Returns a new list containing only one copy of each element in the original list, based
	     * upon the value returned by applying the supplied predicate to two list elements. Prefers
	     * the first item if two items compare equal based on the predicate.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (x, a -> Boolean) -> [a] -> [a]
	     * @param {Array} list The array to consider.
	     * @return {Array} The list of unique items.
	     * @example
	     *
	     * var strEq = function(a, b) { return ('' + a) === ('' + b) };
	     * uniqWith(strEq)([1, '1', 2, 1]); //= [1, 2]
	     * uniqWith(strEq)([{}, {}]);       //= [{}]
	     * uniqWith(strEq)([1, '1', 1]);    //= [1]
	     * uniqWith(strEq)(['1', 1, 1]);    //= ['1']
	     */
	    var uniqWith = R.uniqWith = curry2(function _uniqWith(pred, list) {
	        var idx = -1, len = list.length;
	        var result = [], item;
	        while (++idx < len) {
	            item = list[idx];
	            if (!containsWith(pred, item, result)) {
	                result.push(item);
	            }
	        }
	        return result;
	    });


	    /**
	     * Returns a new list by plucking the same named property off all objects in the list supplied.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig String -> {*} -> [*]
	     * @param {string|number} key The key name to pluck off of each object.
	     * @param {Array} list The array to consider.
	     * @return {Array} The list of values for the given key.
	     * @example
	     *
	     * pluck('a')([{a: 1}, {a: 2}]); //= [1, 2]
	     * pluck(0)([[1, 2], [3, 4]]);   //= [1, 3]
	     */
	    var pluck = R.pluck = curry2(function _pluck(p, list) {
	        return map(prop(p), list);
	    });


	    /**
	     * `makeFlat` is a helper function that returns a one-level or fully recursive function
	     * based on the flag passed in.
	     *
	     * @private
	     */
	    // TODO: document, even for internals...
	    var makeFlat = function _makeFlat(recursive) {
	        return function __flatt(list) {
	            var array, value, result = [], val, i = -1, j, ilen = list.length, jlen;
	            while (++i < ilen) {
	                array = list[i];
	                if (isArrayLike(array)) {
	                    value = (recursive) ? __flatt(array) : array;
	                    j = -1;
	                    jlen = value.length;
	                    while (++j < jlen) {
	                        result.push(value[j]);
	                    }
	                } else {
	                    result.push(array);
	                }
	            }
	            return result;
	        };
	    };


	    /**
	     * Returns a new list by pulling every item out of it (and all its sub-arrays) and putting
	     * them in a new array, depth-first.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig [a] -> [b]
	     * @param {Array} list The array to consider.
	     * @return {Array} The flattened list.
	     * @example
	     *
	     * flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
	     * //= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	     */
	    var flatten = R.flatten = makeFlat(true);


	    /**
	     * Returns a new list by pulling every item at the first level of nesting out, and putting
	     * them in a new array.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig [a] -> [b]
	     * @param {Array} list The array to consider.
	     * @return {Array} The flattened list.
	     * @example
	     *
	     * unnest([1, [2], [[3]]]); //= [1, 2, [3]]
	     * unnest([[1, 2], [3, 4], [5, 6]]); //= [1, 2, 3, 4, 5, 6]
	     */
	    var unnest = R.unnest = makeFlat(false);


	    /**
	     * Creates a new list out of the two supplied by applying the function to each
	     * equally-positioned pair in the lists.
	     *
	     * @function
	     * @memberOf R
	     * @category List
	     * @sig (a,b -> c) -> a -> b -> [c]
	     * @param {Function} fn The function used to combine the two elements into one value.
	     * @param {Array} list1 The first array to consider.
	     * @param {Array} list2 The second array to consider.
	     * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
	     * using `fn`.
	     * @example
	     *
	     * zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
	     * //= [f(1, 'a'), f(2, 'b'), f(3, 'c')]
	     */
	    R.zipWith = curry3(function _zipWith(fn, a, b) {
	        var rv = [], i = -1, len = Math.min(a.length, b.length);
	        while (++i < len) {
	            rv[i] = fn(a[i], b[i]);
	        }
	        return rv;
	    });


	    /**
	     * Creates a new list out of the two supplied by pairing up equally-positioned items from
	     * both lists. Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig a -> b -> [[a,b]]
	     * @param {Array} list1 The first array to consider.
	     * @param {Array} list2 The second array to consider.
	     * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
	     * @example
	     *
	     * zip([1, 2, 3], ['a', 'b', 'c']);
	     * //= [[1, 'a'], [2, 'b'], [3, 'c']]
	     */
	    R.zip = curry2(function _zip(a, b) {
	        var rv = [];
	        var i = -1;
	        var len = Math.min(a.length, b.length);
	        while (++i < len) {
	            rv[i] = [a[i], b[i]];
	        }
	        return rv;
	    });


	    /**
	     * Creates a new object out of a list of keys and a list of values.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig k -> v -> {k: v}
	     * @param {Array} keys The array that will be properties on the output object.
	     * @param {Array} values The list of values on the output object.
	     * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
	     * @example
	     *
	     *      zipObj(['a', 'b', 'c'], [1, 2, 3]);
	     *      //= {a: 1, b: 2, c: 3}
	     */
	    R.zipObj = curry2(function _zipObj(keys, values) {
	        var i = -1, len = keys.length, out = {};
	        while (++i < len) {
	            out[keys[i]] = values[i];
	        }
	        return out;
	    });


	    /**
	     * Creates a new object out of a list key-value pairs.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig [[k,v]] -> {k: v}
	     * @param {Array} An array of two-element arrays that will be the keys and values of the ouput object.
	     * @return {Object} The object made by pairing up `keys` and `values`.
	     * @example
	     *
	     *      fromPairs([['a', 1], ['b', 2],  ['c', 3]]);
	     *      //= {a: 1, b: 2, c: 3}
	     */
	    R.fromPairs = function _fromPairs(pairs) {
	        var i = -1, len = pairs.length, out = {};
	        while (++i < len) {
	            if (isArray(pairs[i]) && pairs[i].length) {
	                out[pairs[i][0]] = pairs[i][1];
	            }
	        }
	        return out;
	    };


	    /**
	     * Creates a new list out of the two supplied by applying the function
	     * to each possible pair in the lists.
	     *
	     * @see R.xprod
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a,b -> c) -> a -> b -> [c]
	     * @param {Function} fn The function to join pairs with.
	     * @param {Array} as The first list.
	     * @param {Array} bs The second list.
	     * @return {Array} The list made by combining each possible pair from
	     *         `as` and `bs` using `fn`.
	     * @example
	     *
	     *      xprodWith(f, [1, 2], ['a', 'b'])
	     *      //= [f(1, 'a'), f(1, 'b'), f(2, 'a'), f(2, 'b')];
	     */
	    R.xprodWith = curry3(function _xprodWith(fn, a, b) {
	        if (isEmpty(a) || isEmpty(b)) {
	            return [];
	        }
	        // Better to push them all or to do `new Array(ilen * jlen)` and
	        // calculate indices?
	        var i = -1, ilen = a.length, j, jlen = b.length, result = [];
	        while (++i < ilen) {
	            j = -1;
	            while (++j < jlen) {
	                result.push(fn(a[i], b[j]));
	            }
	        }
	        return result;
	    });


	    /**
	     * Creates a new list out of the two supplied by creating each possible
	     * pair from the lists.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig a -> b -> [[a,b]]
	     * @param {Array} as The first list.
	     * @param {Array} bs The second list.
	     * @return {Array} The list made by combining each possible pair from
	     * `as` and `bs` into pairs (`[a, b]`).
	     * @example
	     *
	     *      xprod([1, 2], ['a', 'b']);
	     *      //= [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
	     */
	    R.xprod = curry2(function _xprod(a, b) { // = xprodWith(prepend); (takes about 3 times as long...)
	        if (isEmpty(a) || isEmpty(b)) {
	            return [];
	        }
	        var i = -1;
	        var ilen = a.length;
	        var j;
	        var jlen = b.length;
	        // Better to push them all or to do `new Array(ilen * jlen)` and calculate indices?
	        var result = [];
	        while (++i < ilen) {
	            j = -1;
	            while (++j < jlen) {
	                result.push([a[i], b[j]]);
	            }
	        }
	        return result;
	    });


	    /**
	     * Returns a new list with the same elements as the original list, just
	     * in the reverse order.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig [a] -> [a]
	     * @param {Array} list The list to reverse.
	     * @return {Array} A copy of the list in reverse order.
	     * @example
	     *
	     *      reverse([1, 2, 3]);  //= [3, 2, 1]
	     *      reverse([1, 2]);     //= [2, 1]
	     *      reverse([1]);        //= [1]
	     *      reverse([]);         //= []
	     */
	    R.reverse = function _reverse(list) {
	        return clone(list || []).reverse();
	    };


	    /**
	     * Returns a list of numbers from `from` (inclusive) to `to`
	     * (exclusive). In mathematical terms, `range(a, b)` is equivalent to
	     * the half-open interval `[a, b)`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig Number -> Number -> [Number]
	     * @param {number} from The first number in the list.
	     * @param {number} to One more than the last number in the list.
	     * @return {Array} The list of numbers in tthe set `[a, b)`.
	     * @example
	     *
	     *      range(1, 5);     //= [1, 2, 3, 4]
	     *      range(50, 53);   //= [50, 51, 52]
	     */
	    R.range = curry2(function _range(from, to) {
	        if (from >= to) {
	            return [];
	        }
	        var idx = 0, result = new Array(Math.floor(to) - Math.ceil(from));
	        for (; from < to; idx++, from++) {
	            result[idx] = from;
	        }
	        return result;
	    });


	    /**
	     * Returns a string made by inserting the `separator` between each
	     * element and concatenating all the elements into a single string.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig String -> [a] -> String
	     * @param {string|number} separator The string used to separate the elements.
	     * @param {Array} xs The elements to join into a string.
	     * @return {string} The string made by concatenating `xs` with `separator`.
	     * @example
	     *
	     *      var spacer = join(' ');
	     *      spacer(['a', 2, 3.4]);   //= 'a 2 3.4'
	     *      join('|', [1, 2, 3]);    //= '1|2|3'
	     */
	    R.join = invoker('join', Array.prototype);


	    /**
	     * Returns the elements from `xs` starting at `a` and ending at `b - 1`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig Number -> Number -> [a] -> [a]
	     * @param {number} a The starting index.
	     * @param {number} b One more than the ending index.
	     * @param {Array} xs The list to take elements from.
	     * @return {Array} The items from `a` to `b - 1` from `xs`.
	     * @example
	     *
	     *      var xs = range(0, 10);
	     *      slice(2, 5)(xs); //= [2, 3, 4]
	     */
	    R.slice = invoker('slice', Array.prototype);


	    /**
	     * Returns the elements from `xs` starting at `a` going to the end of `xs`.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig Number -> [a] -> [a]
	     * @param {number} a The starting index.
	     * @param {Array} xs The list to take elements from.
	     * @return {Array} The items from `a` to the end of `xs`.
	     * @example
	     *
	     *      var xs = range(0, 10);
	     *      slice.from(2)(xs); //= [2, 3, 4, 5, 6, 7, 8, 9]
	     *
	     *      var ys = range(4, 8);
	     *      var tail = slice.from(1);
	     *      tail(xs); //= [5, 6, 7]
	     */
	    R.slice.from = flip(R.slice)(void 0);


	    /**
	     * Removes the sub-list of `list` starting at index `start` and containing
	     * `count` elements.  _Note that this is not destructive_: it returns a
	     * copy of the list with the changes.
	     * <small>No lists have been harmed in the application of this function.</small>
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig Number -> Number -> [a] -> [a]
	     * @param {Number} start The position to start removing elements
	     * @param {Number} count The number of elements to remove
	     * @param {Array} list The list to remove from
	     * @return {Array} a new Array with `count` elements from `start` removed
	     * @example
	     *
	     *      remove(2, 3, [1,2,3,4,5,6,7,8]) // => [1,2,6,7,8]
	     */
	    R.remove = curry3(function _remove(start, count, list) {
	        return concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
	    });


	    /**
	     * Inserts the supplied element into the list, at index `index`.  _Note
	     * that this is not destructive_: it returns a copy of the list with the changes.
	     * <small>No lists have been harmed in the application of this function.</small>
	     *
	     * @func
	     * @memberOf R
	     * @category
	     * @sig Number -> a -> [a] -> [a]
	     * @param {Number} index The position to insert the element
	     * @param elt The element to insert into the Array
	     * @param {Array} list The list to insert into
	     * @return {Array} a new Array with `elt` inserted at `index`
	     * @example
	     *
	     *      insert(2, 'x', [1,2,3,4]) // => [1,2,'x',3,4]
	     */
	    R.insert = curry3(function _insert(index, elt, list) {
	        index = index < list.length && index >= 0 ? index : list.length;
	        return concat(append(elt, _slice(list, 0, index)), _slice(list, index));
	    });


	    /**
	     * Inserts the sub-list into the list, at index `index`.  _Note  that this
	     * is not destructive_: it returns a copy of the list with the changes.
	     * <small>No lists have been harmed in the application of this function.</small>
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig Number -> [a] -> [a] -> [a]
	     * @param {Number} index The position to insert the sublist
	     * @param {Array} elts The sub-list to insert into the Array
	     * @param {Array} list The list to insert the sub-list into
	     * @return {Array} a new Array with `elts` inserted starting at `index`
	     * @example
	     *
	     *      insert.all(2, ['x','y','z'], [1,2,3,4]) // => [1,2,'x','y','z',3,4]
	     */
	    R.insert.all = curry3(function _insertAll(index, elts, list) {
	        index = index < list.length && index >= 0 ? index : list.length;
	        return concat(concat(_slice(list, 0, index), elts), _slice(list, index));
	    });


	    /**
	     * Makes a comparator function out of a function that reports whether the first element is less than the second.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig (a, b -> Boolean) -> (a, b -> Number)
	     * @param {Function} pred A predicate function of arity two.
	     * @return {Function} a Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`
	     * @example
	     *
	     *      var cmp = comparator(function(a, b) {
	     *        return a.age < b.age;
	     *      };
	     *      sort(cmp, people);
	     */
	    var comparator = R.comparator = function _comparator(pred) {
	        return function(a, b) {
	            return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
	        };
	    };


	    /**
	     * Returns a copy of the list, sorted according to the comparator function, which should accept two values at a
	     * time and return a negative number if the first value is smaller, a positive number if it's larger, and zero
	     * if they are equal.  Please note that this is a **copy** of the list.  It does not modify the original.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a,a -> Number) -> [a] -> [a]
	     * @param {Function} comparator A sorting function :: a -> b -> Int
	     * @param {Array} list The list to sort
	     * @return {Array} a new array with its elements sorted by the comparator function.
	     * @example
	     *
	     *      sort(function(a, b) { return a - b; }, [4,2,7,5]); // => [2, 4, 5, 7];
	     */
	    var sort = R.sort = curry2(function sort(comparator, list) {
	        return clone(list).sort(comparator);
	    });


	    /**
	     * Splits a list into sublists stored in an object, based on the result of calling a String-returning function
	     * on each element, and grouping the results according to values returned.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> s) -> [a] -> {s: a}
	     * @param {Function} fn Function :: a -> String
	     * @param {Array} list The array to group
	     * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
	     *         that produced that key when passed to `fn`.
	     * @example
	     *     var byGrade = groupBy(function(student) {
	     *       var score = student.score
	     *       return (score < 65) ? 'F' : (score < 70) ? 'D' :
	     *              (score < 80) ? 'C' : (score < 90) ? 'B' : 'A';
	     *     };
	     *     var students = [{name: 'Abby', score: 84},
	     *                     {name: 'Eddy', score: 58},
	     *                     // ...
	     *                     {name: 'Jack', score: 69}];
	     *     byGrade(students);
	     *     //=> {
	     *     //   'A': [{name: 'Dianne', score: 99}],
	     *     //   'B': [{name: 'Abby', score: 84}]
	     *     //   // ...,
	     *     //   'F': [{name: 'Eddy', score: 58}]
	     *     // }
	     */
	    R.groupBy = curry2(function _groupBy(fn, list) {
	        return foldl(function(acc, elt) {
	            var key = fn(elt);
	            acc[key] = append(elt, acc[key] || (acc[key] = []));
	            return acc;
	        }, {}, list);
	    });


	    /**
	     * Takes a predicate and a list and returns the pair of lists of
	     * elements which do and do not satisfy the predicate, respectively.
	     *
	     * @func
	     * @memberOf R
	     * @category List
	     * @sig (a -> Boolean) -> [a] -> [[a],[a]]
	     * @param {Function} pred Function :: a -> Boolean
	     * @param {Array} list The array to partition
	     * @return {Array} A nested array, containing first an array of elements that satisfied the predicate,
	     *                 and second an array of elements that did not satisfy.
	     * @example
	     *
	     *      partition(contains('s'), ['sss', 'ttt', 'foo', 'bars'])
	     *     // => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
	     */
	    R.partition = curry2(function _partition(pred, list) {
	        return foldl(function(acc, elt) {
	            acc[pred(elt) ? 0 : 1].push(elt);
	            return acc;
	        }, [[], []], list);
	    });




	    // Object Functions
	    // ----------------
	    //
	    // These functions operate on plain Javascript object, adding simple functions to test properties on these
	    // objects.  Many of these are of most use in conjunction with the list functions, operating on lists of
	    // objects.

	    // --------

	    /**
	     * Runs the given function with the supplied object, then returns the object.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig a -> (a -> *) -> a
	     * @param {*} x
	     * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
	     * @return {*} x
	     * @example
	     *
	     *      tap(100, function(x) { console.log('x is ' + x); }); // => 100 (and logs: 'x is 100')
	     */
	    R.tap = curry2(function _tap(x, fn) {
	        if (typeof fn === 'function') { fn(x); }
	        return x;
	    });


	    /**
	     * Tests if two items are equal.  Equality is strict here, meaning reference equality for objects and
	     * non-coercing equality for primitives.
	     *
	     * @func
	     * @memberOf R
	     * @category Relation
	     * @sig a -> b -> Boolean
	     * @param {*} a
	     * @param {*} b
	     * @return {Boolean}
	     * @example
	     *
	     *      var o = {};
	     *      eq(o, o) // => true
	     *      eq(o, {}) // => false
	     *      eq(1, 1) // => true
	     *      eq(1, '1') // => false
	     */
	    R.eq = curry2(function _eq(a, b) { return a === b; });


	    /**
	     * Returns a function that when supplied an object returns the indicated property of that object, if it exists.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig s -> {s: a} -> a
	     * @param {String} p The property name
	     * @param {Object} obj The object to query
	     * @return {*} The value at obj.p
	     * @example
	     *
	     *      prop('x', {x: 100}) // => 100
	     *      prop('x', {}) // => undefined
	     *
	     *      var fifth = prop(4); // indexed from 0, remember
	     *      fifth(['Bashful', 'Doc', 'Dopey', 'Grumpy', 'Happy', 'Sleepy', 'Sneezy']);
	     *      //=> 'Happy'
	     */
	    var prop = R.prop = function prop(p, obj) {
	        switch (arguments.length) {
	            case 0: throw NO_ARGS_EXCEPTION;
	            case 1: return function _prop(obj) { return obj[p]; };
	        }
	        return obj[p];
	    };

	    /**
	     * @func
	     * @memberOf R
	     * @category Object
	     * @see R.prop
	     */
	    R.get = R.prop;


	    /**
	     * Returns the value at the specified property.
	     * The only difference from `prop` is the parameter order.
	     *
	     * @func
	     * @memberOf R
	     * @see R.prop
	     * @category Object
	     * @sig {s: a} -> s -> a
	     * @param {Object} obj The object to query
	     * @param {String} prop The property name
	     * @return {*} The value at obj.p
	     * @example
	     *
	     *      prop({x: 100}, 'x'); // => 100
	     */
	    R.props = flip(R.prop);


	    /**
	     * An internal reference to `Object.prototype.hasOwnProperty`
	     * @private
	     */
	    var hasOwnProperty = Object.prototype.hasOwnProperty;


	    /**
	     * If the given object has an own property with the specified name,
	     * returns the value of that property.
	     * Otherwise returns the provided default value.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig s -> v -> {s: x} -> x | v
	     * @param {String} p The name of the property to return.
	     * @param {*} val The default value.
	     * @returns {*} The value of given property or default value.
	     * @example
	     *
	     *      var alice = {
	     *        name: 'ALICE',
	     *        age: 101
	     *      };
	     *      var favorite = prop('favoriteLibrary');
	     *      var favoriteWithDefault = propOrDefault('favoriteLibrary', 'Ramda');
	     *
	     *      favorite(alice);  //=> undefined
	     *      favoriteWithDefault(alice);  //=> 'Ramda'
	     */
	    R.propOrDefault = curry3(function _propOrDefault(p, val, obj) {
	        return hasOwnProperty.call(obj, p) ? obj[p] : val;
	    });


	    /**
	     * Calls the specified function on the supplied object. Any additional arguments
	     * after `fn` and `obj` are passed in to `fn`. If no additional arguments are passed to `func`,
	     * `fn` is invoked with no arguments.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig k -> {k : v} -> v(*)
	     * @param {String} fn The name of the property mapped to the function to invoke
	     * @param {Object} obj The object
	     * @return {*} The value of invoking `obj.fn`
	     * @example
	     *
	     *      func('add', R, 1, 2) // => 3
	     *
	     *      var obj = { f: function() { return 'f called'; } };
	     *      func('f', obj); // => 'f called'
	     */
	    R.func = function func(funcName, obj) {
	        switch (arguments.length) {
	            case 0: throw NO_ARGS_EXCEPTION;
	            case 1: return function(obj) { return obj[funcName].apply(obj, _slice(arguments, 1)); };
	            default: return obj[funcName].apply(obj, _slice(arguments, 2));
	        }
	    };


	    /**
	     * Returns a function that always returns the given value.
	     *
	     * @func
	     * @memberOf R
	     * @category Function
	     * @sig a -> (* -> a)
	     * @param {*} val The value to wrap in a function
	     * @return {Function} A Function :: * -> val
	     * @example
	     *
	     *      var t = always('Tee');
	     *      t(); // => 'Tee'
	     */
	    var always = R.always = function _always(val) {
	        return function() {
	            return val;
	        };
	    };


	    /**
	     * Internal reference to Object.keys
	     *
	     * @private
	     * @param {Object}
	     * @return {Array}
	     */
	    var nativeKeys = Object.keys;


	    /**
	     * Returns a list containing the names of all the enumerable own
	     * properties of the supplied object.
	     * Note that the order of the output array is not guaranteed to be
	     * consistent across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> [k]
	     * @param {Object} obj The object to extract properties from
	     * @return {Array} An array of the object's own properties
	     * @example
	     *
	     *      keys({a: 1, b: 2, c: 3}) // => ['a', 'b', 'c']
	     */
	    var keys = R.keys = function _keys(obj) {
	        if (nativeKeys) {
	            return nativeKeys(Object(obj));
	        }
	        var prop, ks = [];
	        for (prop in obj) {
	            if (hasOwnProperty.call(obj, prop)) {
	                ks.push(prop);
	            }
	        }
	        return ks;
	    };


	    /**
	     * Returns a list containing the names of all the
	     * properties of the supplied object, including prototype properties.
	     * Note that the order of the output array is not guaranteed to be
	     * consistent across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> [k]
	     * @param {Object} obj The object to extract properties from
	     * @return {Array} An array of the object's own and prototype properties
	     * @example
	     *
	     *      var F = function() { this.x = 'X'; };
	     *      F.prototype.y = 'Y';
	     *      var f = new F();
	     *      keys(f) // => ['x', 'y']
	     */
	    R.keysIn = function _keysIn(obj) {
	        var prop, ks = [];
	        for (prop in obj) {
	            ks.push(prop);
	        }
	        return ks;
	    };


	    /**
	     * @private
	     * @param {Function} fn The strategy for extracting keys from an object
	     * @return {Function} A function that takes an object and returns an array of
	     *                    key-value arrays.
	     */
	    var pairWith = function(fn) {
	        return function(obj) {
	            return R.map(function(key) { return [key, obj[key]]; }, fn(obj));
	        };
	    };


	    /**
	     * Converts an object into an array of key, value arrays.
	     * Only the object's own properties are used.
	     * Note that the order of the output array is not guaranteed to be
	     * consistent across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> [[k,v]]
	     * @param {Object} obj The object to extract from
	     * @return {Array} An array of key, value arrays from the object's own properties
	     * @example
	     *
	     *      toPairs({a: 1, b: 2, c: 3}); // [['a', 1], ['b', 2], ['c', 3]]
	     */
	    R.toPairs = pairWith(R.keys);


	    /**
	     * Converts an object into an array of key, value arrays.
	     * The object's own properties and prototype properties are used.
	     * Note that the order of the output array is not guaranteed to be
	     * consistent across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> [[k,v]]
	     * @param {Object} obj The object to extract from
	     * @return {Array} An array of key, value arrays from the object's own
	     *         and prototype properties
	     * @example
	     *
	     *      var F = function() { this.x = 'X'; };
	     *      F.prototype.y = 'Y';
	     *      var f = new F();
	     *      toPairsIn(f) // => [['x','X'], ['y','Y']]
	     */
	    R.toPairsIn = pairWith(R.keysIn);


	    /**
	     * Returns a list of all the enumerable own properties of the supplied object.
	     * Note that the order of the output array is not guaranteed across
	     * different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> [v]
	     * @param {Object} obj The object to extract values from
	     * @return {Array} An array of the values of the object's own properties
	     * @example
	     *
	     *      values({a: 1, b: 2, c: 3}) // => [1, 2, 3]
	     */
	    R.values = function _values(obj) {
	        var prop, props = keys(obj),
	            length = props.length,
	            vals = new Array(length);
	        for (var i = 0; i < length; i++) {
	            vals[i] = obj[props[i]];
	        }
	        return vals;
	    };


	    /**
	     * Returns a list of all the properties, including prototype properties,
	     * of the supplied object.
	     * Note that the order of the output array is not guaranteed to be
	     * consistent across different JS platforms.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> [v]
	     * @param {Object} obj The object to extract values from
	     * @return {Array} An array of the values of the object's own and prototype properties
	     * @example
	     *
	     *      var F = function() { this.x = 'X'; };
	     *      F.prototype.y = 'Y';
	     *      var f = new F();
	     *      valuesIn(f) // => ['X', 'Y']
	     */
	    R.valuesIn = function _valuesIn(obj) {
	        var prop, vs = [];
	        for (prop in obj) {
	            vs.push(obj[prop]);
	        }
	        return vs;
	    };


	    /**
	     * Internal helper function for making a partial copy of an object
	     *
	     * @private
	     *
	     */
	    // TODO: document, even for internals...
	    function pickWith(test, obj) {
	        var copy = {},
	            props = keys(obj), prop, val;
	        for (var i = 0, len = props.length; i < len; i++) {
	            prop = props[i];
	            val = obj[prop];
	            if (test(val, prop, obj)) {
	                copy[prop] = val;
	            }
	        }
	        return copy;
	    }


	    /**
	     * Returns a partial copy of an object containing only the keys specified.  If the key does not exist, the
	     * property is ignored.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig [k] -> {k: v} -> {k: v}
	     * @param {Array} names an array of String propery names to copy onto a new object
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with only properties from `names` on it.
	     * @example
	     *
	     *      pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}) // => {a: 1, d: 4}
	     *      pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}) // => {a: 1}
	     */
	    R.pick = curry2(function pick(names, obj) {
	        return pickWith(function(val, key) {
	            return contains(key, names);
	        }, obj);
	    });


	    /**
	     * Returns a partial copy of an object omitting the keys specified.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig [k] -> {k: v} -> {k: v}
	     * @param {Array} names an array of String propery names to omit from the new object
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with properties from `names` not on it.
	     * @example
	     *
	     *      omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}) // => {b: 2, c: 3}
	     */
	    R.omit = curry2(function omit(names, obj) {
	        return pickWith(function(val, key) {
	            return !contains(key, names);
	        }, obj);
	    });


	    /**
	     * Returns a partial copy of an object containing only the keys that
	     * satisfy the supplied predicate.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig (v, k -> Boolean) -> {k: v} -> {k: v}
	     * @param {Function} pred A predicate to determine whether or not a key
	     *        should be included on the output object.
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with only properties that satisfy `pred`
	     *         on it.
	     * @see R.pick
	     * @example
	     *
	     *      function isUpperCase(x) { return x.toUpperCase() === x; }
	     *      pickWith(isUpperCase, {a: 1, b: 2, A: 3, B: 4}) // => {A: 3, B: 4}
	     */
	    R.pickWith = curry2(pickWith);


	    /**
	     * Internal implementation of `pickAll`
	     *
	     * @private
	     * @see R.pickAll
	     */
	    // TODO: document, even for internals...
	    var pickAll = function _pickAll(names, obj) {
	        var copy = {};
	        forEach(function(name) {
	            copy[name] = obj[name];
	        }, names);
	        return copy;
	    };


	    /**
	     * Similar to `pick` except that this one includes a `key: undefined` pair for properties that don't exist.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig [k] -> {k: v} -> {k: v}
	     * @param {Array} names an array of String propery names to copy onto a new object
	     * @param {Object} obj The object to copy from
	     * @return {Object} A new object with only properties from `names` on it.
	     * @see R.pick
	     * @example
	     *
	     *      pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}) // => {a: 1, d: 4}
	     *      pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}) // => {a: 1, e: undefined, f: undefined}
	     */
	    R.pickAll = curry2(pickAll);


	    /**
	     * Assigns own enumerable properties of the other object to the destination
	     * object prefering items in other.
	     *
	     * @private
	     * @memberOf R
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {Object} other The other object to merge with destination.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     *      extend({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
	     *      // => { 'name': 'fred', 'age': 40 }
	     */
	    function extend(destination, other) {
	        var props = keys(other),
	            i = -1, length = props.length;
	        while (++i < length) {
	            destination[props[i]] = other[props[i]];
	        }
	        return destination;
	    }


	    /**
	     * Create a new object with the own properties of a
	     * merged with the own properties of object b.
	     * This function will *not* mutate passed-in objects.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> {k: v} -> {k: v}
	     * @param {Object} a source object
	     * @param {Object} b object with higher precendence in output
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     *      mixin({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
	     *      // => { 'name': 'fred', 'age': 40 }
	     */
	    R.mixin = curry2(function _mixin(a, b) {
	        return extend(extend({}, a), b);
	    });


	    /**
	     * Reports whether two functions have the same value for the specified property.  Useful as a curried predicate.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig k -> {k: v} -> {k: v} -> Boolean
	     * @param {String} prop The name of the property to compare
	     * @param {Object} obj1
	     * @param {Object} obj2
	     * @return {Boolean}
	     *
	     * @example
	     *
	     *      o1 = {a: 1, b: 2, c: 3, d: 4};
	     *      o2 = { a: 10, b: 20, c: 3, d: 40};
	     *      eqProps('a', o1, o2) // => false
	     *      eqProps('c', o1, o2) // => true
	     */
	    R.eqProps = curry3(function eqProps(prop, obj1, obj2) {
	        return obj1[prop] === obj2[prop];
	    });


	    /**
	     * internal helper for `where`
	     *
	     * @private
	     * @see R.where
	     */
	    function satisfiesSpec(spec, parsedSpec, testObj) {
	        if (spec === testObj) { return true; }
	        if (testObj == null) { return false; }
	        parsedSpec.fn = parsedSpec.fn || [];
	        parsedSpec.obj = parsedSpec.obj || [];
	        var key, val, i = -1, fnLen = parsedSpec.fn.length, j = -1, objLen = parsedSpec.obj.length;
	        while (++i < fnLen) {
	            key = parsedSpec.fn[i];
	            val = spec[key];
	            //     if (!hasOwnProperty.call(testObj, key)) {
	            //       return false;
	            //     }
	            if (!(key in testObj)) {
	                return false;
	            }
	            if (!val(testObj[key], testObj)) {
	                return false;
	            }
	        }
	        while (++j < objLen) {
	            key = parsedSpec.obj[j];
	            if (spec[key] !== testObj[key]) {
	                return false;
	            }
	        }
	        return true;
	    }


	    /**
	     * Takes a spec object and a test object and returns true if the test satisfies the spec.
	     * Any property on the spec that is not a function is interpreted as an equality
	     * relation.
	     *
	     * If the spec has a property mapped to a function, then `where` evaluates the function, passing in
	     * the test object's value for the property in question, as well as the whole test object.
	     *
	     * `where` is well suited to declarativley expressing constraints for other functions, e.g.,
	     * `filter`, `find`, `pickWith`, etc.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {k: v} -> {k: v} -> Boolean
	     * @param {Object} spec
	     * @param {Object} testObj
	     * @return {Boolean}
	     * @example
	     *
	     *      var spec = {x: 2};
	     *      where(spec, {w: 10, x: 2, y: 300}); // => true
	     *      where(spec, {x: 1, y: 'moo', z: true}); // => false
	     *
	     *      var spec2 = {x: function(val, obj) { return  val + obj.y > 10; };
	     *      where(spec2, {x: 2, y: 7}); // => false
	     *      where(spec2, {x: 3, y: 8}); // => true
	     *
	     *      var xs = [{x: 2, y: 1}, {x: 10, y: 2}, {x: 8, y: 3}, {x: 10, y: 4}];
	     *      filter(where({x: 10}), xs); // ==> [{x: 10, y: 2}, {x: 10, y: 4}]
	     */
	    R.where = function where(spec, testObj) {
	        var parsedSpec = R.groupBy(function(key) {
	            return typeof spec[key] === 'function' ? 'fn' : 'obj';
	        }, keys(spec));

	        switch (arguments.length) {
	            case 0: throw NO_ARGS_EXCEPTION;
	            case 1:
	                return function(testObj) {
	                    return satisfiesSpec(spec, parsedSpec, testObj);
	                };
	        }
	        return satisfiesSpec(spec, parsedSpec, testObj);
	    };



	    // Miscellaneous Functions
	    // -----------------------
	    //
	    // A few functions in need of a good home.

	    // --------

	    /**
	     * Expose the functions from ramda as properties of another object.
	     * If the provided object is the global object then the ramda
	     * functions become global functions.
	     * Warning: This function *will* mutate the object provided.
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig -> {*} -> {*}
	     * @param {Object} obj The object to attach ramda functions
	     * @return {Object} a reference to the mutated object
	     * @example
	     *
	     *      var x = {}
	     *      R.installTo(x) // => x now contains ramda functions
	     *      R.installTo(this) // => add ramda functions to `this` object
	     */
	    R.installTo = function(obj) {
	        return extend(obj, R);
	    };


	    /**
	     * See if an object (`val`) is an instance of the supplied constructor.
	     * This function will check up the inheritance chain, if any.
	     *
	     * @func
	     * @memberOf R
	     * @category type
	     * @sig (* -> {*}) -> a -> Boolean
	     * @param {Object} ctor A constructor
	     * @param {*} val The value to test
	     * @return {Boolean}
	     * @example
	     *
	     *      is(Object, {}) // => true
	     *      is(Number, 1) // => true
	     *      is(Object, 1) // => false
	     *      is(String, 's') // => true
	     *      is(String, new String('')) // => true
	     *      is(Object, new String('')) // => true
	     *      is(Object, 's') // => false
	     *      is(Number, {}) // => false
	     */
	    R.is = curry2(function is(ctor, val) {
	        return val != null && val.constructor === ctor || val instanceof ctor;
	    });


	    /**
	     * A function that always returns `0`. Any passed in parameters are ignored.
	     *
	     * @func
	     * @memberOf R
	     * @category function
	     * @sig * -> 0
	     * @see R.always
	     * @return {Number} 0. Always zero.
	     * @example
	     *
	     *      alwaysZero() // => 0
	     */
	    R.alwaysZero = always(0);


	    /**
	     * A function that always returns `false`. Any passed in parameters are ignored.
	     *
	     * @func
	     * @memberOf R
	     * @category function
	     * @sig * -> false
	     * @see R.always
	     * @return {Boolean} false
	     * @example
	     *
	     *      alwaysFalse() // => false
	     */
	    R.alwaysFalse = always(false);


	    /**
	     * A function that always returns `true`. Any passed in parameters are ignored.
	     *
	     * @func
	     * @memberOf R
	     * @category function
	     * @sig * -> true
	     * @see R.always
	     * @return {Boolean} true
	     * @example
	     *
	     *      alwaysTrue() // => true
	     */
	    R.alwaysTrue = always(true);



	    // Logic Functions
	    // ---------------
	    //
	    // These functions are very simple wrappers around the built-in logical operators, useful in building up
	    // more complex functional forms.

	    // --------

	    /**
	     *
	     * A function wrapping calls to the two functions in an `&&` operation, returning `true` or `false`.  Note that
	     * this is short-circuited, meaning that the second function will not be invoked if the first returns a false-y
	     * value.
	     *
	     * @func
	     * @memberOf R
	     * @category logic
	     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	     * @param {Function} f a predicate
	     * @param {Function} g another predicate
	     * @return {Function} a function that applies its arguments to `f` and `g` and ANDs their outputs together.
	     * @example
	     *
	     *      gt10 = function(x) { return x > 10; };
	     *      even = function(x) { return x % 2 === 0 };
	     *      f = and(gt10, even);
	     *      f(100) // => true
	     *      f(101) // => false
	     */
	    R.and = curry2(function and(f, g) {
	        return function _and() {
	            return !!(f.apply(this, arguments) && g.apply(this, arguments));
	        };
	    });


	    /**
	     * A function wrapping calls to the two functions in an `||` operation, returning `true` or `false`.  Note that
	     * this is short-circuited, meaning that the second function will not be invoked if the first returns a truth-y
	     * value.
	     *
	     * @func
	     * @memberOf R
	     * @category logic
	     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	     * @param {Function} f a predicate
	     * @param {Function} g another predicate
	     * @return {Function} a function that applies its arguments to `f` and `g` and ORs their outputs together.
	     * @example
	     *
	     *      gt10 = function(x) { return x > 10; };
	     *      even = function(x) { return x % 2 === 0 };
	     *      f = or(gt10, even);
	     *      f(101) // => false
	     *      f(8) // => true
	     */
	    R.or = curry2(function or(f, g) {
	        return function _or() {
	            return !!(f.apply(this, arguments) || g.apply(this, arguments));
	        };
	    });


	    /**
	     * A function wrapping a call to the given function in a `!` operation.  It will return `true` when the
	     * underlying function would return a false-y value, and `false` when it would return a truth-y one.
	     *
	     * @func
	     * @memberOf R
	     * @category logic
	     * @sig (*... -> Boolean) -> (*... -> Boolean)
	     * @param {Function} f a predicate
	     * @return {Function} a function that applies its arguments to `f` and logically inverts its output.
	     * @example
	     *
	     *      gt10 = function(x) { return x > 10; };
	     *      f = not(gt10);
	     *      f(11) // => false
	     *      f(9) // => true
	     */
	    var not = R.not = function _not(f) {
	        return function() {return !f.apply(this, arguments);};
	    };


	    /**
	     * Create a predicate wrapper which will call a pick function (all/any) for each predicate
	     *
	     * @private
	     * @see R.every
	     * @see R.some
	     */
	    // TODO: document, even for internals...
	    var predicateWrap = function _predicateWrap(predPicker) {
	        return function(preds /* , args */) {
	            var predIterator = function() {
	                var args = arguments;
	                return predPicker(function(predicate) {
	                    return predicate.apply(null, args);
	                }, preds);
	            };
	            return arguments.length > 1 ?
	                    // Call function imediately if given arguments
	                    predIterator.apply(null, _slice(arguments, 1)) :
	                    // Return a function which will call the predicates with the provided arguments
	                    arity(max(pluck('length', preds)), predIterator);
	        };
	    };


	    /**
	     * Given a list of predicates, returns a new predicate that will be true exactly when all of them are.
	     *
	     * @func
	     * @memberOf R
	     * @category logic
	     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
	     * @param {Array} list An array of predicate functions
	     * @param {*} optional Any arguments to pass into the predicates
	     * @return {Function} a function that applies its arguments to each of
	     *         the predicates, returning `true` if all are satisfied.
	     * @example
	     *
	     *      gt10 = function(x) { return x > 10; };
	     *      even = function(x) { return x % 2 === 0};
	     *      f = allPredicates([gt10, even]);
	     *      f(11) // => false
	     *      f(12) // => true
	     */
	    R.allPredicates = predicateWrap(every);


	    /**
	     * Given a list of predicates returns a new predicate that will be true exactly when any one of them is.
	     *
	     * @func
	     * @memberOf R
	     * @category logic
	     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
	     * @param {Array} list An array of predicate functions
	     * @param {*} optional Any arguments to pass into the predicates
	     * @return {Function}  a function that applies its arguments to each of the predicates, returning
	     *                   `true` if all are satisfied..
	     * @example
	     *
	     *      gt10 = function(x) { return x > 10; };
	     *      even = function(x) { return x % 2 === 0};
	     *      f = allPredicates([gt10, even]);
	     *      f(11) // => true
	     *      f(8) // => true
	     *      f(9) // => false
	     */
	    R.anyPredicates = predicateWrap(some);




	    // Arithmetic Functions
	    // --------------------
	    //
	    // These functions wrap up the certain core arithmetic operators

	    // --------

	    /**
	     * Adds two numbers (or strings). Equivalent to `a + b` but curried.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @sig String -> String -> String
	     * @param {number|string} a The first value.
	     * @param {number|string} b The second value.
	     * @return {number|string} The result of `a + b`.
	     * @example
	     *
	     *      var increment = add(1);
	     *      increment(10);   //= 11
	     *      add(2, 3);       //=  5
	     *      add(7)(10);      //= 17
	     */
	    var add = R.add = curry2(function _add(a, b) { return a + b; });


	    /**
	     * Multiplies two numbers. Equivalent to `a * b` but curried.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} a The first value.
	     * @param {number} b The second value.
	     * @return {number} The result of `a * b`.
	     * @example
	     *
	     *      var double = multiply(2);
	     *      var triple = multiply(3);
	     *      double(3);       //=  6
	     *      triple(4);       //= 12
	     *      multiply(2, 5);  //= 10
	     */
	    var multiply = R.multiply = curry2(function _multiply(a, b) { return a * b; });


	    /**
	     * Subtracts two numbers. Equivalent to `a - b` but curried.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} a The first value.
	     * @param {number} b The second value.
	     * @return {number} The result of `a - b`.
	     * @see R.subtractN
	     * @example
	     *
	     *      var complementaryAngle = subtract(90);
	     *      complementaryAngle(30); //= 60
	     *
	     *      var theRestOf = subtract(1);
	     *      theRestOf(0.25); //= 0.75
	     *
	     *      subtract(10)(8); //= 2
	     */
	    var subtract = R.subtract = curry2(function _subtract(a, b) { return a - b; });


	    /**
	     * Subtracts two numbers in reverse order. Equivalent to `b - a` but
	     * curried. Probably more useful when partially applied than
	     * `subtract`.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} a The first value.
	     * @param {number} b The second value.
	     * @return {number} The result of `a - b`.
	     * @example
	     *
	     *      var complementaryAngle = subtract(90);
	     *      complementaryAngle(30); //= 60
	     *
	     *      var theRestOf = subtract(1);
	     *      theRestOf(0.25); //= 0.75
	     *
	     *      subtract(10)(8); //= 2
	     */
	    R.subtractN = flip(subtract);


	    /**
	     * Divides two numbers. Equivalent to `a / b`.
	     * While at times the curried version of `divide` might be useful,
	     * probably the curried version of `divideBy` will be more useful.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} a The first value.
	     * @param {number} b The second value.
	     * @return {number} The result of `a / b`.
	     * @see R.divideBy
	     * @example
	     *
	     *      var reciprocal = divide(1);
	     *      reciprocal(4);   //= 0.25
	     *      divide(71, 100); //= 0.71
	     */
	    var divide = R.divide = curry2(function _divide(a, b) { return a / b; });


	    /**
	     * Divides two numbers in reverse order. Equivalent to `b / a`.
	     * `divideBy` is the reversed version of `divide`, where the second parameter is
	     * divided by the first.  The curried version of `divideBy` may prove more useful
	     * than that of `divide`.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} a The second value.
	     * @param {number} b The first value.
	     * @return {number} The result of `b / a`.
	     * @see R.divide
	     * @example
	     *
	     *      var half = divideBy(2);
	     *      half(42); // => 21
	     */
	    R.divideBy = flip(divide);


	    /**
	     * Divides the second parameter by the first and returns the remainder.
	     * The flipped version (`moduloBy`) may be more useful curried.
	     * Note that this functions preserves the JavaScript-style behavior for
	     * modulo. For mathematical modulo see `mathMod`
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} a The value to the divide.
	     * @param {number} b The pseudo-modulus
	     * @return {number} The result of `b % a`.
	     * @see R.moduloBy
	     * @see R.mathMod
	     * @example
	     *
	     *      modulo(17, 3) // => 2
	     *      // JS behavior:
	     *      modulo(-17, 3) // => -2
	     *      modulo(17, -3) // => 2
	     */
	    var modulo = R.modulo = curry2(function _modulo(a, b) { return a % b; });


	    /**
	     * Determine if the passed argument is an integer.
	     *
	     * @private
	     * @param n
	     * @category type
	     * @return {Boolean}
	     */
	    // TODO: document, even for internals...
	    var isInteger = Number.isInteger || function isInteger(n) {
	        return (n << 0) === n;
	    };


	    /**
	     * mathMod behaves like the modulo operator should mathematically, unlike the `%`
	     * operator (and by extension, R.modulo). So while "-17 % 5" is -2,
	     * mathMod(-17, 5) is 3. mathMod requires Integer arguments, and returns NaN
	     * when the modulus is zero or negative.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} m The dividend.
	     * @param {number} p the modulus.
	     * @return {number} The result of `b mod a`.
	     * @see R.moduloBy
	     * @example
	     *
	     *      mathMod(-17, 5)  // 3
	     *      mathMod(17, 5)   // 2
	     *      mathMod(17, -5)  // NaN
	     *      mathMod(17, 0)   // NaN
	     *      mathMod(17.2, 5) // NaN
	     *      mathMod(17, 5.3) // NaN
	     */
	    R.mathMod = curry2(function _mathMod(m, p) {
	        if (!isInteger(m)) { return NaN; }
	        if (!isInteger(p) || p < 1) { return NaN; }
	        return ((m % p) + p) % p;
	    });


	    /**
	     * Reversed version of `modulo`, where the second parameter is divided by the first.  The curried version of
	     * this one might be more useful than that of `modulo`.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Number
	     * @param {number} m The dividend.
	     * @param {number} p the modulus.
	     * @return {number} The result of `b mod a`.
	     * @see R.modulo
	     * @example
	     *
	     *      var isOdd = moduloBy(2);
	     *      isOdd(42); // => 0
	     *      isOdd(21); // => 1
	     */
	    R.moduloBy = flip(modulo);


	    /**
	     * Adds together all the elements of a list.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig [Number] -> Number
	     * @param {Array} list An array of numbers
	     * @return {number} The sum of all the numbers in the list.
	     * @see reduce
	     * @example
	     *
	     *      sum([2,4,6,8,100,1]); // => 121
	     */
	    R.sum = foldl(add, 0);


	    /**
	     * Multiplies together all the elements of a list.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig [Number] -> Number
	     * @param {Array} list An array of numbers
	     * @return {number} The product of all the numbers in the list.
	     * @see reduce
	     * @example
	     *
	     *      product([2,4,6,8,100,1]); // => 38400
	     */
	    R.product = foldl(multiply, 1);


	    /**
	     * Returns true if the first parameter is less than the second.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Boolean
	     * @param {Number} a
	     * @param {Number} b
	     * @return {Boolean} a < b
	     * @example
	     *
	     *      lt(2, 6) // => true
	     *      lt(2, 0) // => false
	     *      lt(2, 2) // => false
	     */
	    R.lt = curry2(function _lt(a, b) { return a < b; });


	    /**
	     * Returns true if the first parameter is less than or equal to the second.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Boolean
	     * @param {Number} a
	     * @param {Number} b
	     * @return {Boolean} a <= b
	     * @example
	     *
	     *      lte(2, 6) // => true
	     *      lt(2, 0) // => false
	     *      lt(2, 2) // => true
	     */
	    R.lte = curry2(function _lte(a, b) { return a <= b; });


	    /**
	     * Returns true if the first parameter is greater than the second.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Boolean
	     * @param {Number} a
	     * @param {Number} b
	     * @return {Boolean} a > b
	     * @example
	     *
	     *      gt(2, 6) // => false
	     *      gt(2, 0) // => true
	     *      gt(2, 2) // => false
	     */
	    R.gt = curry2(function _gt(a, b) { return a > b; });


	    /**
	     * Returns true if the first parameter is greater than or equal to the second.
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig Number -> Number -> Boolean
	     * @param {Number} a
	     * @param {Number} b
	     * @return {Boolean} a >= b
	     * @example
	     *
	     *      gt(2, 6) // => false
	     *      gt(2, 0) // => true
	     *      gt(2, 2) // => true
	     */
	    R.gte = curry2(function _gte(a, b) { return a >= b; });


	    /**
	     * Determines the largest of a list of numbers (or elements that can be cast to numbers)
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig [Number] -> Number
	     * @see R.maxWith
	     * @param {Array} list A list of numbers
	     * @return {Number} The greatest number in the list
	     * @example
	     *
	     *      max([7, 3, 9, 2, 4, 9, 3]) // => 9
	     */
	    var max = R.max = function _max(list) {
	        return foldl(binary(Math.max), -Infinity, list);
	    };


	    /**
	     * Determines the largest of a list of items as determined by pairwise comparisons from the supplied comparator
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig (a -> Number) -> [a] -> a
	     * @param {Function} keyFn A comparator function for elements in the list
	     * @param {Array} list A list of comparable elements
	     * @return {*} The greatest element in the list. `undefined` if the list is empty.
	     * @see R.max
	     * @example
	     *
	     *      function cmp(obj) { return obj.x; }
	     *      a = {x: 1}, b = {x: 2}, c = {x: 3};
	     *      maxWith(cmp, [a, b, c]) // => {x: 3}
	     */
	    R.maxWith = curry2(function _maxWith(keyFn, list) {
	        if (!(list && list.length > 0)) {
	            return;
	        }
	        var idx = 0, winner = list[idx], max = keyFn(winner), testKey;
	        while (++idx < list.length) {
	            testKey = keyFn(list[idx]);
	            if (testKey > max) {
	                max = testKey;
	                winner = list[idx];
	            }
	        }
	        return winner;
	    });


	    /**
	     * Determines the smallest of a list of items as determined by pairwise comparisons from the supplied comparator
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig (a -> Number) -> [a] -> a
	     * @param {Function} keyFn A comparator function for elements in the list
	     * @param {Array} list A list of comparable elements
	     * @see R.min
	     * @return {*} The greatest element in the list. `undefined` if the list is empty.
	     * @example
	     *
	     *      function cmp(obj) { return obj.x; }
	     *      var a = {x: 1}, b = {x: 2}, c = {x: 3};
	     *      minWith(cmp, [a, b, c]) // => {x: 1}
	     */
	    // TODO: combine this with maxWith?
	    R.minWith = curry2(function _minWith(keyFn, list) {
	        if (!(list && list.length > 0)) {
	            return;
	        }
	        var idx = 0, winner = list[idx], min = keyFn(list[idx]), testKey;
	        while (++idx < list.length) {
	            testKey = keyFn(list[idx]);
	            if (testKey < min) {
	                min = testKey;
	                winner = list[idx];
	            }
	        }
	        return winner;
	    });


	    /**
	     * Determines the smallest of a list of numbers (or elements that can be cast to numbers)
	     *
	     * @func
	     * @memberOf R
	     * @category math
	     * @sig [Number] -> Number
	     * @param {Array} list A list of numbers
	     * @return {Number} The greatest number in the list
	     * @see R.minWith
	     * @example
	     *
	     *      min([7, 3, 9, 2, 4, 9, 3]) // => 2
	     */
	    R.min = function _min(list) {
	        return foldl(binary(Math.min), Infinity, list);
	    };



	    // String Functions
	    // ----------------
	    //
	    // Much of the String.prototype API exposed as simple functions.

	    // --------

	    /**
	     * returns a subset of a string between one index and another.
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig Number -> Number -> String -> String
	     * @param {Number} indexA An integer between 0 and the length of the string.
	     * @param {Number} indexB An integer between 0 and the length of the string.
	     * @param {String} The string to extract from
	     * @return {String} the extracted substring
	     * @see R.invoker
	     * @example
	     *
	     *      substring(2, 5, 'abcdefghijklm'); //=> 'cde'
	     */
	    var substring = R.substring = invoker('substring', String.prototype);


	    /**
	     * The trailing substring of a String starting with the nth character:
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig Number -> String -> String
	     * @param {Number} indexA An integer between 0 and the length of the string.
	     * @param {String} The string to extract from
	     * @return {String} the extracted substring
	     * @see R.invoker
	     * @example
	     *
	     *      substringFrom(8, 'abcdefghijklm'); //=> 'ijklm'
	     */
	    R.substringFrom = flip(substring)(void 0);


	    /**
	     * The leading substring of a String ending before the nth character:
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig Number -> String -> String
	     * @param {Number} indexA An integer between 0 and the length of the string.
	     * @param {String} The string to extract from
	     * @return {String} the extracted substring
	     * @see R.invoker
	     * @example
	     *
	     *      substringTo(8, 'abcdefghijklm'); //=> 'abcdefgh'
	     */
	    R.substringTo = substring(0);


	    /**
	     * The character at the nth position in a String:
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig Number -> String -> String
	     * @param {Number} index An integer between 0 and the length of the string.
	     * @param {String} str The string to extract a char from
	     * @return {String} the character at `index` of `str`
	     * @see R.invoker
	     * @example
	     *
	     *      charAt(8, 'abcdefghijklm'); //=> 'i'
	     */
	    R.charAt = invoker('charAt', String.prototype);


	    /**
	     * The ascii code of the character at the nth position in a String:
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig Number -> String -> Number
	     * @param {Number} index An integer between 0 and the length of the string.
	     * @param {String} str The string to extract a charCode from
	     * @return {Number} the code of the character at `index` of `str`
	     * @see R.invoker
	     * @example
	     *
	     *      charCodeAt(8, 'abcdefghijklm'); //=> 105
	     *     // (... 'a' ~ 97, 'b' ~ 98, ... 'i' ~ 105)
	     */
	    R.charCodeAt = invoker('charCodeAt', String.prototype);


	    /**
	     * Tests a regular expression agains a String
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig RegExp -> String -> [String] | null
	     * @param {RegExp} rx A regular expression.
	     * @param {String} str The string to match against
	     * @return {Array} The list of matches, or null if no matches found
	     * @see R.invoker
	     * @example
	     *
	     *      match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
	     */
	    R.match = invoker('match', String.prototype);


	    /**
	     * Finds the first index of a substring in a string, returning -1 if it's not present
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig String -> String -> Number
	     * @param {String} c A string to find.
	     * @param {String} str The string to search in
	     * @return {Number} The first index of `c` or -1 if not found
	     * @see R.invoker
	     * @example
	     *
	     *      strIndexOf('c', 'abcdefg) //=> 2
	     */
	    R.strIndexOf = invoker('indexOf', String.prototype);


	    /**
	     *
	     * Finds the last index of a substring in a string, returning -1 if it's not present
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig String -> String -> Number
	     * @param {String} c A string to find.
	     * @param {String} str The string to search in
	     * @return {Number} The last index of `c` or -1 if not found
	     * @see R.invoker
	     * @example
	     *
	     *      strLastIndexOf('a', 'banana split') //=> 5
	     */
	    R.strLastIndexOf = invoker('lastIndexOf', String.prototype);


	    /**
	     * The upper case version of a string.
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig String -> String
	     * @param {string} str The string to upper case.
	     * @return {string} The upper case version of `str`.
	     * @example
	     *
	     *      toUpperCase('abc') //= 'ABC'
	     */
	    R.toUpperCase = invoker('toUpperCase', String.prototype);


	    /**
	     * The lower case version of a string.
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig String -> String
	     * @param {string} str The string to lower case.
	     * @return {string} The lower case version of `str`.
	     * @example
	     *
	     *      toLowerCase('XYZ') //= 'xyz'
	     */
	    R.toLowerCase = invoker('toLowerCase', String.prototype);


	    /**
	     * Splits a string into an array of strings based on the given
	     * separator.
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig String -> String -> [String]
	     * @param {string} sep The separator string.
	     * @param {string} str The string to separate into an array.
	     * @return {Array} The array of strings from `str` separated by `str`.
	     * @example
	     *
	     *      var pathComponents = split('/');
	     *      pathComponents('/usr/local/bin/node');
	     *      //= ['usr', 'local', 'bin', 'node']
	     *
	     *      split('.', 'a.b.c.xyz.d');
	     *      //= ['a', 'b', 'c', 'xyz', 'd']
	     */
	    R.split = invoker('split', String.prototype, 1);


	    /**
	     * internal path function
	     * Takes an array, paths, indicating the deep set of keys
	     * to find.
	     *
	     * @private
	     * @memberOf R
	     * @category string
	     * @param {Array} paths An array of strings to map to object properties
	     * @param {Object} obj The object to find the path in
	     * @return {Array} The value at the end of the path or `undefined`.
	     * @example
	     *
	     *      path(['a', 'b'], {a: {b: 2}}) // => 2
	     */
	    function path(paths, obj) {
	        var i = -1, length = paths.length, val;
	        if (obj == null) { return; }
	        val = obj;
	        while (val != null && ++i < length) {
	            val = val[paths[i]];
	        }
	        return val;
	    }


	    /**
	     * Retrieve a nested path on an object seperated by the specified
	     * separator value.
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig String -> String -> {*} -> *
	     * @param {string} sep The separator to use in `path`.
	     * @param {string} path The path to use.
	     * @return {*} The data at `path`.
	     * @example
	     *
	     *      pathOn('/', 'a/b/c', {a: {b: {c: 3}}}) //= 3
	     */
	    R.pathOn = curry3(function pathOn(sep, str, obj) {
	        return path(str.split(sep), obj);
	    });


	    /**
	     * Retrieve a nested path on an object seperated by periods
	     *
	     * @func
	     * @memberOf R
	     * @category string
	     * @sig String -> {*} -> *
	     * @param {string} path The dot path to use.
	     * @return {*} The data at `path`.
	     * @example
	     *
	     *      path('a.b', {a: {b: 2}}) //= 2
	     */
	    R.path = R.pathOn('.');



	    // Data Analysis and Grouping Functions
	    // ------------------------------------
	    //
	    // Functions performing SQL-like actions on lists of objects.  These do
	    // not have any SQL-like optimizations performed on them, however.

	    // --------

	    /**
	     * Reasonable analog to SQL `select` statement.
	     *
	     * @func
	     * @memberOf R
	     * @category object
	     * @category relation
	     * @string [k] -> [{k: v}] -> [{k: v}]
	     * @param {Array} props The property names to project
	     * @param {Array} objs The objects to query
	     * @return {Array} An array of objects with just the `props` properties.
	     * @example
	     *
	     *      var abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2},
	     *      var fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7}
	     *      var kids = [abby, fred];
	     *      project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
	     */
	    R.project = useWith(map, R.pickAll, identity); // passing `identity` gives correct arity


	    /**
	     * Determines whether the given property of an object has a specific
	     * value according to strict equality (`===`).  Most likely used to
	     * filter a list:
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig k -> v -> {k: v} -> Boolean
	     * @param {string|number} name The property name (or index) to use.
	     * @param {*} val The value to compare the property with.
	     * @return {boolean} `true` if the properties are equal, `false` otherwise.
	     * @example
	     *
	     *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
	     *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
	     *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
	     *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
	     *      var kids = [abby, fred, rusty, alois];
	     *      var hasBrownHair = propEq('hair', 'brown');
	     *      filter(hasBrownHair, kids); //= [fred, rusty]
	     */
	    R.propEq = curry3(function propEq(name, val, obj) {
	        return obj[name] === val;
	    });


	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of the
	     * elements of each list.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig [a] -> [a] -> [a]
	     * @param {Array} as The first list.
	     * @param {Array} bs The second list.
	     * @return {Array} The first and second lists concatenated, with
	     * duplicates removed.
	     * @example
	     *
	     *      union([1, 2, 3], [2, 3, 4]); //= [1, 2, 3, 4]
	     */
	    R.union = compose(uniq, R.concat);


	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of the elements of each list.  Duplication is
	     * determined according to the value returned by applying the supplied predicate to two list elements.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig (a,a -> Boolean) -> [a] -> [a] -> [a]
	     * @param {Function} pred
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The first and second lists concatenated, with
	     *         duplicates removed.
	     * @see R.union
	     * @example
	     *
	     *      function cmp(x, y) { return x.a === y.a; }
	     *      var l1 = [{a: 1}, {a: 2}];
	     *      var l2 = [{a: 1}, {a: 4}];
	     *      unionWith(cmp, l1, l2); //= [{a: 1}, {a: 2}, {a: 4}]
	     */
	    R.unionWith = curry3(function _unionWith(pred, list1, list2) {
	        return uniqWith(pred, concat(list1, list2));
	    });


	    /**
	     * Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig [a] -> [a] -> [a]
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @return {Array} The elements in `list1` that are not in `list2`
	     * @see R.differenceWith
	     * @example
	     *
	     *      difference([1,2,3,4], [7,6,5,4,3]); //= [1,2]
	     *      difference([7,6,5,4,3], [1,2,3,4]); //= [7,6,5]
	     */
	    R.difference = curry2(function _difference(first, second) {
	        return uniq(reject(flip(contains)(second), first));
	    });


	    /**
	     * Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list.
	     * Duplication is determined according to the value returned by applying the supplied predicate to two list
	     * elements.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig (a,a -> Boolean) -> [a] -> [a] -> [a]
	     * @param {Function} pred
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @see R.difference
	     * @return {Array} The elements in `list1` that are not in `list2`
	     * @example
	     *
	     *      function cmp(x, y) { return x.a === y.a; }
	     *      var l1 = [{a: 1}, {a: 2}, {a: 3}];
	     *      var l2 = [{a: 3}, {a: 4}];
	     *      differenceWith(cmp, l1, l2); //= [{a: 1}, {a: 2}]
	     *
	     */
	    R.differenceWith = curry3(function differenceWith(pred, first, second) {
	        return uniqWith(pred)(reject(flip(R.containsWith(pred))(second), first));
	    });


	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of those elements common to both lists.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig [a] -> [a] -> [a]
	     * @param {Array} list1 The first list.
	     * @param {Array} list2 The second list.
	     * @see R.intersectionWith
	     * @return {Array} The list of elements found in both `list1` and `list2`
	     * @example
	     *
	     *      intersection(1,2,3,4], [7,6,5,4,3]); //= [1,2,3,4]
	     */
	    R.intersection = curry2(function intersection(list1, list2) {
	        return uniq(filter(flip(contains)(list1), list2));
	    });


	    /**
	     * Combines two lists into a set (i.e. no duplicates) composed of those
	     * elements common to both lists.  Duplication is determined according
	     * to the value returned by applying the supplied predicate to two list
	     * elements.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig (a,a -> Boolean) -> [a] -> [a] -> [a]
	     * @param {Function} pred A predicate function that determines whether
	     *        the two supplied elements are equal.
	     *        Signatrue: a -> a -> Boolean
	     * @param {Array} list1 One list of items to compare
	     * @param {Array} list2 A second list of items to compare
	     * @see R.intersection
	     * @return {Array} A new list containing those elements common to both lists.
	     * @example
	     *
	     *      var buffaloSpringfield = [
	     *        {id: 824, name: 'Richie Furay'},
	     *        {id: 956, name: 'Dewey Martin'},
	     *        {id: 313, name: 'Bruce Palmer'},
	     *        {id: 456, name: 'Stephen Stills'},
	     *        {id: 177, name: 'Neil Young'}
	     *      ];
	     *      var csny = [
	     *        {id: 204, name: 'David Crosby'},
	     *        {id: 456, name: 'Stephen Stills'},
	     *        {id: 539, name: 'Graham Nash'},
	     *        {id: 177, name: 'Neil Young'}
	     *      ];
	     *
	     *      var sameId = function(o1, o2) {return o1.id === o2.id;};
	     *
	     *      intersectionWith(sameId, buffaloSpringfield, csny); //=>
	     *      // [
	     *      //   {id: 456, name: 'Stephen Stills'},
	     *      //   {id: 177, name: 'Neil Young'}
	     *      // ]
	     */
	    R.intersectionWith = curry3(function intersectionWith(pred, list1, list2) {
	        var results = [], idx = -1;
	        while (++idx < list1.length) {
	            if (containsWith(pred, list1[idx], list2)) {
	                results[results.length] = list1[idx];
	            }
	        }
	        return uniqWith(pred, results);
	    });


	    /**
	     * Creates a new list whose elements each have two properties: `val` is
	     * the value of the corresponding item in the list supplied, and `key`
	     * is the result of applying the supplied function to that item.
	     *
	     * @private
	     * @func
	     * @memberOf R
	     * @category relation
	     * @param {Function} fn An arbitrary unary function returning a potential
	     *        object key.  Signature: Any -> String
	     * @param {Array} list The list of items to process
	     * @return {Array} A new list with the described structure.
	     * @example
	     *
	     *      var people = [
	     *         {first: 'Fred', last: 'Flintstone', age: 23},
	     *         {first: 'Betty', last: 'Rubble', age: 21},
	     *         {first: 'George', last: 'Jetson', age: 29}
	     *      ];
	     *
	     *      var fullName = function(p) {return p.first + ' ' + p.last;};
	     *
	     *      keyValue(fullName, people); //=>
	     *      // [
	     *      //     {
	     *      //         key: 'Fred Flintstone',
	     *      //         val: {first: 'Fred', last: 'Flintstone', age: 23}
	     *      //     }, {
	     *      //         key: 'Betty Rubble',
	     *      //         val: {first: 'Betty', last: 'Rubble', age: 21}
	     *      //    }, {
	     *      //        key: 'George Jetson',
	     *      //        val: {first: 'George', last: 'Jetson', age: 29}
	     *      //    }
	     *      // ];
	     */
	    function keyValue(fn, list) { // TODO: Should this be made public?
	        return map(function(item) {return {key: fn(item), val: item};}, list);
	    }


	    /**
	     * Sorts the list according to a key generated by the supplied function.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig (a -> String) -> [a] -> [a]
	     * @param {Function} fn The function mapping `list` items to keys.
	     * @param {Array} list The list to sort.
	     * @return {Array} A new list sorted by the keys generated by `fn`.
	     * @example
	     *
	     *      var sortByFirstItem = sortBy(prop(0));
	     *      var sortByNameCaseInsensitive = sortBy(compose(toLowerCase, prop('name')));
	     *      var pairs = [[-1, 1], [-2, 2], [-3, 3]];
	     *      sortByFirstItem(pairs); //= [[-3, 3], [-2, 2], [-1, 1]]
	     *      var alice = {
	     *         name: 'ALICE',
	     *         age: 101
	     *      };
	     *      var bob = {
	     *         name: 'Bob',
	     *        age: -10
	     *      };
	     *      var clara = {
	     *        name: 'clara',
	     *        age: 314.159
	     *      };
	     *      var people = [clara, bob, alice];
	     *      sortByNameCaseInsensitive(people); //= [alice, bob, clara]
	     */
	    R.sortBy = curry2(function sortBy(fn, list) {
	        return pluck('val', keyValue(fn, list).sort(comparator(function(a, b) {return a.key < b.key;})));
	    });


	    /**
	     * Counts the elements of a list according to how many match each value
	     * of a key generated by the supplied function. Returns an object
	     * mapping the keys produced by `fn` to the number of occurrences in
	     * the list. Note that all keys are coerced to strings because of how
	     * JavaScript objects work.
	     *
	     * @func
	     * @memberOf R
	     * @category relation
	     * @sig (a -> String) -> [a] -> {*}
	     * @param {Function} fn The function used to map values to keys.
	     * @param {Array} list The list to count elements from.
	     * @return {Object} An object mapping keys to number of occurrences in the list.
	     * @example
	     *
	     *      var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
	     *      var letters = split('', 'abcABCaaaBBc');
	     *      countBy(Math.floor)(numbers);    //= {'1': 3, '2': 2, '3': 1}
	     *      countBy(toLowerCase)(letters);   //= {'a': 5, 'b': 4, 'c': 3}
	     */
	    R.countBy = curry2(function countBy(fn, list) {
	        return foldl(function(counts, obj) {
	            counts[obj.key] = (counts[obj.key] || 0) + 1;
	            return counts;
	        }, {}, keyValue(fn, list));
	    });


	    /**
	     * @private
	     * @param {Function} fn The strategy for extracting function names from an object
	     * @return {Function} A function that takes an object and returns an array of function names
	     *
	     */
	    var functionsWith = function(fn) {
	        return function(obj) {
	            return R.filter(function(key) { return typeof obj[key] === 'function'; }, fn(obj));
	        };
	    };


	    /**
	     * Returns a list of function names of object's own functions
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {*} -> [String]
	     * @param {Object} obj The objects with functions in it
	     * @return {Array} returns a list of the object's own properites that map to functions
	     * @example
	     *
	     *      R.functions(R) // => returns list of ramda's own function names
	     *
	     *      var F = function() { this.x = function(){}; this.y = 1; }
	     *      F.prototype.z = function() {};
	     *      F.prototype.a = 100;
	     *      R.functions(new F()); // ["x"];
	     */
	    R.functions = functionsWith(R.keys);


	    /**
	     * Returns a list of function names of object's own and prototype functions
	     *
	     * @func
	     * @memberOf R
	     * @category Object
	     * @sig {*} -> [String]
	     * @param {Object} obj The objects with functions in it
	     * @return {Array} returns a list of the object's own properites and prototype
	     *                 properties that map to functions
	     * @example
	     *
	     *      R.functionsIn(R) // => returns list of ramda's own and prototype function names
	     *
	     *      var F = function() { this.x = function(){}; this.y = 1; }
	     *      F.prototype.z = function() {};
	     *      F.prototype.a = 100;
	     *      R.functionsIn(new F()); // ["x", "z"];
	     */
	    R.functionsIn = functionsWith(R.keysIn);


	    // All the functional goodness, wrapped in a nice little package, just for you!
	    return R;
	}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8).default.template(function (Handlebars,depth0,helpers,partials,data) {
	  this.compilerInfo = [4,'>= 1.0.0'];
	helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
	  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


	  buffer += "<li class='grid__cell'>\n    <div class=\"img-container\">\n      <img src='"
	    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.thumbnail)),stack1 == null || stack1 === false ? stack1 : stack1.path)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
	    + "."
	    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.thumbnail)),stack1 == null || stack1 === false ? stack1 : stack1.extension)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
	    + "' alt='";
	  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
	  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
	  buffer += escapeExpression(stack1)
	    + "'/>\n    </div>\n    <div class=\"name\">";
	  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
	  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
	  buffer += escapeExpression(stack1)
	    + "</div>\n</li>";
	  return buffer;
	  });

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(11);
	var reduce = __webpack_require__(10);

	/**
	 * Root reference for iframes.
	 */

	var root = 'undefined' == typeof window
	  ? this
	  : window;

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Determine XHR.
	 */

	function getXHR() {
	  if (root.XMLHttpRequest
	    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	}

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return obj === Object(obj);
	}

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(obj[key]));
	    }
	  }
	  return pairs.join('&');
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  this.text = this.xhr.responseText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this.parseBody(this.text)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype.setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype.parseBody = function(str){
	  var parse = request.parse[this.type];
	  return parse
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype.setStatusProperties = function(status){
	  var type = status / 100 | 0;

	  // status / class
	  this.status = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status || 1223 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  Emitter.call(this);
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {};
	  this._header = {};
	  this.on('end', function(){
	    var res = new Response(self);
	    if ('HEAD' == method) res.text = null;
	    self.callback(null, res);
	  });
	}

	/**
	 * Mixin `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Allow for extension
	 */

	Request.prototype.use = function(fn) {
	  fn(this);
	  return this;
	}

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.timeout = function(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.clearTimeout = function(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */

	Request.prototype.abort = function(){
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Get case-insensitive header `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 */

	Request.prototype.getHeader = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass){
	  var str = btoa(user + ':' + pass);
	  this.set('Authorization', 'Basic ' + str);
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.field = function(name, val){
	  if (!this._formData) this._formData = new FormData();
	  this._formData.append(name, val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  if (!this._formData) this._formData = new FormData();
	  this._formData.append(field, file, filename);
	  return this;
	};

	/**
	 * Send `data`, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // querystring
	 *       request.get('/search')
	 *         .end(callback)
	 *
	 *       // multiple data "writes"
	 *       request.get('/search')
	 *         .send({ search: 'query' })
	 *         .send({ range: '1..5' })
	 *         .send({ order: 'desc' })
	 *         .end(callback)
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"})
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.send = function(data){
	  var obj = isObject(data);
	  var type = this.getHeader('Content-Type');

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this.getHeader('Content-Type');
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj) return this;
	  if (!type) this.type('json');
	  return this;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  if (2 == fn.length) return fn(err, res);
	  if (err) return this.emit('error', err);
	  fn(res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
	  err.crossDomain = true;
	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype.timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	Request.prototype.withCredentials = function(){
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	    if (0 == xhr.status) {
	      if (self.aborted) return self.timeoutError();
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  if (xhr.upload) {
	    xhr.upload.onprogress = function(e){
	      e.percent = e.loaded / e.total * 100;
	      self.emit('progress', e);
	    };
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }

	  // initiate request
	  xhr.open(this.method, this.url, true);

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var serialize = request.serialize[this.getHeader('Content-Type')];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  // send stuff
	  this.emit('request', this);
	  xhr.send(data);
	  return this;
	};

	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new Request('GET', method).end(url);
	  }

	  // url first
	  if (1 == arguments.length) {
	    return new Request('GET', method);
	  }

	  return new Request(method, url);
	}

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.del = function(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * Expose `request`.
	 */

	module.exports = request;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// multimethod.js 0.1.0
	//
	// (c) 2011 Kris Jordan
	//
	// `multimethod` is freely distributable under the MIT license.
	// For details and documentation: 
	// [http://krisjordan.com/multimethod-js](http://krisjordan.com/multimethod-js)

	(function() {

	    // Multimethods are a functional programming control structure for dispatching 
	    // function calls with user-defined criteria that can be changed at run time.
	    // Inspired by clojure's multimethods, multimethod.js provides an alternative to
	    // classical, prototype-chain based polymorphism.

	    // ## Internal Utility Functions

	    // No operation function used by default by `default`.
	    var noop = function() {};

	    // Identity `dispatch` function. Default value of `dispatch`.
	    var identity = function(a) { return a; };

	    // A `method` in `multimethod` is a (match value, function) pair stored in
	    // an array. `indexOf` takes a value and array of methods and returns the 
	    // index of the method whose value is equal to the first argument. If no 
	    // match is found, false is returned.
	    var indexOf = function(value, methods) {
	        for(var i in methods) {
	            var matches  = methods[i][0];
	            if(_(value).isEqual(matches)) {
	                return i;
	            }
	        }
	        return false;
	    }

	    // Given a dispatch `value` and array of `method`s, return the function 
	    // of the `method` whose match value corresponds to a dispatch value.
	    var match = function(value, methods) {
	        var index = indexOf(value, methods);
	        if(index !== false) {
	            return methods[index][1];
	        } else {
	            return false;
	        }
	    }

	    // Simple, consistent helper that returns a native value or invokes a function
	    // and returns its return value. Used by `when` and `default` allowing
	    // short-hand notation for returning values rather than calling functions.
	    var toValue = function(subject, args) {
	        if(_.isFunction(subject)) {
	            return subject.apply(this, args);
	        } else {
	            return subject;
	        }
	    };

	    // Plucking a single property value from an object in `dispatch` is commonly
	    // used. The internal `pluck` function returns a function suitable for use
	    // by `dispatch` for just that purpose.
	    var pluck = function(property) {
	        return function(object) {
	            return object[property];
	        }
	    };


	    // ## Implementation 

	    // `multimethod` is a higher-order function that returns a closure with 
	    // methods to control its behavior.
	    var multimethod = function(dispatch) { 

	        // ### Private Properties

	            // `_dispatch` holds either a dispatch function or a string 
	            // corresponding to the property name whose value will be plucked 
	            // and used as the `dispatch` criteria.
	        var _dispatch,
	            // `_methods` is a an array of `method` arrays. A `method` is
	            // [ matchValue, implementation ].
	            _methods   = [],
	            // `_default` is the fallback method when a `multimethod` is called
	            // and matches no other method.
	            _default   = noop;

	        // The fundamental control flow of the `multimethod` is implemented
	        // in `_lookup`. First we invoke the dispatch function, this gives
	        // us our match criteria. Then we match a method based on the criteria
	        // or return the default method.
	        var _lookup    = function() {
	            var criteria    = _dispatch.apply(this, arguments),
	                method      = match(criteria, _methods);
	            if(method !== false) {
	                return method;
	            } else {
	                return _default;
	            }
	        };

	        // The result of calling `multimethod`'s "factory" function is this function.
	        var returnFn  = function() {
	            var method = _lookup.apply(this, arguments);
	            return toValue.call(this, method, arguments);
	        };

	        // ### Member Methods / API

	        // `dispatch` is the accessor to the `multimethod`'s `_dispatch` function.
	        // When called with a string we create an anonymous pluck function as a 
	        // shorthand.
	        returnFn['dispatch'] = function(dispatch) {
	            if(_.isFunction(dispatch)) {
	                _dispatch = dispatch;
	            } else if(_.isString(dispatch)) {
	                _dispatch = pluck(dispatch);
	            } else {
	                throw "dispatch requires a function or a string.";
	            }
	            return this;
	        }
	        // If `multimethod` is called/"constructed" with a `dispatch` value we go ahead and set
	        // it up here. Otherwise `dispatch` is the `identity` function.
	        returnFn.dispatch(dispatch || identity);

	        // `when` introduces new `method`s to a `multimethod`. If the
	        // `matchValue` has already been registered the new method will
	        // overwrite the old method.
	        returnFn['when'] = function(matchValue, fn) {
	            var index = indexOf(matchValue, _methods);
	            if(index !== false) {
	                _methods[index] = [matchValue, fn];
	            } else {
	                _methods.push([matchValue, fn]);
	            }
	            return this;
	        }

	        // `remove` will unregister a `method` based on matchValue
	        returnFn['remove'] = function(matchValue) {
	            var index = indexOf(matchValue, _methods);
	            if(index !== false) {
	                _methods.splice(index, 1);
	            }
	            return this;
	        }

	        // `default` is an accessor to control the `_default`, fallback method
	        // that is called when no match is found when the `multimethod` is 
	        // invoked and dispatched.
	        returnFn['default'] = function(method) {
	            _default = method;
	            return this;
	        }

	        // Our `multimethod` instance/closure is fully setup now, return!
	        return returnFn;
	    };

	    // The following snippet courtesy of underscore.js.
	    // Export `multimethod` to the window/exports namespace.
	    if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = multimethod;
	            var _ = __webpack_require__(9);
	        }
	        exports.multimethod = multimethod;
	    } else if (typeof define === 'function' && define.amd) {
	        define('multimethod', function() {
	            return multimethod;
	        });
	    } else {
	        this['multimethod'] = multimethod;
	        var _ = this['_'];
	    }

	    multimethod.version = '0.1.0';

	}).call(this);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Kris Zyp
	// Updates/added features by ...Max... (Max Motovilov)

	// this is based on the CommonJS spec for promises: 
	// http://wiki.commonjs.org/wiki/Promises
	// Includes convenience functions for promises, much of this is taken from Tyler Close's ref_send 
	// and Kris Kowal's work on promises.
	// // MIT License

	// A typical usage:
	// A default Promise constructor can be used to create a self-resolving deferred/promise:
	// var Promise = require("promise").Promise;
	//  var promise = new Promise();
	// asyncOperation(function(){
	//  Promise.resolve("succesful result");
	// });
	//  promise -> given to the consumer
	//  
	//  A consumer can use the promise
	//  promise.then(function(result){
	//    ... when the action is complete this is executed ...
	//   },
	//   function(error){
	//    ... executed when the promise fails
	//  });
	//
	// Alternately, a provider can create a deferred and resolve it when it completes an action. 
	// The deferred object a promise object that provides a separation of consumer and producer to protect
	// promises from being fulfilled by untrusted code.
	// var defer = require("promise").defer;
	//  var deferred = defer();
	// asyncOperation(function(){
	//  deferred.resolve("succesful result");
	// });
	//  deferred.promise -> given to the consumer
	//  
	//  Another way that a consumer can use the promise (using promise.then is also allowed)
	// var when = require("promise").when;
	// when(promise,function(result){
	//    ... when the action is complete this is executed ...
	//   },
	//   function(error){
	//    ... executed when the promise fails
	//  });
	try{
	  var enqueue = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"event-queue\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).enqueue;
	}
	catch(e){
	  // squelch the error, and only complain if the queue is needed
	}
	if(!enqueue){
	  if (typeof setImmediate == "function"){
	    enqueue = setImmediate;
	  } else if (typeof process !== "undefined" && typeof process.nextTick == "function") {
	    enqueue = process.nextTick;
	  } else {
	    enqueue = function(func){
	      func();
	    }
	  }
	}  
	// commented out due to: http://code.google.com/p/v8/issues/detail?id=851
	var freeze = /*Object.freeze || */function(){};

	/**
	 * Default constructor that creates a self-resolving Promise. Not all promise implementations
	 * need to use this constructor.
	 */
	var Promise = function(canceller){
	};

	/**
	 * Promise implementations must provide a "then" function.
	 */
	Promise.prototype.then = function(resolvedCallback, errorCallback, progressCallback){
	  throw new TypeError("The Promise base class is abstract, this function must be implemented by the Promise implementation");
	};

	/**
	 * If an implementation of a promise supports a concurrency model that allows
	 * execution to block until the promise is resolved, the wait function may be 
	 * added. 
	 */
	/**
	 * If an implementation of a promise can be cancelled, it may add this function
	 */
	 // Promise.prototype.cancel = function(){
	 // };

	Promise.prototype.get = function(propertyName){
	  return this.then(function(value){
	    return value[propertyName];
	  });
	};

	Promise.prototype.put = function(propertyName, value){
	  return this.then(function(object){
	    return object[propertyName] = value;
	  });
	};

	Promise.prototype.call = function(functionName /*, args */){
	  return this.then(function(value){
	    return value[functionName].apply(value, Array.prototype.slice.call(arguments, 1));
	  });
	};

	/** Dojo/NodeJS methods*/
	Promise.prototype.addCallback = function(callback){
	  return this.then(callback);
	};

	Promise.prototype.addErrback = function(errback){
	  return this.then(function(){}, errback);
	};

	/*Dojo methods*/
	Promise.prototype.addBoth = function(callback){
	  return this.then(callback, callback);
	};

	Promise.prototype.addCallbacks = function(callback, errback){
	  return this.then(callback, errback);
	};

	/*NodeJS method*/
	Promise.prototype.wait = function(){
	  return exports.wait(this);
	};

	Deferred.prototype = Promise.prototype;
	// A deferred provides an API for creating and resolving a promise.
	exports.Promise = exports.Deferred = exports.defer = defer;
	function defer( canceller ){
	  return new Deferred( canceller );
	} 

	var contextHandler = exports.contextHandler = {};

	function Deferred(canceller){
	  var result, finished, isError, waiting = [], handled;
	  var promise = this.promise = new Promise();
	  var currentContextHandler = contextHandler.getHandler && contextHandler.getHandler();
	  
	  function notifyAll(value){
	    if(finished){
	      throw new Error("This deferred has already been resolved");        
	    }
	    result = value;
	    finished = true;
	    for(var i = 0; i < waiting.length; i++){
	      notify(waiting[i]);  
	    }
	  }
	  function notify(listener){
	    var func = (isError ? listener.error : listener.resolved);
	    if(func){
	      handled = true;
	      enqueue(function(){
	        if(currentContextHandler){
	          currentContextHandler.resume();
	        }
	        try{
	          var newResult = func(result);
	          if(newResult && typeof newResult.then === "function"){
	            newResult.then(listener.deferred.resolve, listener.deferred.reject);
	            return;
	          }
	          listener.deferred.resolve(newResult);
	        }
	        catch(e){
	          listener.deferred.reject(e);
	        }
	        finally{
	          if(currentContextHandler){
	            currentContextHandler.suspend();
	          }
	        }
	      });
	    }
	    else{
	      if(isError){
	        if (listener.deferred.reject(result, true)) {
	          handled = true;
	          }
	      }
	      else{
	        listener.deferred.resolve.apply(listener.deferred, result);
	      }
	    }
	  }
	  // calling resolve will resolve the promise
	  this.resolve = this.callback = this.emitSuccess = function(value){
	    notifyAll(value);
	  };
	  
	  // calling error will indicate that the promise failed
	  var reject = this.reject = this.errback = this.emitError = function(error, dontThrow){
	    isError = true;
	    notifyAll(error);
	    if (!dontThrow) {
	      enqueue(function () {
	        if (!handled) {
	          throw error;
	        }
	      });
	    }
	    return handled;
	  };
	  
	  // call progress to provide updates on the progress on the completion of the promise
	  this.progress = function(update){
	    for(var i = 0; i < waiting.length; i++){
	      var progress = waiting[i].progress;
	      progress && progress(update);  
	    }
	  }
	  // provide the implementation of the promise
	  this.then = promise.then = function(resolvedCallback, errorCallback, progressCallback){
	    var returnDeferred = new Deferred();
		if( promise.cancel ) returnDeferred.cancel = returnDeferred.promise.cancel = promise.cancel;
	    var listener = {resolved: resolvedCallback, error: errorCallback, progress: progressCallback, deferred: returnDeferred}; 
	    if(finished){
	      notify(listener);
	    }
	    else{
	      waiting.push(listener);
	    }
	    return returnDeferred.promise;
	  };
	  var timeout;
	  if(typeof setTimeout !== "undefined") {
	    this.timeout = function (ms) {
	      if (ms === undefined) {
	        return timeout;
	      }
	      timeout = ms;
	      setTimeout(function () {
	        if (!finished) {
	          if (promise.cancel) {
	            promise.cancel(new Error("timeout"));
	          }
	          else {
	            reject(new Error("timeout"));
	          }
	        }
	      }, ms);
	      return promise;
	    };
	  }
	  
	  if(canceller){
	    this.cancel = promise.cancel = function(){
		  if( !finished ) {
			  var error = canceller();
			  if(!(error instanceof Error)){
			    error = new Error(error);
			  }
			  reject(error);
		  }
	    }
	  }
	  freeze(promise);
	};

	function perform(value, async, sync){
	  try{
	    if(value && typeof value.then === "function"){
	      value = async(value);
	    }
	    else{
	      value = sync(value);
	    }
	    if(value && typeof value.then === "function"){
	      return value;
	    }
	    var deferred = new Deferred();
	    deferred.resolve(value);
	    return deferred.promise;
	  }catch(e){
	    var deferred = new Deferred();
	    deferred.reject(e);
	    return deferred.promise;
	  }
	  
	}
	/**
	 * Promise manager to make it easier to consume promises
	 */
	 
	/**
	 * Registers an observer on a promise.
	 * @param value   promise or value to observe
	 * @param resolvedCallback function to be called with the resolved value
	 * @param rejectCallback  function to be called with the rejection reason
	 * @param progressCallback  function to be called when progress is made
	 * @return promise for the return value from the invoked callback
	 */
	exports.whenPromise = function(value, resolvedCallback, rejectCallback, progressCallback){
	  return perform(value, function(value){
	    return value.then(resolvedCallback, rejectCallback, progressCallback);
	  },
	  function(value){
	    return resolvedCallback(value);
	  });
	};
	/**
	 * Registers an observer on a promise.
	 * @param value   promise or value to observe
	 * @param resolvedCallback function to be called with the resolved value
	 * @param rejectCallback  function to be called with the rejection reason
	 * @param progressCallback  function to be called when progress is made
	 * @return promise for the return value from the invoked callback or the value if it
	 * is a non-promise value
	 */
	exports.when = function(value, resolvedCallback, rejectCallback, progressCallback){
	  if(value && typeof value.then === "function"){
	    return exports.whenPromise(value, resolvedCallback, rejectCallback, progressCallback);
	  }
	  return resolvedCallback(value);
	};

	/**
	 * Gets the value of a property in a future turn.
	 * @param target  promise or value for target object
	 * @param property    name of property to get
	 * @return promise for the property value
	 */
	exports.get = function(target, property){
	  return perform(target, function(target){
	    return target.get(property);
	  },
	  function(target){
	    return target[property]
	  });
	};

	/**
	 * Invokes a method in a future turn.
	 * @param target  promise or value for target object
	 * @param methodName    name of method to invoke
	 * @param args    array of invocation arguments
	 * @return promise for the return value
	 */
	exports.post = function(target, methodName, args){
	  return perform(target, function(target){
	    return target.call(property, args);
	  },
	  function(target){
	    return target[methodName].apply(target, args);
	  });
	};

	/**
	 * Sets the value of a property in a future turn.
	 * @param target  promise or value for target object
	 * @param property    name of property to set
	 * @param value   new value of property
	 * @return promise for the return value
	 */
	exports.put = function(target, property, value){
	  return perform(target, function(target){
	    return target.put(property, value);
	  },
	  function(target){
	    return target[property] = value;
	  });
	};


	/**
	 * Waits for the given promise to finish, blocking (and executing other events)
	 * if necessary to wait for the promise to finish. If target is not a promise
	 * it will return the target immediately. If the promise results in an reject,
	 * that reject will be thrown.
	 * @param target   promise or value to wait for.
	 * @return the value of the promise;
	 */
	exports.wait = function(target){
	  if(!queue){
	    throw new Error("Can not wait, the event-queue module is not available");
	  }
	  if(target && typeof target.then === "function"){
	    var isFinished, isError, result;    
	    target.then(function(value){
	      isFinished = true;
	      result = value;
	    },
	    function(error){
	      isFinished = true;
	      isError = true;
	      result = error;
	    });
	    while(!isFinished){
	      queue.processNextEvent(true);
	    }
	    if(isError){
	      throw result;
	    }
	    return result;
	  }
	  else{
	    return target;
	  }
	};



	/**
	 * Takes an array of promises and returns a promise that is fulfilled once all
	 * the promises in the array are fulfilled
	 * @param array  The array of promises
	 * @return the promise that is fulfilled when all the array is fulfilled, resolved to the array of results
	 */

	function composeAll(fail_on_error) {
		return function(array) {
			var deferred = new Deferred( cancel ),
				once = true;

			if( !(array instanceof Array) )
				array = Array.prototype.slice.call(arguments);
			else
				array = array.slice();
			var todo = array.reduce( function(count,p){ return count+(p&&p.then?1:0); }, 0 );
			if( todo === 0 )	
				deferred.resolve(array);
			else
				array.forEach( function( p, i ) {
					if( p && p.then )
						exports.when( p, succeed, fail_on_error ? failOnce : succeed );

					function succeed( v ) {
						array[i] = v;
						if( --todo === 0 )	
							deferred.resolve(array);
					}

					function failOnce( err ) {
						if( once ) {
							once = false;
							cancel( i );
							deferred.reject( err );
						}
					}
				} );

			return deferred.promise;

			function cancel( except ) {
				once = false;
				array.forEach( function(p,i) {
					if( i !== except && p && p.then && p.cancel )	
						p.cancel();
				} );
			}
		}
	}

	exports.all = composeAll(false);

	/**
	 * Variation of all() -- fails if any of the promises fail
	 */
	exports.allOrNone = composeAll(true);

	/**
	 * Takes an array of promises and returns a promise that is fulfilled when the first 
	 * promise in the array of promises is fulfilled
	 * @param array  The array of promises
	 * @return a promise that is fulfilled with the value of the value of first promise to be fulfilled
	 */
	exports.first = function(array){
	  var deferred = new Deferred();
	  if(!(array instanceof Array)){
	    array = Array.prototype.slice.call(arguments);
	  }
	  var fulfilled;
	  array.forEach(function(promise, index){
	    exports.when(promise, function(value){
	      if (!fulfilled) {
	        fulfilled = true;
	        deferred.resolve(value);
	      }  
	    },
	    function(error){
	      if (!fulfilled) {
	        fulfilled = true;
	        deferred.resolve(error);
	      }  
	    });
	  });
	  return deferred.promise;
	};

	/**
	 * Takes an array of asynchronous functions (that return promises) and 
	 * executes them sequentially. Each funtion is called with the return value of the last function
	 * @param array  The array of function
	 * @param startingValue The value to pass to the first function
	 * @return the value returned from the last function
	 */
	exports.seq = function(array, startingValue){
	  array = array.concat(); // make a copy
	  var deferred = new Deferred();
	  function next(value){
	    var nextAction = array.shift();
	    if(nextAction){
	      exports.when(nextAction(value), next, deferred.reject);
	    }
	    else {
	      deferred.resolve(value);
	    }  
	  }
	  next(startingValue);
	  return deferred.promise;
	};


	/**
	 * Delays for a given amount of time and then fulfills the returned promise.
	 * @param milliseconds The number of milliseconds to delay
	 * @return A promise that will be fulfilled after the delay
	 */
	if(typeof setTimeout !== "undefined") {
	  exports.delay = function(milliseconds) {
	    var deferred = new Deferred();
	    setTimeout(function(){
	      deferred.resolve();
	    }, milliseconds);
	    return deferred.promise;
	  };
	}



	/**
	 * Runs a function that takes a callback, but returns a Promise instead.
	 * @param func   node compatible async function which takes a callback as its last argument
	 * @return promise for the return value from the callback from the function
	 */
	exports.execute = function(asyncFunction){
	  var args = Array.prototype.slice.call(arguments, 1);

	  var deferred = new Deferred();
	  args.push(function(error, result){
	    if(error) {
	      deferred.emitError(error);
	    }
	    else {
	      if(arguments.length > 2){
	        // if there are multiple success values, we return an array
	        Array.prototype.shift.call(arguments, 1);
	        deferred.emitSuccess(arguments);
	      }
	      else{
	        deferred.emitSuccess(result);
	      }
	    }
	  });
	  asyncFunction.apply(this, args);
	  return deferred.promise;
	};

	/**
	 * Converts a Node async function to a promise returning function
	 * @param func   node compatible async function which takes a callback as its last argument
	 * @return A function that returns a promise
	 */
	exports.convertNodeAsyncFunction = function(asyncFunction, callbackNotDeclared){
	  var arity = asyncFunction.length;
	  if(callbackNotDeclared){
	    arity++;
	  }
	  return function(){
	    var deferred = new Deferred();
	    arguments.length = arity;
	    arguments[arity - 1] = function(error, result){
	      if(error) {
	        deferred.emitError(error);
	      }
	      else {
	        if(arguments.length > 2){
	          // if there are multiple success values, we return an array
	          Array.prototype.shift.call(arguments, 1);
	          deferred.emitSuccess(arguments);
	        }
	        else{
	          deferred.emitSuccess(result);
	        }
	      }
	    };
	    asyncFunction.apply(this, arguments);
	    return deferred.promise;
	  };
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// Create a simple path alias to allow browserify to resolve
	// the runtime on a supported path.
	module.exports = __webpack_require__(12);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	//     Underscore.js 1.2.1
	//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
	//     Underscore is freely distributable under the MIT license.
	//     Portions of Underscore are inspired or borrowed from Prototype,
	//     Oliver Steele's Functional, and John Resig's Micro-Templating.
	//     For all details and documentation:
	//     http://documentcloud.github.com/underscore

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `global` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Establish the object that gets returned to break out of a loop iteration.
	  var breaker = {};

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var slice            = ArrayProto.slice,
	      unshift          = ArrayProto.unshift,
	      toString         = ObjProto.toString,
	      hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeForEach      = ArrayProto.forEach,
	    nativeMap          = ArrayProto.map,
	    nativeReduce       = ArrayProto.reduce,
	    nativeReduceRight  = ArrayProto.reduceRight,
	    nativeFilter       = ArrayProto.filter,
	    nativeEvery        = ArrayProto.every,
	    nativeSome         = ArrayProto.some,
	    nativeIndexOf      = ArrayProto.indexOf,
	    nativeLastIndexOf  = ArrayProto.lastIndexOf,
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind;

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) { return new wrapper(obj); };

	  // Export the Underscore object for **Node.js** and **"CommonJS"**, with
	  // backwards-compatibility for the old `require()` API. If we're not in
	  // CommonJS, add `_` to the global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else if (typeof define === 'function' && define.amd) {
	    // Register as a named module with AMD.
	    define('underscore', function() {
	      return _;
	    });
	  } else {
	    // Exported as a string, for Closure Compiler "advanced" mode.
	    root['_'] = _;
	  }

	  // Current version.
	  _.VERSION = '1.2.1';

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles objects with the built-in `forEach`, arrays, and raw objects.
	  // Delegates to **ECMAScript 5**'s native `forEach` if available.
	  var each = _.each = _.forEach = function(obj, iterator, context) {
	    if (obj == null) return;
	    if (nativeForEach && obj.forEach === nativeForEach) {
	      obj.forEach(iterator, context);
	    } else if (obj.length === +obj.length) {
	      for (var i = 0, l = obj.length; i < l; i++) {
	        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
	      }
	    } else {
	      for (var key in obj) {
	        if (hasOwnProperty.call(obj, key)) {
	          if (iterator.call(context, obj[key], key, obj) === breaker) return;
	        }
	      }
	    }
	  };

	  // Return the results of applying the iterator to each element.
	  // Delegates to **ECMAScript 5**'s native `map` if available.
	  _.map = function(obj, iterator, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	    each(obj, function(value, index, list) {
	      results[results.length] = iterator.call(context, value, index, list);
	    });
	    return results;
	  };

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
	  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
	    var initial = memo !== void 0;
	    if (obj == null) obj = [];
	    if (nativeReduce && obj.reduce === nativeReduce) {
	      if (context) iterator = _.bind(iterator, context);
	      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
	    }
	    each(obj, function(value, index, list) {
	      if (!initial) {
	        memo = value;
	        initial = true;
	      } else {
	        memo = iterator.call(context, memo, value, index, list);
	      }
	    });
	    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
	    return memo;
	  };

	  // The right-associative version of reduce, also known as `foldr`.
	  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
	  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
	    if (obj == null) obj = [];
	    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
	      if (context) iterator = _.bind(iterator, context);
	      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
	    }
	    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
	    return _.reduce(reversed, iterator, memo, context);
	  };

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, iterator, context) {
	    var result;
	    any(obj, function(value, index, list) {
	      if (iterator.call(context, value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };

	  // Return all the elements that pass a truth test.
	  // Delegates to **ECMAScript 5**'s native `filter` if available.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, iterator, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
	    each(obj, function(value, index, list) {
	      if (iterator.call(context, value, index, list)) results[results.length] = value;
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, iterator, context) {
	    var results = [];
	    if (obj == null) return results;
	    each(obj, function(value, index, list) {
	      if (!iterator.call(context, value, index, list)) results[results.length] = value;
	    });
	    return results;
	  };

	  // Determine whether all of the elements match a truth test.
	  // Delegates to **ECMAScript 5**'s native `every` if available.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, iterator, context) {
	    var result = true;
	    if (obj == null) return result;
	    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
	    each(obj, function(value, index, list) {
	      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
	    });
	    return result;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Delegates to **ECMAScript 5**'s native `some` if available.
	  // Aliased as `any`.
	  var any = _.some = _.any = function(obj, iterator, context) {
	    iterator = iterator || _.identity;
	    var result = false;
	    if (obj == null) return result;
	    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
	    each(obj, function(value, index, list) {
	      if (result |= iterator.call(context, value, index, list)) return breaker;
	    });
	    return !!result;
	  };

	  // Determine if a given value is included in the array or object using `===`.
	  // Aliased as `contains`.
	  _.include = _.contains = function(obj, target) {
	    var found = false;
	    if (obj == null) return found;
	    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	    found = any(obj, function(value) {
	      if (value === target) return true;
	    });
	    return found;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    return _.map(obj, function(value) {
	      return (method.call ? method || value : value[method]).apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, function(value){ return value[key]; });
	  };

	  // Return the maximum element or (element-based computation).
	  _.max = function(obj, iterator, context) {
	    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
	    if (!iterator && _.isEmpty(obj)) return -Infinity;
	    var result = {computed : -Infinity};
	    each(obj, function(value, index, list) {
	      var computed = iterator ? iterator.call(context, value, index, list) : value;
	      computed >= result.computed && (result = {value : value, computed : computed});
	    });
	    return result.value;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iterator, context) {
	    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
	    if (!iterator && _.isEmpty(obj)) return Infinity;
	    var result = {computed : Infinity};
	    each(obj, function(value, index, list) {
	      var computed = iterator ? iterator.call(context, value, index, list) : value;
	      computed < result.computed && (result = {value : value, computed : computed});
	    });
	    return result.value;
	  };

	  // Shuffle an array.
	  _.shuffle = function(obj) {
	    var shuffled = [], rand;
	    each(obj, function(value, index, list) {
	      if (index == 0) {
	        shuffled[0] = value;
	      } else {
	        rand = Math.floor(Math.random() * (index + 1));
	        shuffled[index] = shuffled[rand];
	        shuffled[rand] = value;
	      }
	    });
	    return shuffled;
	  };

	  // Sort the object's values by a criterion produced by an iterator.
	  _.sortBy = function(obj, iterator, context) {
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value : value,
	        criteria : iterator.call(context, value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria, b = right.criteria;
	      return a < b ? -1 : a > b ? 1 : 0;
	    }), 'value');
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = function(obj, val) {
	    var result = {};
	    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
	    each(obj, function(value, index) {
	      var key = iterator(value, index);
	      (result[key] || (result[key] = [])).push(value);
	    });
	    return result;
	  };

	  // Use a comparator function to figure out at what index an object should
	  // be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iterator) {
	    iterator || (iterator = _.identity);
	    var low = 0, high = array.length;
	    while (low < high) {
	      var mid = (low + high) >> 1;
	      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
	    }
	    return low;
	  };

	  // Safely convert anything iterable into a real, live array.
	  _.toArray = function(iterable) {
	    if (!iterable)                return [];
	    if (iterable.toArray)         return iterable.toArray();
	    if (_.isArray(iterable))      return slice.call(iterable);
	    if (_.isArguments(iterable))  return slice.call(iterable);
	    return _.values(iterable);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    return _.toArray(obj).length;
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head`. The **guard** check allows it to work
	  // with `_.map`.
	  _.first = _.head = function(array, n, guard) {
	    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
	  };

	  // Returns everything but the last entry of the array. Especcialy useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N. The **guard** check allows it to work with
	  // `_.map`.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array. The **guard** check allows it to work with `_.map`.
	  _.last = function(array, n, guard) {
	    return (n != null) && !guard ? slice.call(array, array.length - n) : array[array.length - 1];
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail`.
	  // Especially useful on the arguments object. Passing an **index** will return
	  // the rest of the values in the array from that index onward. The **guard**
	  // check allows it to work with `_.map`.
	  _.rest = _.tail = function(array, index, guard) {
	    return slice.call(array, (index == null) || guard ? 1 : index);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, function(value){ return !!value; });
	  };

	  // Return a completely flattened version of an array.
	  _.flatten = function(array, shallow) {
	    return _.reduce(array, function(memo, value) {
	      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
	      memo[memo.length] = value;
	      return memo;
	    }, []);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iterator) {
	    var initial = iterator ? _.map(array, iterator) : array;
	    var result = [];
	    _.reduce(initial, function(memo, el, i) {
	      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
	        memo[memo.length] = el;
	        result[result.length] = array[i];
	      }
	      return memo;
	    }, []);
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(_.flatten(arguments, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays. (Aliased as "intersect" for back-compat.)
	  _.intersection = _.intersect = function(array) {
	    var rest = slice.call(arguments, 1);
	    return _.filter(_.uniq(array), function(item) {
	      return _.every(rest, function(other) {
	        return _.indexOf(other, item) >= 0;
	      });
	    });
	  };

	  // Take the difference between one array and another.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array, other) {
	    return _.filter(array, function(value){ return !_.include(other, value); });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    var args = slice.call(arguments);
	    var length = _.max(_.pluck(args, 'length'));
	    var results = new Array(length);
	    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
	    return results;
	  };

	  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
	  // we need this function. Return the position of the first occurrence of an
	  // item in an array, or -1 if the item is not included in the array.
	  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = function(array, item, isSorted) {
	    if (array == null) return -1;
	    var i, l;
	    if (isSorted) {
	      i = _.sortedIndex(array, item);
	      return array[i] === item ? i : -1;
	    }
	    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
	    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
	    return -1;
	  };

	  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
	  _.lastIndexOf = function(array, item) {
	    if (array == null) return -1;
	    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
	    var i = array.length;
	    while (i--) if (array[i] === item) return i;
	    return -1;
	  };

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (arguments.length <= 1) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = arguments[2] || 1;

	    var len = Math.max(Math.ceil((stop - start) / step), 0);
	    var idx = 0;
	    var range = new Array(len);

	    while(idx < len) {
	      range[idx++] = start;
	      start += step;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Reusable constructor function for prototype setting.
	  var ctor = function(){};

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Binding with arguments is also known as `curry`.
	  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
	  // We check for `func.bind` first, to fail fast when `func` is undefined.
	  _.bind = function bind(func, context) {
	    var bound, args;
	    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError;
	    args = slice.call(arguments, 2);
	    return bound = function() {
	      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
	      ctor.prototype = func.prototype;
	      var self = new ctor;
	      var result = func.apply(self, args.concat(slice.call(arguments)));
	      if (Object(result) === result) return result;
	      return self;
	    };
	  };

	  // Bind all of an object's methods to that object. Useful for ensuring that
	  // all callbacks defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var funcs = slice.call(arguments, 1);
	    if (funcs.length == 0) funcs = _.functions(obj);
	    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memo = {};
	    hasher || (hasher = _.identity);
	    return function() {
	      var key = hasher.apply(this, arguments);
	      return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
	    };
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){ return func.apply(func, args); }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = function(func) {
	    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	  };

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time.
	  _.throttle = function(func, wait) {
	    var timeout, context, args, throttling, finishThrottle;
	    finishThrottle = _.debounce(function(){ throttling = false; }, wait);
	    return function() {
	      context = this; args = arguments;
	      var throttler = function() {
	        timeout = null;
	        func.apply(context, args);
	        finishThrottle();
	      };
	      if (!timeout) timeout = setTimeout(throttler, wait);
	      if (!throttling) func.apply(context, args);
	      if (finishThrottle) finishThrottle();
	      throttling = true;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds.
	  _.debounce = function(func, wait) {
	    var timeout;
	    return function() {
	      var context = this, args = arguments;
	      var throttler = function() {
	        timeout = null;
	        func.apply(context, args);
	      };
	      clearTimeout(timeout);
	      timeout = setTimeout(throttler, wait);
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = function(func) {
	    var ran = false, memo;
	    return function() {
	      if (ran) return memo;
	      ran = true;
	      return memo = func.apply(this, arguments);
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return function() {
	      var args = [func].concat(slice.call(arguments));
	      return wrapper.apply(this, args);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var funcs = slice.call(arguments);
	    return function() {
	      var args = slice.call(arguments);
	      for (var i = funcs.length - 1; i >= 0; i--) {
	        args = [funcs[i].apply(this, args)];
	      }
	      return args[0];
	    };
	  };

	  // Returns a function that will only be executed after being called N times.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) { return func.apply(this, arguments); }
	    };
	  };

	  // Object Functions
	  // ----------------

	  // Retrieve the names of an object's properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = nativeKeys || function(obj) {
	    if (obj !== Object(obj)) throw new TypeError('Invalid object');
	    var keys = [];
	    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    return _.map(obj, _.identity);
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = function(obj) {
	    each(slice.call(arguments, 1), function(source) {
	      for (var prop in source) {
	        if (source[prop] !== void 0) obj[prop] = source[prop];
	      }
	    });
	    return obj;
	  };

	  // Fill in a given object with default properties.
	  _.defaults = function(obj) {
	    each(slice.call(arguments, 1), function(source) {
	      for (var prop in source) {
	        if (obj[prop] == null) obj[prop] = source[prop];
	      }
	    });
	    return obj;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Internal recursive comparison function.
	  function eq(a, b, stack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
	    if (a === b) return a !== 0 || 1 / a == 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if ((a == null) || (b == null)) return a === b;
	    // Unwrap any wrapped objects.
	    if (a._chain) a = a._wrapped;
	    if (b._chain) b = b._wrapped;
	    // Invoke a custom `isEqual` method if one is provided.
	    if (_.isFunction(a.isEqual)) return a.isEqual(b);
	    if (_.isFunction(b.isEqual)) return b.isEqual(a);
	    // Compare object types.
	    var typeA = typeof a;
	    if (typeA != typeof b) return false;
	    // Optimization; ensure that both values are truthy or falsy.
	    if (!a != !b) return false;
	    // `NaN` values are equal.
	    if (_.isNaN(a)) return _.isNaN(b);
	    // Compare string objects by value.
	    var isStringA = _.isString(a), isStringB = _.isString(b);
	    if (isStringA || isStringB) return isStringA && isStringB && String(a) == String(b);
	    // Compare number objects by value.
	    var isNumberA = _.isNumber(a), isNumberB = _.isNumber(b);
	    if (isNumberA || isNumberB) return isNumberA && isNumberB && +a == +b;
	    // Compare boolean objects by value. The value of `true` is 1; the value of `false` is 0.
	    var isBooleanA = _.isBoolean(a), isBooleanB = _.isBoolean(b);
	    if (isBooleanA || isBooleanB) return isBooleanA && isBooleanB && +a == +b;
	    // Compare dates by their millisecond values.
	    var isDateA = _.isDate(a), isDateB = _.isDate(b);
	    if (isDateA || isDateB) return isDateA && isDateB && a.getTime() == b.getTime();
	    // Compare RegExps by their source patterns and flags.
	    var isRegExpA = _.isRegExp(a), isRegExpB = _.isRegExp(b);
	    if (isRegExpA || isRegExpB) {
	      // Ensure commutative equality for RegExps.
	      return isRegExpA && isRegExpB &&
	             a.source == b.source &&
	             a.global == b.global &&
	             a.multiline == b.multiline &&
	             a.ignoreCase == b.ignoreCase;
	    }
	    // Ensure that both values are objects.
	    if (typeA != 'object') return false;
	    // Arrays or Arraylikes with different lengths are not equal.
	    if (a.length !== b.length) return false;
	    // Objects with different constructors are not equal.
	    if (a.constructor !== b.constructor) return false;
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    var length = stack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (stack[length] == a) return true;
	    }
	    // Add the first object to the stack of traversed objects.
	    stack.push(a);
	    var size = 0, result = true;
	    // Deep compare objects.
	    for (var key in a) {
	      if (hasOwnProperty.call(a, key)) {
	        // Count the expected number of properties.
	        size++;
	        // Deep compare each member.
	        if (!(result = hasOwnProperty.call(b, key) && eq(a[key], b[key], stack))) break;
	      }
	    }
	    // Ensure that both objects contain the same number of properties.
	    if (result) {
	      for (key in b) {
	        if (hasOwnProperty.call(b, key) && !size--) break;
	      }
	      result = !size;
	    }
	    // Remove the first object from the stack of traversed objects.
	    stack.pop();
	    return result;
	  }

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b, []);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
	    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
	    return true;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType == 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) == '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    return obj === Object(obj);
	  };

	  // Is a given variable an arguments object?
	  if (toString.call(arguments) == '[object Arguments]') {
	    _.isArguments = function(obj) {
	      return toString.call(obj) == '[object Arguments]';
	    };
	  } else {
	    _.isArguments = function(obj) {
	      return !!(obj && hasOwnProperty.call(obj, 'callee'));
	    };
	  }

	  // Is a given value a function?
	  _.isFunction = function(obj) {
	    return toString.call(obj) == '[object Function]';
	  };

	  // Is a given value a string?
	  _.isString = function(obj) {
	    return toString.call(obj) == '[object String]';
	  };

	  // Is a given value a number?
	  _.isNumber = function(obj) {
	    return toString.call(obj) == '[object Number]';
	  };

	  // Is the given value `NaN`?
	  _.isNaN = function(obj) {
	    // `NaN` is the only value for which `===` is not reflexive.
	    return obj !== obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	  };

	  // Is a given value a date?
	  _.isDate = function(obj) {
	    return toString.call(obj) == '[object Date]';
	  };

	  // Is the given value a regular expression?
	  _.isRegExp = function(obj) {
	    return toString.call(obj) == '[object RegExp]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iterators.
	  _.identity = function(value) {
	    return value;
	  };

	  // Run a function **n** times.
	  _.times = function (n, iterator, context) {
	    for (var i = 0; i < n; i++) iterator.call(context, i);
	  };

	  // Escape a string for HTML interpolation.
	  _.escape = function(string) {
	    return (''+string).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
	  };

	  // Add your own custom functions to the Underscore object, ensuring that
	  // they're correctly added to the OOP wrapper as well.
	  _.mixin = function(obj) {
	    each(_.functions(obj), function(name){
	      addToWrapper(name, _[name] = obj[name]);
	    });
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = idCounter++;
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  _.template = function(str, data) {
	    var c  = _.templateSettings;
	    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
	      'with(obj||{}){__p.push(\'' +
	      str.replace(/\\/g, '\\\\')
	         .replace(/'/g, "\\'")
	         .replace(c.escape, function(match, code) {
	           return "',_.escape(" + code.replace(/\\'/g, "'") + "),'";
	         })
	         .replace(c.interpolate, function(match, code) {
	           return "'," + code.replace(/\\'/g, "'") + ",'";
	         })
	         .replace(c.evaluate || null, function(match, code) {
	           return "');" + code.replace(/\\'/g, "'")
	                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
	         })
	         .replace(/\r/g, '\\r')
	         .replace(/\n/g, '\\n')
	         .replace(/\t/g, '\\t')
	         + "');}return __p.join('');";
	    var func = new Function('obj', tmpl);
	    return data ? func(data) : func;
	  };

	  // The OOP Wrapper
	  // ---------------

	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	  var wrapper = function(obj) { this._wrapped = obj; };

	  // Expose `wrapper.prototype` as `_.prototype`
	  _.prototype = wrapper.prototype;

	  // Helper function to continue chaining intermediate results.
	  var result = function(obj, chain) {
	    return chain ? _(obj).chain() : obj;
	  };

	  // A method to easily add functions to the OOP wrapper.
	  var addToWrapper = function(name, func) {
	    wrapper.prototype[name] = function() {
	      var args = slice.call(arguments);
	      unshift.call(args, this._wrapped);
	      return result(func.apply(_, args), this._chain);
	    };
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    wrapper.prototype[name] = function() {
	      method.apply(this._wrapped, arguments);
	      return result(this._wrapped, this._chain);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    wrapper.prototype[name] = function() {
	      return result(method.apply(this._wrapped, arguments), this._chain);
	    };
	  });

	  // Start chaining a wrapped Underscore object.
	  wrapper.prototype.chain = function() {
	    this._chain = true;
	    return this;
	  };

	  // Extracts the result from a wrapped and chained object.
	  wrapper.prototype.value = function() {
	    return this._wrapped;
	  };

	})();


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */

	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];

	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};

	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*globals Handlebars: true */
	var base = __webpack_require__(13);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)
	var SafeString = __webpack_require__(14)["default"];
	var Exception = __webpack_require__(15)["default"];
	var Utils = __webpack_require__(16);
	var runtime = __webpack_require__(17);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	var create = function() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = SafeString;
	  hb.Exception = Exception;
	  hb.Utils = Utils;

	  hb.VM = runtime;
	  hb.template = function(spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	};

	var Handlebars = create();
	Handlebars.create = create;

	exports["default"] = Handlebars;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(16);
	var Exception = __webpack_require__(15)["default"];

	var VERSION = "1.3.0";
	exports.VERSION = VERSION;var COMPILER_REVISION = 4;
	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '>= 1.0.0'
	};
	exports.REVISION_CHANGES = REVISION_CHANGES;
	var isArray = Utils.isArray,
	    isFunction = Utils.isFunction,
	    toString = Utils.toString,
	    objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};

	  registerDefaultHelpers(this);
	}

	exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: logger,
	  log: log,

	  registerHelper: function(name, fn, inverse) {
	    if (toString.call(name) === objectType) {
	      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
	      Utils.extend(this.helpers, name);
	    } else {
	      if (inverse) { fn.not = inverse; }
	      this.helpers[name] = fn;
	    }
	  },

	  registerPartial: function(name, str) {
	    if (toString.call(name) === objectType) {
	      Utils.extend(this.partials,  name);
	    } else {
	      this.partials[name] = str;
	    }
	  }
	};

	function registerDefaultHelpers(instance) {
	  instance.registerHelper('helperMissing', function(arg) {
	    if(arguments.length === 2) {
	      return undefined;
	    } else {
	      throw new Exception("Missing helper: '" + arg + "'");
	    }
	  });

	  instance.registerHelper('blockHelperMissing', function(context, options) {
	    var inverse = options.inverse || function() {}, fn = options.fn;

	    if (isFunction(context)) { context = context.call(this); }

	    if(context === true) {
	      return fn(this);
	    } else if(context === false || context == null) {
	      return inverse(this);
	    } else if (isArray(context)) {
	      if(context.length > 0) {
	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      return fn(context);
	    }
	  });

	  instance.registerHelper('each', function(context, options) {
	    var fn = options.fn, inverse = options.inverse;
	    var i = 0, ret = "", data;

	    if (isFunction(context)) { context = context.call(this); }

	    if (options.data) {
	      data = createFrame(options.data);
	    }

	    if(context && typeof context === 'object') {
	      if (isArray(context)) {
	        for(var j = context.length; i<j; i++) {
	          if (data) {
	            data.index = i;
	            data.first = (i === 0);
	            data.last  = (i === (context.length-1));
	          }
	          ret = ret + fn(context[i], { data: data });
	        }
	      } else {
	        for(var key in context) {
	          if(context.hasOwnProperty(key)) {
	            if(data) { 
	              data.key = key; 
	              data.index = i;
	              data.first = (i === 0);
	            }
	            ret = ret + fn(context[key], {data: data});
	            i++;
	          }
	        }
	      }
	    }

	    if(i === 0){
	      ret = inverse(this);
	    }

	    return ret;
	  });

	  instance.registerHelper('if', function(conditional, options) {
	    if (isFunction(conditional)) { conditional = conditional.call(this); }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function(conditional, options) {
	    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
	  });

	  instance.registerHelper('with', function(context, options) {
	    if (isFunction(context)) { context = context.call(this); }

	    if (!Utils.isEmpty(context)) return options.fn(context);
	  });

	  instance.registerHelper('log', function(context, options) {
	    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
	    instance.log(level, context);
	  });
	}

	var logger = {
	  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

	  // State enum
	  DEBUG: 0,
	  INFO: 1,
	  WARN: 2,
	  ERROR: 3,
	  level: 3,

	  // can be overridden in the host environment
	  log: function(level, obj) {
	    if (logger.level <= level) {
	      var method = logger.methodMap[level];
	      if (typeof console !== 'undefined' && console[method]) {
	        console[method].call(console, obj);
	      }
	    }
	  }
	};
	exports.logger = logger;
	function log(level, obj) { logger.log(level, obj); }

	exports.log = log;var createFrame = function(object) {
	  var obj = {};
	  Utils.extend(obj, object);
	  return obj;
	};
	exports.createFrame = createFrame;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// Build out our basic SafeString type
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = function() {
	  return "" + this.string;
	};

	exports["default"] = SafeString;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var line;
	  if (node && node.firstLine) {
	    line = node.firstLine;

	    message += ' - ' + line + ':' + node.firstColumn;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  if (line) {
	    this.lineNumber = line;
	    this.column = node.firstColumn;
	  }
	}

	Exception.prototype = new Error();

	exports["default"] = Exception;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint -W004 */
	var SafeString = __webpack_require__(14)["default"];

	var escape = {
	  "&": "&amp;",
	  "<": "&lt;",
	  ">": "&gt;",
	  '"': "&quot;",
	  "'": "&#x27;",
	  "`": "&#x60;"
	};

	var badChars = /[&<>"'`]/g;
	var possible = /[&<>"'`]/;

	function escapeChar(chr) {
	  return escape[chr] || "&amp;";
	}

	function extend(obj, value) {
	  for(var key in value) {
	    if(Object.prototype.hasOwnProperty.call(value, key)) {
	      obj[key] = value[key];
	    }
	  }
	}

	exports.extend = extend;var toString = Object.prototype.toString;
	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	var isFunction = function(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	if (isFunction(/x/)) {
	  isFunction = function(value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	var isFunction;
	exports.isFunction = isFunction;
	var isArray = Array.isArray || function(value) {
	  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
	};
	exports.isArray = isArray;

	function escapeExpression(string) {
	  // don't escape SafeStrings, since they're already safe
	  if (string instanceof SafeString) {
	    return string.toString();
	  } else if (!string && string !== 0) {
	    return "";
	  }

	  // Force a string conversion as this will be done by the append regardless and
	  // the regex test will do this transparently behind the scenes, causing issues if
	  // an object's to string has escaped characters in it.
	  string = "" + string;

	  if(!possible.test(string)) { return string; }
	  return string.replace(badChars, escapeChar);
	}

	exports.escapeExpression = escapeExpression;function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	exports.isEmpty = isEmpty;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(16);
	var Exception = __webpack_require__(15)["default"];
	var COMPILER_REVISION = __webpack_require__(13).COMPILER_REVISION;
	var REVISION_CHANGES = __webpack_require__(13).REVISION_CHANGES;

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = COMPILER_REVISION;

	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = REVISION_CHANGES[currentRevision],
	          compilerVersions = REVISION_CHANGES[compilerRevision];
	      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
	            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
	            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
	    }
	  }
	}

	exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

	function template(templateSpec, env) {
	  if (!env) {
	    throw new Exception("No environment passed to template");
	  }

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
	    var result = env.VM.invokePartial.apply(this, arguments);
	    if (result != null) { return result; }

	    if (env.compile) {
	      var options = { helpers: helpers, partials: partials, data: data };
	      partials[name] = env.compile(partial, { data: data !== undefined }, env);
	      return partials[name](context, options);
	    } else {
	      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
	    }
	  };

	  // Just add water
	  var container = {
	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,
	    programs: [],
	    program: function(i, fn, data) {
	      var programWrapper = this.programs[i];
	      if(data) {
	        programWrapper = program(i, fn, data);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = program(i, fn);
	      }
	      return programWrapper;
	    },
	    merge: function(param, common) {
	      var ret = param || common;

	      if (param && common && (param !== common)) {
	        ret = {};
	        Utils.extend(ret, common);
	        Utils.extend(ret, param);
	      }
	      return ret;
	    },
	    programWithDepth: env.VM.programWithDepth,
	    noop: env.VM.noop,
	    compilerInfo: null
	  };

	  return function(context, options) {
	    options = options || {};
	    var namespace = options.partial ? options : env,
	        helpers,
	        partials;

	    if (!options.partial) {
	      helpers = options.helpers;
	      partials = options.partials;
	    }
	    var result = templateSpec.call(
	          container,
	          namespace, context,
	          helpers,
	          partials,
	          options.data);

	    if (!options.partial) {
	      env.VM.checkRevision(container.compilerInfo);
	    }

	    return result;
	  };
	}

	exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
	  var args = Array.prototype.slice.call(arguments, 3);

	  var prog = function(context, options) {
	    options = options || {};

	    return fn.apply(this, [context, options.data || data].concat(args));
	  };
	  prog.program = i;
	  prog.depth = args.length;
	  return prog;
	}

	exports.programWithDepth = programWithDepth;function program(i, fn, data) {
	  var prog = function(context, options) {
	    options = options || {};

	    return fn(context, options.data || data);
	  };
	  prog.program = i;
	  prog.depth = 0;
	  return prog;
	}

	exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
	  var options = { partial: true, helpers: helpers, partials: partials, data: data };

	  if(partial === undefined) {
	    throw new Exception("The partial " + name + " could not be found");
	  } else if(partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	exports.invokePartial = invokePartial;function noop() { return ""; }

	exports.noop = noop;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};

	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;

	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }

	    if (canPost) {
	        var queue = [];
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);

	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }

	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	}

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};


/***/ }
/******/ ])