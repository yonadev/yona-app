package com.yona.plugin.services;

import android.annotation.TargetApi;
import android.app.*;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import nu.yona.app.R;
import com.yona.plugin.services.api.manager.APIManager;
import com.yona.plugin.services.api.model.Activity;
import com.yona.plugin.services.api.receiver.YonaReceiver;
import com.yona.plugin.services.api.service.Stopwatch;
import com.yona.plugin.services.utils.AppConstant;
import com.yona.plugin.services.utils.AppUtils;
import com.yona.plugin.services.utils.DateUtility;
import com.yona.plugin.services.utils.Logger;

import static com.yona.plugin.services.utils.AppConstant.APP_MONITOR_NOTIFICATION_ID;

/**
 * Puts the service in a foreground state, where the system considers it to be
 * something the user is actively aware of and thus not a candidate for killing
 * when low on memory.
 */
public class AppMonitoringService extends Service {

    // Default title of the background notification
    private static String NOTIFICATION_TITLE =
            "Monitoring app usage";

    private static String currentApp;

	private final Stopwatch stopWatch = new Stopwatch();

	private String previousAppName;

	private PowerManager powerManager;

	private Date startTime, endTime;

	private ScheduledFuture scheduledFuture;

    private static final YonaReceiver receiver = new YonaReceiver();

    @Nullable
    @Override
    public IBinder onBind(Intent intent)
    {
        return null;
    }

    @Override
    public void onCreate()
    {
        super.onCreate();

        if(Locale.getDefault().toString().startsWith("nl")) {
            NOTIFICATION_TITLE = "Monitort appgebruik";
        }

        restartReceiver();
        powerManager = ((PowerManager) getApplicationContext().getSystemService(Context.POWER_SERVICE));
    }

    private void restartReceiver()
    {
        SharedPreferences sp = getApplicationContext().getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, Context.MODE_PRIVATE);
        if (sp.getBoolean(AppConstant.TERMINATED_APP, false))
        {
            sp.edit().putBoolean(AppConstant.TERMINATED_APP, false).commit();
            registerReceiver(getApplicationContext());
        }

