/*! opening-hours - v1.0.0 - 2015-01-30
* see: https://github.com/lukasz-si/opening-hours
* Copyright (c) 2015 Lukasz
* Licensed: The MIT License (MIT) */
(function(root, factory) {

    // Set up the app appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define("OpeningHours", ['jquery'], function($) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global openingHours.
            // root.OpeningHours = factory(root, $);
            return factory(root, $);
        });
    } else {
        root.OpeningHours = factory(root, (root.jQuery || root.$));
    }

}(this, function(root, $) {
/**
* almond 0.1.2 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
	* Available via the MIT or new BSD license.
	* see: http://github.com/jrburke/almond for details
	*/
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
	var defined = {},
		waiting = {},
		config = {},
		defining = {},
		aps = [].slice,
		main, req;

	/**
	 * Given a relative module name, like ./something, normalize it to
	 * a real name that can be mapped to a path.
	 * @param {String} name the relative name
	 * @param {String} baseName a real name that the name arg is relative
	 * to.
	 * @returns {String} normalized name
	 */
	function normalize(name, baseName) {
		var baseParts = baseName && baseName.split("/"),
			map = config.map,
			starMap = (map && map['*']) || {},
			nameParts, nameSegment, mapValue, foundMap,
			foundI, foundStarMap, starI, i, j, part;

		//Adjust any relative paths.
		if (name && name.charAt(0) === ".") {
			//If have a base name, try to normalize against it,
			//otherwise, assume it is a top-level require that will
			//be relative to baseUrl in the end.
			if (baseName) {
				//Convert baseName to array, and lop off the last part,
				//so that . matches that "directory" and not name of the baseName's
				//module. For instance, baseName of "one/two/three", maps to
				//"one/two/three.js", but we want the directory, "one/two" for
				//this normalization.
				baseParts = baseParts.slice(0, baseParts.length - 1);

				name = baseParts.concat(name.split("/"));

				//start trimDots
				for (i = 0; (part = name[i]); i++) {
					if (part === ".") {
						name.splice(i, 1);
						i -= 1;
					} else if (part === "..") {
						if (i === 1 && (name[2] === '..' || name[0] === '..')) {
							//End of the line. Keep at least one non-dot
							//path segment at the front so it can be mapped
							//correctly to disk. Otherwise, there is likely
							//no path mapping for a path starting with '..'.
							//This can still fail, but catches the most reasonable
							//uses of ..
							return true;
						} else if (i > 0) {
							name.splice(i - 1, 2);
							i -= 2;
						}
					}
				}
				//end trimDots

				name = name.join("/");
			}
		}

		//Apply map config if available.
		if ((baseParts || starMap) && map) {
			nameParts = name.split('/');

			for (i = nameParts.length; i > 0; i -= 1) {
				nameSegment = nameParts.slice(0, i).join("/");

				if (baseParts) {
					//Find the longest baseName segment match in the config.
					//So, do joins on the biggest to smallest lengths of baseParts.
					for (j = baseParts.length; j > 0; j -= 1) {
						mapValue = map[baseParts.slice(0, j).join('/')];

						//baseName segment has  config, find if it has one for
						//this name.
						if (mapValue) {
							mapValue = mapValue[nameSegment];
							if (mapValue) {
								//Match, update name to the new value.
								foundMap = mapValue;
								foundI = i;
								break;
							}
						}
					}
				}

				if (foundMap) {
					break;
				}

				//Check for a star map match, but just hold on to it,
				//if there is a shorter segment match later in a matching
				//config, then favor over this star map.
				if (!foundStarMap && starMap && starMap[nameSegment]) {
					foundStarMap = starMap[nameSegment];
					starI = i;
				}
			}

			if (!foundMap && foundStarMap) {
				foundMap = foundStarMap;
				foundI = starI;
			}

			if (foundMap) {
				nameParts.splice(0, foundI, foundMap);
				name = nameParts.join('/');
			}
		}

		return name;
	}

	function makeRequire(relName, forceSync) {
		return function () {
			//A version of a require function that passes a moduleName
			//value for items that may need to
			//look up paths relative to the moduleName
			return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
		};
	}

	function makeNormalize(relName) {
		return function (name) {
			return normalize(name, relName);
		};
	}

	function makeLoad(depName) {
		return function (value) {
			defined[depName] = value;
		};
	}

	function callDep(name) {
		if (waiting.hasOwnProperty(name)) {
			var args = waiting[name];
			delete waiting[name];
			defining[name] = true;
			main.apply(undef, args);
		}

		if (!defined.hasOwnProperty(name)) {
			throw new Error('No ' + name);
		}
		return defined[name];
	}

	/**
	 * Makes a name map, normalizing the name, and using a plugin
	 * for normalization if necessary. Grabs a ref to plugin
	 * too, as an optimization.
	 */
	function makeMap(name, relName) {
		var prefix, plugin,
			index = name.indexOf('!');

		if (index !== -1) {
			prefix = normalize(name.slice(0, index), relName);
			name = name.slice(index + 1);
			plugin = callDep(prefix);

			//Normalize according
			if (plugin && plugin.normalize) {
				name = plugin.normalize(name, makeNormalize(relName));
			} else {
				name = normalize(name, relName);
			}
		} else {
			name = normalize(name, relName);
		}

		//Using ridiculous property names for space reasons
		return {
			f: prefix ? prefix + '!' + name : name, //fullName
			n: name,
			p: plugin
		};
	}

	function makeConfig(name) {
		return function () {
			return (config && config.config && config.config[name]) || {};
		};
	}

	main = function (name, deps, callback, relName) {
		var args = [],
			usingExports,
			cjsModule, depName, ret, map, i;

		//Use name if no relName
		relName = relName || name;

		//Call the callback to define the module, if necessary.
		if (typeof callback === 'function') {

			//Pull out the defined dependencies and pass the ordered
			//values to the callback.
			//Default to [require, exports, module] if no deps
			deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
			for (i = 0; i < deps.length; i++) {
				map = makeMap(deps[i], relName);
				depName = map.f;

				//Fast path CommonJS standard dependencies.
				if (depName === "require") {
					args[i] = makeRequire(name);
				} else if (depName === "exports") {
					//CommonJS module spec 1.1
					args[i] = defined[name] = {};
					usingExports = true;
				} else if (depName === "module") {
					//CommonJS module spec 1.1
					cjsModule = args[i] = {
						id: name,
						uri: '',
						exports: defined[name],
						config: makeConfig(name)
					};
				} else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
					args[i] = callDep(depName);
				} else if (map.p) {
					map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
					args[i] = defined[depName];
				} else if (!defining[depName]) {
					throw new Error(name + ' missing ' + depName);
				}
			}

			ret = callback.apply(defined[name], args);

			if (name) {
				//If setting exports via "module" is in play,
				//favor that over return value and exports. After that,
				//favor a non-undefined return value over exports use.
				if (cjsModule && cjsModule.exports !== undef &&
					cjsModule.exports !== defined[name]) {
					defined[name] = cjsModule.exports;
				} else if (ret !== undef || !usingExports) {
					//Use the return value from the function.
					defined[name] = ret;
				}
			}
		} else if (name) {
			//May just be an object definition for the module. Only
			//worry about defining if have a module name.
			defined[name] = callback;
		}
	};

	requirejs = require = req = function (deps, callback, relName, forceSync) {
		if (typeof deps === "string") {
			//Just return the module wanted. In this scenario, the
			//deps arg is the module name, and second arg (if passed)
			//is just the relName.
			//Normalize module name, if it contains . or ..
			return callDep(makeMap(deps, callback).f);
		} else if (!deps.splice) {
			//deps is a config object, not an array.
			config = deps;
			if (callback.splice) {
				//callback is an array, which means it is a dependency list.
				//Adjust args if there are dependencies
				deps = callback;
				callback = relName;
				relName = null;
			} else {
				deps = undef;
			}
		}

		//Support require(['a'])
		callback = callback || function () {};

		//Simulate async callback;
		if (forceSync) {
			main(undef, deps, callback, relName);
		} else {
			setTimeout(function () {
				main(undef, deps, callback, relName);
			}, 15);
		}

		return req;
	};

	/**
	 * Just drops the config on the floor, but returns req in case
	 * the config return value is used.
	 */
	req.config = function (cfg) {
		config = cfg;
		return req;
	};

	define = function (name, deps, callback) {

		//This module may not have dependencies
		if (!deps.splice) {
			//deps is not an array, so probably means
			//an object literal or factory function for
			//the value. Adjust args.
			callback = deps;
			deps = [];
		}

		waiting[name] = [name, deps, callback];
	};

	define.amd = {
		jQuery: true
	};
}());
define("../tools/almond", function(){});

