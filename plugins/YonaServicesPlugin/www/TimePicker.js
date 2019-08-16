var exec = require("cordova/exec");

var PLUGIN_NAME = "TimePicker";

function getTimeOrNull(time) {
  if (typeof time === "string") {
    return time;
  }
  return null;
}

// options {
//     startTime: String,
//     startTime: String
// }
var DateTimePicker = {
  pick: function(options, userCallback) {
    options.startTime = getTimeOrNull(options.startTime);
    options.endTime = getTimeOrNull(options.endTime);

    function callback(timeString) {
      const parts = timeString.split("-");
      userCallback({ startTime: parts[0], endTime: parts[1] });
    }

    exec(callback, null, PLUGIN_NAME, "pick", [options]);
  }
};

module.exports = DateTimePicker;