        registerReceiver(getApplicationContext());
    }

    /**
     * Prevent Android from stopping the background service automatically.
     */
    @Override
    public int onStartCommand (Intent intent, int flags, int startId) {
        Log.i(this.getClass().getName(), "onStartCommand");
        scheduleMethod();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        {
            displayActivityMonitoringNotification();
        }
        return START_NOT_STICKY;
    }

    @TargetApi(Build.VERSION_CODES.O)
    private void displayActivityMonitoringNotification()
    {
        Context context = getApplicationContext();
        String pkgName  = context.getPackageName();
        Intent intent   = context.getPackageManager().getLaunchIntentForPackage(pkgName);

        int aRGB = Integer.parseInt("6c2a58", 16) + 0xFF000000;

        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0 /* Request code */, intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, AppConstant.YONA_SERVICE_CHANNEL_ID)
                .setColor(aRGB)
                .setSmallIcon(R.drawable.notification)
                .setContentTitle(NOTIFICATION_TITLE)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .setPriority(0)
                .build();
        startForeground(APP_MONITOR_NOTIFICATION_ID, notification);
    }

    private void removeActivityMonitoringNotification()
    {
        NotificationManager mNotificationManager = (NotificationManager)
                this.getSystemService(NOTIFICATION_SERVICE);
        mNotificationManager.cancel(APP_MONITOR_NOTIFICATION_ID);
    }

    /**
     * No need to run headless on destroy.
     */
    @Override
    public void onDestroy()
    {
        shutdownScheduler();
        endTime = new Date();
        updateOnServer(previousAppName);
        removeActivityMonitoringNotification();
        super.onDestroy();
    }

    private static String printForegroundTask(Context context)
	{
		currentApp = "NULL";
		try
		{
			if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
			{
				UsageStatsManager usm = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
				long time = System.currentTimeMillis();
				List<UsageStats> appList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - AppConstant.ONE_SECOND * AppConstant.ONE_SECOND, time);
				if (appList != null && appList.size() > 0)
				{
					SortedMap<Long, UsageStats> mySortedMap = new TreeMap<>();
					for (UsageStats usageStats : appList)
					{
						mySortedMap.put(usageStats.getLastTimeUsed(), usageStats);
					}
					if (!mySortedMap.isEmpty())
					{
						currentApp = mySortedMap.get(mySortedMap.lastKey()).getPackageName();
					}
				}
			}
			else
			{
				ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
				currentApp = am.getRunningAppProcesses().get(0).processName;
			}
		}
		catch (Exception e)
		{
			Logger.loge(AppMonitoringService.class, e.getMessage());
		}
		return currentApp;
	}

    /**
     * This will register receiver for different events like screen on-off, boot, connectivity etc.
     *
     * @param context the context
     */
    public static void registerReceiver(Context context)
    {
        Logger.loge(BackgroundMode.class, "Register Receiver");
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_BOOT_COMPLETED);
        filter.addAction(AppConstant.RESTART_DEVICE);
        filter.addAction(AppConstant.RESTART_VPN);
        filter.addAction(AppConstant.CONNECT_VPN);
        filter.addAction(PowerManager.ACTION_DEVICE_IDLE_MODE_CHANGED);

        context.registerReceiver(receiver, filter);
    }

    private void scheduleMethod()
	{

		scheduledFuture = AppUtils.getInitializeScheduler().scheduleAtFixedRate(new Runnable()
		{

			@Override
			public void run()
			{
				if (AppUtils.getScheduler() == null)
				{
					scheduledFuture.cancel(true);
					return;
				}
				// This method will check for the Running apps after every 5000ms
				checkRunningApps();
			}
		}, 0, AppConstant.ONE_SECOND, TimeUnit.MILLISECONDS);
	}

	private void checkRunningApps()
	{
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH && !powerManager.isInteractive())
		{
			endTime = new Date();
			stopWatch.stop();
			updateOnServer(previousAppName);
			return;
		}
		final String apppackagename = printForegroundTask(this);
		if (stopWatch.isStarted())
		{
			if (!previousAppName.equalsIgnoreCase(apppackagename))
			{
				endTime = new Date();
				updateOnServer(previousAppName);
				//once updated on server, start new tracking again.
				previousAppName = apppackagename;
				stopWatch.stop();
				startTime = new Date();
				stopWatch.start();
			}//else if both are same package, we don't need to track.
		}
		else
		{
			startTime = new Date();
			stopWatch.start();
			previousAppName = apppackagename;
		}
	}

    private Activity getAppActivity(String applicationName, Date startDate, Date endDate)
    {
        Activity activity = new Activity();
        activity.setApplication(applicationName);
        activity.setStartTime(DateUtility.getLongFormatDate(startDate));
        activity.setEndTime(DateUtility.getLongFormatDate(endDate));
        return activity;
    }

    private void updateOnServer(String pkgname)
	{
		Logger.logi(AppMonitoringService.class, "pck: " + pkgname);
		if (previousAppName != null && !pkgname.equals("NULL") && startTime != null && endTime != null && startTime.before(endTime))
		{
			APIManager.getInstance().getActivityManager(getApplicationContext()).postActivityToDB(previousAppName, startTime, endTime);
		}
	}

    @Override
    public void onTaskRemoved(Intent rootIntent)
    {
        Logger.logd(AppMonitoringService.class, "Task removed");
        SharedPreferences sp = getApplicationContext().getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, Context.MODE_PRIVATE);
        sp.edit().putBoolean(AppConstant.TERMINATED_APP, true).commit();
        shutdownScheduler();
        restartService();
        super.onTaskRemoved(rootIntent);
    }

	private void shutdownScheduler()
	{
		try
		{
			if (AppUtils.getScheduler() != null)
			{
                AppUtils.getScheduler().shutdownNow();
                AppUtils.setNullScheduler();
			}
			if (scheduledFuture != null)
			{
				scheduledFuture.cancel(true);
				scheduledFuture = null;
			}
		}
		catch (Exception e)
		{
			Logger.loge(AppMonitoringService.class, e.getMessage());
		}
	}

    private void restartService()
    {
        Logger.logd(AppMonitoringService.class, "RESTART SERVICE");
        Intent restartServiceIntent = new Intent(getApplicationContext(), this.getClass());
        restartServiceIntent.setPackage(getPackageName());

        PendingIntent restartServicePendingIntent = PendingIntent.getService(getApplicationContext(), 1, restartServiceIntent, PendingIntent.FLAG_ONE_SHOT);
        AlarmManager alarmService = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmService.set(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime() + AppConstant.ONE_SECOND, restartServicePendingIntent);

    }

}
