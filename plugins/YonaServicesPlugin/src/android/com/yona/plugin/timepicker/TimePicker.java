package com.yona.plugin.timepicker;

import android.content.DialogInterface;
import android.graphics.Color;

import com.yona.plugin.services.utils.Logger;
import com.yona.plugin.timepicker.utils.TimeUtils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import nu.yona.timepicker.time.TimePickerDialog;
import nu.yona.timepicker.time.Timepoint;

public class TimePicker extends CordovaPlugin {

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) {
        if (action.equals("pick")) {
            PickerOptions pickerOptions = parseOptions(args);
            selectTime(pickerOptions, callbackContext);
        }
        return true;
    }

    private PickerOptions parseOptions(JSONArray args) {
        PickerOptions pickerOptions = new PickerOptions();
        JSONObject json = null;

        try {
            json = args.getJSONObject(0);
        } catch (JSONException e) {
            Logger.loge(TimePicker.class, "couldn't parse picker options");
        }

        if (json != null) {
            try {
                pickerOptions.setStartTime(json.getString("startTime"));
            } catch (JSONException e) {
                pickerOptions.setStartTime("00:00");
            }

            try {
                pickerOptions.setEndTime(json.getString("endTime"));
            } catch (JSONException e) {
                pickerOptions.setEndTime("00:00");
            }
        }

        return pickerOptions;
    }

    private void selectTime(PickerOptions options, CallbackContext callbackContext) {

        Timepoint startTime = TimeUtils.getTimeInMilliseconds(options.getStartTime());
        Timepoint endTime = TimeUtils.getTimeInMilliseconds(options.getEndTime());

        showTimePicker(true, 15, startTime,endTime, new TimePickerDialog.OnTimeSelected()
        {
            @Override
            public void setTime(Timepoint firstTime, Timepoint secondTime)
            {
                if (firstTime != null && secondTime != null)
                {
                    final PluginResult result = new PluginResult(PluginResult.Status.OK, TimeUtils.mergeZoneTime(firstTime, secondTime));
                    callbackContext.sendPluginResult(result);

                }

            }
        });
    }

    /**
     * Show Timepicker with selection time or default minute
     *
     * @param allowDualSelection
     * @param interval
     * @param maxTime
     * @param minTime
     * @param listener
     */
    private void showTimePicker(boolean allowDualSelection, int interval, Timepoint minTime, Timepoint maxTime, TimePickerDialog.OnTimeSelected listener)
    {
        TimePickerDialog mTimePickerDialog = new TimePickerDialog().newInstance(listener, minTime, maxTime, true, allowDualSelection);
        mTimePickerDialog.setAccentColor(Color.parseColor("#8ab518"));
        mTimePickerDialog.setTimeInterval(1, interval, 1);
        mTimePickerDialog.setOnCancelListener(new DialogInterface.OnCancelListener()
        {
            @Override
            public void onCancel(DialogInterface dialogInterface)
            {
                Logger.logd(TimePicker.class, "TimePicker Dialog was cancelled");
            }
        });

        mTimePickerDialog.show(cordova.getActivity().getFragmentManager(), "Timepickerdialog");
    }
}
