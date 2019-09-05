/** @module window.plugins.SharedPreferences */

var exec = require("cordova/exec");

var SERVICE = "UserPreferences";

/**
 * Sets the serverUrl the preferences.
 *
 * @function
 * @param {Boolean} value The new value for the preference.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
exports.setServerUrl = createSetter(isString, "setServerUrl");

/**
 * Sets the appActivityUrl the preferences.
 *
 * @function
 * @param {Boolean} value The new value for the preference.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
exports.setAppActivityUrl = createSetter(isString, "setAppActivityUrl");

/**
 * Sets the Yona password in the preferences.
 *
 * @function
 * @param {Boolean} value The new value for the preference.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
exports.setYonaPassword = createSetter(isString, "setYonaPassword");

/**
 * Removes all values from the preferences.
 *
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
exports.clear = function(successCallback, aErrorCallback) {
  var errorCallback = aErrorCallback || noop;

  if (!isFunction(successCallback)) {
    throw new TypeError(
      "Missing or invalid argument, 'successCallback'. Function expected."
    );
  }

  if (!isFunction(errorCallback)) {
    throw new TypeError(
      "Invalid argument, 'errorCallback'. Function expected."
    );
  }

  var onError = function(errMessage) {
    errorCallback(toError(errMessage));
  };
  exec(successCallback, onError, SERVICE, "clear", [this.name]);
};

function createSetter(validator, action) {
  return function(value, aSuccessCallback, aErrorCallback) {
    var successCallback = aSuccessCallback || noop;
    var errorCallback = aErrorCallback || noop;

    if (!isFunction(successCallback)) {
      throw new TypeError(
        "Missing or invalid argument, 'successCallback'. Function expected."
      );
    }

    if (!isFunction(errorCallback)) {
      throw new TypeError(
        "Invalid argument, 'errorCallback'. Function expected."
      );
    }

    if (!validator(value)) {
      errorCallback(new TypeError("Invalid argument, 'value'."));
      return;
    }

    var onSuccess = function() {
      successCallback();
    };
    var onError = function(errMessage) {
      errorCallback(toError(errMessage));
    };
    exec(onSuccess, onError, SERVICE, action, [value]);
  };
}

function isFunction(value) {
  return typeof value === "function";
}

function isString(value) {
  return typeof value === "string";
}

function noop() {}

function toError(errMessage) {
  return new Error(errMessage);
}