/**
 * Created by meep_sitl on 26/01/15.
 */
define('js/OpeningHours',[
    "jquery"
], function ($) {
    

    var mainTemplate = "<div class='opening-hours'><div class='title'></div><div class='days'></div><div class='hours'></div></div>",
        dayTemplate = "<div class='day-wrapper'><div class='day'></div><div class='arrow-down'></div></div>",
        OpeningHours;


    OpeningHours = function (element, options) {

        var $daysContainer, $days, that = this, selectedDay;

        this.options = $.extend({}, OpeningHours.DEFAULT_OPTIONS, options);
        this.validateOptions(this.options);

        this.$el = $(element);
        this.$el.html(mainTemplate);
        $daysContainer = this.$el.find(".days");
        this.$hoursContainer = this.$el.find(".hours");
        this.$el.find(".title").text(this.options.title);

        /** creating days */
        $.each(this.options.days, function (index, value) {
            var $day = $(dayTemplate);

            if (!that.options.firstDaySunday) {
                index = (index === 6) ? 0 : ++index;
            }

            value.id = index;

            $day
                .data("day", value)
                .find(".day")
                .text(value.name || "-")
                .css({width: that.options.cellWidth, height: that.options.cellHeight});

            if (value.hours === null) {
                $day.addClass("closed");
            }

            $daysContainer.append($day);
        });

        $days = $daysContainer.find(".day-wrapper");

        /** if "selectedDay" is not a number then current day is taken into account */
        if (this.options.selectedDay === null || isNaN(this.options.selectedDay)) {
            this.selectDay(new Date().getDay());
        } else {
            selectedDay = this.options.selectedDay >= 0 && this.options.selectedDay <= 6 ? this.options.selectedDay : 0;
            this.selectDay(selectedDay);
        }

        /** adding user's css selector */
        if (this.options.cssStyle) {
            this.$el.find(".opening-hours").addClass(this.options.cssStyle);
        }

        /** on click listener */
        $days.click(function () {
            var $this = $(this),
                index;

            if ($this.hasClass("selected")) {
                return false;
            }

            index = $this.data("day").id;
            if (isNaN(index)) {
                index = 0;
            }
            that.selectDay(index);

            return false;
        });
    };

    OpeningHours.prototype.selectDay = function (day) {
        var hours, $days, that = this;

        $days = this.$el.find(".day-wrapper").removeClass("selected");

        $days.each(function () {
            var $this = $(this),
                data = $this.data("day"),
                index = data.id;

            if (index === day) {
                $this.addClass("selected");
                hours = data.hours;
                if (hours === null || hours === undefined) {
                    hours = that.options.closedMsg;
                }
                that.$hoursContainer.text(hours);

                return false;
            }

            return true;
        });
    };

    OpeningHours.prototype.validateOptions = function (options) {
        if (options.days.length !== 7) {
            this._throwError('number of days must be equal 7')
        }
    };

    OpeningHours.prototype._throwError = function (msg) {
        throw Error(msg);
    };

    OpeningHours.DEFAULT_OPTIONS = {
        title: "Opening hours", /** the title of */
        closedMsg: "Closed", /** the message is shown when "hours" property is null */
        days: [
        /** describes all days of a week */
            {name: "Mo", hours: "10:00 - 18:00"},
        /** "name" points a name of a day */
            {name: "Tu", hours: "10:00 - 18:00"},
            {name: "We", hours: "10:00 - 18:00"},
            {name: "Th", hours: "10:00 - 18:00"},
            {name: "Fr", hours: "10:00 - 18:00"},
            {name: "Sa", hours: null},
        /** if "hours" is null then "closedMsg" is shown */
            {name: "Su", hours: null}
        ],
        cellWidth: "35px", /** cell width */
        cellHeight: "30px", /** cell height */
        selectedDay: null, /** indicates which day should be selected on start, Sunday is 0, Monday is 1, etc. */
        firstDaySunday: false, /** indicates if the first day of a week is Sunday */
        cssStyle: ""                                 /** adds user custom css selector just to easily override default styles */
    };

    return OpeningHours;
});


    define("jquery", function () {
        return $;
    });

    return require("js/OpeningHours");
}));