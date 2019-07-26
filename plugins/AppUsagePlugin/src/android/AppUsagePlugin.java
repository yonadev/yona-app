package com.yona.appusage;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.TargetApi;
import android.app.ActivityManager;
import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Build;
import android.os.Process;
import android.provider.Settings;
import android.util.Log;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import android.widget.Toast;
import android.content.Context;


/**
 *
 */
public class AppUsagePlugin extends CordovaPlugin {

    private static final String LOG_TAG = "AppUsagePlugin";

    private static String currentApp;
    UsageStatsManager usm;
    ActivityManager am;

    private void printForegroundTask(CallbackContext callbackContext)
	{
		currentApp = "NULL";
		try
		{
		    if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
			{
                Log.i(LOG_TAG, "Prob higher than lllipiopwer");
			    usm = (UsageStatsManager) this.cordova.getActivity().getApplicationContext().getSystemService(Context.USAGE_STATS_SERVICE); //Context.USAGE_STATS_SERVICE

			    long currentTime = System.currentTimeMillis();
                // get usage stats for the last 10 seconds

                List<UsageStats> stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, currentTime - 1000 * 10, currentTime);
                Log.i(LOG_TAG, stats.toString() );
                // search for app with most recent last used time
                if (stats != null) {
                    Log.i(LOG_TAG, "STATS ARE NOT EMPTY");
                    long lastUsedAppTime = 0;
                    for (UsageStats usageStats : stats) {
                        Log.i(LOG_TAG, usageStats.getPackageName());
                        if (usageStats.getLastTimeUsed() > lastUsedAppTime) {
                            currentApp = usageStats.getPackageName();
                            lastUsedAppTime = usageStats.getLastTimeUsed();
                        }
                    }
                } else {
                    Log.i(LOG_TAG, "THERE ARE NO STATS");
                    return;
                }
			}
			else
			{
				currentApp = am.getRunningAppProcesses().get(0).processName;
			}

            callbackContext.success(currentApp);
		}
		catch (Exception e)
		{
		    Log.i(LOG_TAG, e.toString());
            e.printStackTrace();
            callbackContext.error(e.toString());
		}
	}

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        am = (ActivityManager) this.cordova.getActivity().getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE); //Context.USAGE_STATS_SERVICE
        if (action.equals("getUsageStatistics")) {
            String arg = args.getString(0);
            this.getUsageStatistics(arg, callbackContext);
            return true;
        }else if(action.equals("openPermissionSettings")){
            this.openPermissionSettings(callbackContext);
            return true;
        }else if(action.equals("getCurrentApp")){
            this.printForegroundTask(callbackContext);
            return true;
        }
        return false;
    }

    private void getUsageStatistics(String interval, CallbackContext callbackContext) {
        try{
            Log.i(LOG_TAG, interval);
            StatsUsageInterval statsUsageInterval = StatsUsageInterval.getValue(interval);
            List<UsageStats> usageStatsList = new ArrayList<UsageStats>();
            if (statsUsageInterval != null) {
                usageStatsList = queryUsageStatistics(statsUsageInterval.mInterval);
                Collections.sort(usageStatsList, new LastTimeLaunchedComparatorDesc());
            }
            JSONArray jsonArray = new JSONArray();
            for (UsageStats stat : usageStatsList){
                JSONObject obj = toJSON(stat);
                jsonArray.put(obj);
            }

            String result = jsonArray.toString();
            Log.i(LOG_TAG, result);
            callbackContext.success(result);

        }catch (Exception e){
            e.printStackTrace();
            callbackContext.error(e.toString());
        }
    }


    /**
     * Returns the List of UsageStats including the time span specified by the
     * intervalType argument.
     *
     * @param intervalType The time interval by which the stats are aggregated.
     *                     Corresponding to the value of {@link UsageStatsManager}.
     *                     E.g. {@link UsageStatsManager#INTERVAL_DAILY}, {@link
     *                     UsageStatsManager#INTERVAL_WEEKLY},
     *
     * @return A list of {@link android.app.usage.UsageStats}.
     */
    public List<UsageStats> queryUsageStatistics(int intervalType) {
        // Get the app statistics since one year ago from the current time.
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.YEAR, -1);
        List<UsageStats> queryUsageStats = usm.queryUsageStats(intervalType, cal.getTimeInMillis(), System.currentTimeMillis());
        return queryUsageStats;
    }

    /**
     * The {@link Comparator} to sort a collection of {@link UsageStats} sorted by the timestamp
     * last time the app was used in the descendant order.
     */
    private static class LastTimeLaunchedComparatorDesc implements Comparator<UsageStats> {
        @Override
        public int compare(UsageStats left, UsageStats right) {
            return Long.compare(right.getLastTimeUsed(), left.getLastTimeUsed());
        }
    }

    /**
     * Enum represents the intervals for {@link android.app.usage.UsageStatsManager} so that
     * values for intervals can be found by a String representation.
     *
     */
    //VisibleForTesting
    static enum StatsUsageInterval {
        DAILY("Daily", UsageStatsManager.INTERVAL_DAILY),
        WEEKLY("Weekly", UsageStatsManager.INTERVAL_WEEKLY),
        MONTHLY("Monthly", UsageStatsManager.INTERVAL_MONTHLY),
        YEARLY("Yearly", UsageStatsManager.INTERVAL_YEARLY);

        private int mInterval;
        private String mStringRepresentation;

        StatsUsageInterval(String stringRepresentation, int interval) {
            mStringRepresentation = stringRepresentation;
            mInterval = interval;
        }

        static StatsUsageInterval getValue(String stringRepresentation) {
            for (StatsUsageInterval statsUsageInterval : values()) {
                if (statsUsageInterval.mStringRepresentation.equals(stringRepresentation)) {
                    return statsUsageInterval;
                }
            }
            return null;
        }
    }

    /**
     * Converts UsageStats into a JSONObject
     * @param usageStats
     * @return
     * @throws Exception
     */
    public static JSONObject toJSON(UsageStats usageStats) throws Exception{
        JSONObject object= new JSONObject();
        object.put("PackageName", usageStats.getPackageName());
        object.put("FirstTimeStamp", usageStats.getFirstTimeStamp());
        object.put("LastTimeStamp", usageStats.getLastTimeStamp());
        object.put("LastTimeUsed", usageStats.getLastTimeUsed());
        object.put("TotalTimeInForeground", usageStats.getTotalTimeInForeground());
        return object;
    }

    /**
     * Launch UsageStatsManager settings
     * @return
     */
    private void openPermissionSettings(CallbackContext callbackContext){
        try {
            boolean granted = false;
            Context context = this.cordova.getActivity().getApplicationContext();
            AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.getPackageName());

            if (mode == AppOpsManager.MODE_DEFAULT) {
                granted = (context.checkCallingOrSelfPermission(android.Manifest.permission.PACKAGE_USAGE_STATS) == PackageManager.PERMISSION_GRANTED);
            } else {
                granted = (mode == AppOpsManager.MODE_ALLOWED);
            }

            Log.d("Granted", granted ?"true":"false");

            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            callbackContext.success("OK");

        } catch(Exception e){
            e.printStackTrace();
            callbackContext.error(e.toString());
        }

    }

    private boolean checkForPermission() {
        Context context = this.cordova.getActivity().getApplicationContext();
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.getPackageName());
        return mode == AppOpsManager.MODE_ALLOWED;
    }

}
