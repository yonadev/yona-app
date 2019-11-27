package com.yona.plugin.services;

import android.app.Activity;
import android.app.AppOpsManager;
import android.content.Context;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;

import android.os.Build;
import android.provider.Settings;

import androidx.core.app.NotificationManagerCompat;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import com.yona.plugin.services.api.receiver.YonaReceiver;
import com.yona.plugin.services.utils.AppUtils;
import com.yona.plugin.services.utils.Logger;

import nu.yona.app.R;

public class BackgroundMode extends CordovaPlugin {

    public static final String PREFS = "autostart";

    // Plugin namespace
    private static final String JS_NAMESPACE = "cordova.plugins.appUsage";

    // Flag indicates if the plugin is enabled or disabled
    private boolean isDisabled = true;

    // Flag indicates if the service is bind
    private boolean isBind = false;

    // Default settings for the notification
    private static JSONObject defaultSettings = new JSONObject();

    // Service that keeps the app awake
    private AppMonitoringService service;


    /**
     * Executes the request.
     *
     * @param action   The action to execute.
     * @param args     The exec() arguments.
     * @param callback The callback context used when
     *                 calling back into JavaScript.
     *
     * @return Returning false results in a "MethodNotFound" error.
     */
    @Override
    public boolean execute (String action, JSONArray args,
                            CallbackContext callback) throws JSONException {

        Logger.logi(BackgroundMode.class, "Received action: " + action);

        if ( action.equalsIgnoreCase("configure") ) {
            configure(args.optJSONObject(0), args.optBoolean(1));
            return true;
        } else if ( action.equalsIgnoreCase("enable") ) {
            enableServices();
            return true;
        }  else if ( action.equalsIgnoreCase("disable") ) {
            disableServices();
            return true;
        } else if ( action.equalsIgnoreCase("checkUsageAccess") ) {
            this.checkUsageAccess(callback);
            return true;
        } else if ( action.equalsIgnoreCase("getUsageAccess") ) {
            this.getUsageAccess(callback);
            return true;
        } else if ( action.equalsIgnoreCase("postActivitiesToServer") ) {
            this.postActivitiesToServer(callback);
            return true;
        } else if ( action.equalsIgnoreCase("createNotificationChannel") ) {
            this.createNotificationChannel(callback);
            return true;
        } else if ( action.equalsIgnoreCase("showNotification") ) {
            String title = args.optString(0);
            String message = args.optString(1);
            this.showNotification(callback, title, message);
            return true;
        }

        return false;
    }

    private void enableServices() {
        setEnabled(true);
    }

    private void disableServices() {
        setEnabled(false);
    }

    private void setEnabled(boolean enabled) {
        Context context = cordova.getActivity().getApplicationContext();
        int componentState;
        isDisabled = !enabled;

        if ( enabled ) {
            componentState = PackageManager.COMPONENT_ENABLED_STATE_ENABLED;
            Logger.logi(BackgroundMode.class, "set Component enabled");
            checkForNotificationPermission();
            AppUtils.startService(context);
        } else {
            componentState = PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
            AppUtils.stopService(context);
        }

        // Enable or Disable BootCompletedReceiver
        ComponentName yonaReceiver = new ComponentName(context, YonaReceiver.class);
        PackageManager pm = context.getPackageManager();
        pm.setComponentEnabledSetting(yonaReceiver, componentState, PackageManager.DONT_KILL_APP);
    }

    private void checkForNotificationPermission()
    {
        Context context = cordova.getActivity();
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O || (NotificationManagerCompat.from(context.getApplicationContext()).areNotificationsEnabled() && AppUtils.arePersistentNotificationsEnabled(context)))
        {
            return;
        }
        Logger.loge(BackgroundMode.class, "Yona cannot monitor app activity because notifications for the Yona application have been disabled. Enable notifications for Yona again in the device settings.");
    }

    private void checkUsageAccess(CallbackContext callbackContext) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            boolean hasAccess = hasUsageAccess();
            callbackContext.success((hasAccess ? "true" : "false"));
        }
    }

    private void getUsageAccess(CallbackContext callbackContext) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            if (!hasUsageAccess()) {
                openPermissionSettings(callbackContext);
            } else {
                callbackContext.success("true");
            }
        }
    }


    private boolean hasUsageAccess() {
        try {
            Context context = cordova.getActivity().getApplicationContext();
            PackageManager pm = context.getPackageManager();
            ApplicationInfo applicationInfo = pm.getApplicationInfo(context.getPackageName(), 0);
            AppOpsManager appOpsManager = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOpsManager.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, applicationInfo.uid, applicationInfo.packageName);
            return (mode == AppOpsManager.MODE_ALLOWED);

        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    private void postActivitiesToServer(CallbackContext callbackContext) {
        Context context = this.cordova.getActivity().getApplicationContext();
        AppUtils.sendLogToServer(context, 0);
        callbackContext.success("true");
    }

    private void createNotificationChannel(CallbackContext callbackContext) {
        Context context = this.cordova.getActivity().getApplicationContext();
        AppUtils.createNotificationChanngel(context);
        callbackContext.success("true");
    }

    private void showNotification(CallbackContext callbackContext, String title, String message) {
        Context context = this.cordova.getActivity().getApplicationContext();
        AppUtils.showNotification(context, message, title);
        callbackContext.success("true");
    }

    /**
     * Launch UsageStatsManager settings
     * @return
     */
    private void openPermissionSettings(CallbackContext callbackContext){
        try {

            Context context = this.cordova.getActivity().getApplicationContext();
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            callbackContext.success("true");
        } catch(Exception e){
            e.printStackTrace();
            callbackContext.error(e.toString());
        }

    }

    /**
     * Update the default settings and configure the notification.
     *
     * @param settings The settings
     * @param update A truthy value means to update the running service.
     */
    private void configure(JSONObject settings, boolean update)
    {
        if (update) {
            updateNotification(settings);
        } else {
            setDefaultSettings(settings);
        }
    }

    /**
     * Update the default settings for the notification.
     *
     * @param settings The new default settings
     */
    private void setDefaultSettings(JSONObject settings)
    {
        defaultSettings = settings;
    }

    /**
     * Returns the settings for the new/updated notification.
     */
    static JSONObject getSettings () {
        return defaultSettings;
    }

    /**
     * Update the notification.
     *
     * @param settings The config settings
     */
    private void updateNotification(JSONObject settings)
    {
        if (isBind) {
            //service.updateNotification(settings);
        }
    }
}
