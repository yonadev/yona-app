var exec = require("cordova/exec");

window.UsageStatistics = {
  getUsageStatistics: function(interval, success, error) {
    console.log("getUsageStatistics() :: " + interval);
    var array = [interval];
    exec(success, error, "AppUsagePlugin", "getUsageStatistics", array);
  },

  openPermissionSettings: function(success, error) {
    console.log("openPermissionSettings() :: ");
    var array = []; // not needed but seems to throw exceptions on some cases if not included.
    exec(
      success,
      error,
      "AppUsagePlugin",
      "openPermissionSettings",
      array
    );
  },

  getCurrentApp: function(success, error) {
    console.log("getCurrentApp() :: ");
    var array = []; // not needed but seems to throw exceptions on some cases if not included.
    exec(
      success,
      error,
      "AppUsagePlugin",
      "getCurrentApp",
      array
    );
  }
};
