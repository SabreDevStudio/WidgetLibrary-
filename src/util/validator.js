/**
 Air travel domain specific validators.

 Use: call validator.validateIsSomething(arg, 'error message'); If this is not true, then exception (IllegalArgumentException) will be thrown will the specified error message.
 If validation is true, then true will be also returned (but the concept is that we rely on exception to be thrown, not on return value)
 **/
define(['util/exceptions', 'validator_lib', 'moment', 'lodash'], function (ex, v, moment, _) {
    "use strict";

    var CURRENCY_REGEX = new RegExp("^[A-Z]{3}$");
    var AIRPORT_OR_CITY_CODE_REGEX = new RegExp("^[A-Z]{3}$");

    var definedAndMatches = function(arg, regex, err) {
        defined(arg, err);
        if (!regex.test(arg)) {
            throw new ex.IllegalArgumentException(err);
        }
        return true;
    };

    var defined = function(arg, err) {
        if (typeof arg === 'undefined') {
            throw new ex.IllegalArgumentException(err);
        }
        return true;
    };

    var notEmpty = function(arg, err) {
        defined(arg, err);
        if (Object.keys(arg).length === 0) {
            throw new ex.IllegalArgumentException(err);
        }
        return true;
    };

    return {
        notEmpty: notEmpty,
        defined: defined,
        definedAndMatches: definedAndMatches,
        /**
         * one and only one must be defined, not both
         */
        onlyOneDefined: function(arg1, arg2, err) { //TODO: more fluent interface: either.isDefined(arg1).or.isDefined(arg2)
            if ((typeof arg1 === 'undefined') && (typeof arg2 === 'undefined')) {
                throw new ex.IllegalArgumentException(err);
            }
            if (arg1 && arg2) {
                throw new ex.IllegalArgumentException(err);
            }
            return true;
        },
        currencySymbol: function(arg1, err) {
            return definedAndMatches(arg1, CURRENCY_REGEX, err);
        },
        airportCode: function(arg1, err) {
            return definedAndMatches(arg1, AIRPORT_OR_CITY_CODE_REGEX, err);
        },
        arrayHasLength: function (arg, len, err) {
            defined(arg, err);
            if (arg.length !== len) {
                throw new ex.IllegalArgumentException(err);
            }
            return true;
        },
        year: function (year, err) {
            defined(year);
            if (!moment([year, 0, 1]).isValid()) {
                throw new ex.IllegalArgumentException(err);
            }
            return true;
        },
        month: function (month, err) {
            defined(month);
            if (!moment([2000, month, 1]).isValid()) {
                throw new ex.IllegalArgumentException(err);
            }
            return true;
        },
        validDate: function (date, format) {
            if (!moment(date, format).isValid()) {
                throw new ex.IllegalArgumentException("invalid date for date format '" + format + "'");
            }
        },
        // takes two date arguments and date format. validates that first date is not after the second date
        notAfter: function (firstDate, secondDate, dateFormat, firstDateName, secondDateName) {
            var first = moment(firstDate, dateFormat);
            var second = moment(secondDate, dateFormat);
            if (first.isAfter(second)) {
                throw new ex.IllegalArgumentException(firstDateName + "='" + first.format(dateFormat) + "' cannot be after " + secondDateName + "='" +second.format(dateFormat) + "'");
            }
        },
        notGreaterThan: function(first, second, firstName, secondName) {
            if (first > second) {
                throw new ex.IllegalArgumentException(firstName + ": " + first + " cannot be greater than " + secondName + ": " + second);
            }
        },
        function: function (arg) {
            if (!_.isFunction(arg)) {
                throw new ex.IllegalArgumentException('Provided argument ' + arg + ' is not a function. Function required');
            }
        },
        notLowerThan: function (first, second) {
            if (first < second) {
                throw new ex.IllegalArgumentException(first + ' cannot be lower than ' + second);
            }
        }
    };
});