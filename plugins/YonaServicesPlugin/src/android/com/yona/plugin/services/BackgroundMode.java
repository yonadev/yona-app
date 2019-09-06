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
import android.os.IBinder;
import android.provider.Settings;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import com.yona.plugin.services.AppMonitoringService.ForegroundBinder;
import com.yona.plugin.services.api.receiver.YonaReceiver;
import com.yona.plugin.services.utils.Logger;

import static android.content.Context.BIND_AUTO_CREATE;

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

    // Used to (un)bind the service to with the activity
    private final ServiceConnection connection = new ServiceConnection()
    {
        @Override
        public void onServiceConnected (ComponentName name, IBinder service)
        {
            ForegroundBinder binder = (ForegroundBinder) service;
            BackgroundMode.this.service = binder.getService();
            Logger.logi(BackgroundMode.class, "service connected");
        }

        @Override
        public void onServiceDisconnected (ComponentName name)
        {
            Logger.logi(BackgroundMode.class, "service disconnected");
        }
    };

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
        }

        return false;
    }

    private void enableServices() {
        setEnabled(true);
    }

    private void disableServices() {
        setEnabled(false);
    }

    private void setUserPreferences() {

    }

    private void unsetUserPreferences() {

    }

    private void setEnabled(boolean enabled) {
        Context context = cordova.getActivity().getApplicationContext();
        int componentState;
        isDisabled = !enabled;

        if ( enabled ) {
            componentState = PackageManager.COMPONENT_ENABLED_STATE_ENABLED;
            Logger.logi(BackgroundMode.class, "set Component enabled");
            startService();
        } else {
            componentState = PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
            stopService();
        }

        // Enable or Disable BootCompletedReceiver
        ComponentName yonaReceiver = new ComponentName(context, YonaReceiver.class);
        PackageManager pm = context.getPackageManager();
        pm.setComponentEnabledSetting(yonaReceiver, componentState, PackageManager.DONT_KILL_APP);
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

    /**
     * Launch UsageStatsManager settings
     * @return
     */
    private void openPermissionSettings(CallbackContext callbackContext){
        try {

            Context context = this.cordova.getActivity().getApplicationContext();
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            let result = context.startActivityForResult(intent);
            console.log(result);
            checkUsageAccess(callbackContext);
        } catch(Exception e){
            e.printStackTrace();
            callbackContext.error(e.toString());
        }

    }


    /**
     * Called when the activity will be destroyed.
     */
    @Override
    public void onDestroy()
    {
        stopService();
        android.os.Process.killProcess(android.os.Process.myPid());
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
            service.updateNotification(settings);
        }
    }

    /**
     * Bind the activity to a background service and put them into foreground
     * state.
     */
    private void startService()
    {
        Activity context = cordova.getActivity();

        if (isDisabled || isBind)
            return;

        isBind = true;

        Intent intent = new Intent(context, AppMonitoringService.class);

        Logger.logi(BackgroundMode.class, "Start Service");

        try {
            context.bindService(intent, connection, BIND_AUTO_CREATE);
            context.startService(intent);
        } catch (Exception e) {
            Logger.loge(BackgroundMode.class, e.getMessage());
            isBind = false;
        }
    }

    /**
     * Bind the activity to a background service and put them into foreground
     * state.
     */
    private void stopService()
    {
        Activity context = cordova.getActivity();
        Intent intent    = new Intent(context, AppMonitoringService.class);

        if (!isBind) return;

        context.unbindService(connection);
        context.stopService(intent);

        isBind = false;
    }
}
