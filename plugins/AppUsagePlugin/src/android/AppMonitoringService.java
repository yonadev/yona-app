package com.yona.plugin.services;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.*;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.drawable.Icon;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import androidx.core.app.NotificationCompat;

import java.util.Date;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import static android.os.PowerManager.PARTIAL_WAKE_LOCK;

/**
 * Puts the service in a foreground state, where the system considers it to be
 * something the user is actively aware of and thus not a candidate for killing
 * when low on memory.
 */
public class AppMonitoringService extends Service {

    private static final String LOG_TAG = "AppUsagePlugin";

    // Fixed ID for the 'foreground' notification
    public static final int NOTIFICATION_ID = -574543954;

    // Default title of the background notification
    private static final String NOTIFICATION_TITLE =
            "App is running in background";

    // Default text of the background notification
    private static final String NOTIFICATION_TEXT =
            "Doing heavy tasks.";

    // Default icon of the background notification
    private static final String NOTIFICATION_ICON = "icon";

    // Binder given to clients
    private final IBinder binder = new ForegroundBinder();

    private static String currentApp;

	private final Stopwatch stopWatch = new Stopwatch();

	private String previousAppName;

	private PowerManager powerManager;

	private Date startTime, endTime;

	private ScheduledFuture scheduledFuture;

    private static final YonaReceiver receiver = new YonaReceiver();

    /**
     * Allow clients to call on to the service.
     */
    @Override
    public IBinder onBind (Intent intent) {
        return binder;
    }

    /**
     * Class used for the client Binder.  Because we know this service always
     * runs in the same process as its clients, we don't need to deal with IPC.
     */
    class ForegroundBinder extends Binder
    {
        AppMonitoringService getService()
        {
            // Return this instance of AppMonitoringService
            // so clients can call public methods
            return AppMonitoringService.this;
        }
    }

    /**
     * Put the service in a foreground state to prevent app from being killed
     * by the OS.
     */
    @Override
    public void onCreate()
    {
        super.onCreate();
        restartReceiver(getApplicationContext());
        powerManager = ((PowerManager)getSystemService(Context.POWER_SERVICE));
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
        getNotificationManager().cancel(NOTIFICATION_ID);
        stopForeground(true);

        super.onDestroy();
    }

    /**
     * Prevent Android from stopping the background service automatically.
     */
    @Override
    public int onStartCommand (Intent intent, int flags, int startId) {
        scheduleMethod();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        {
            startForeground(NOTIFICATION_ID, makeNotification());
        }
        return START_NOT_STICKY;
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

    private void restartReceiver(Context context)
    {
        SharedPreferences sp = getApplicationContext().getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, Context.MODE_PRIVATE);

        if (sp.getBoolean(AppConstant.TERMINATED_APP, false))
        {
            sp.edit().putBoolean(AppConstant.TERMINATED_APP, false).commit();
            registerReceiver(context);
        }

        registerReceiver(context);
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

    /**
     * Create a notification as the visible part to be able to put the service
     * in a foreground state by using the default settings.
     */
    private Notification makeNotification()
    {
        return makeNotification(BackgroundMode.getSettings());
    }

    /**
     * Create a notification as the visible part to be able to put the service
     * in a foreground state.
     *
     * @param settings The config settings
     */
    private Notification makeNotification (JSONObject settings)
    {
        // use channelid for Oreo and higher
        String CHANNEL_ID = "cordova-plugin-background-mode-id";
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // The user-visible name of the channel.
            CharSequence name = settings.optString("channelName", "yona-plugin-appusage");
            // The user-visible description of the channel.
            String description = settings.optString("channelDescription", "yona-plugin-appusage notification");

            int importance = NotificationManager.IMPORTANCE_LOW;

            NotificationChannel mChannel = new NotificationChannel(CHANNEL_ID, name, importance);

            // Configure the notification channel.
            mChannel.setDescription(description);

            getNotificationManager().createNotificationChannel(mChannel);
        }
        String title    = settings.optString("title", NOTIFICATION_TITLE);
        String text     = settings.optString("text", NOTIFICATION_TEXT);
        boolean bigText = settings.optBoolean("bigText", false);
        String subText = settings.optString("subText", "");

        Context context = getApplicationContext();
        String pkgName  = context.getPackageName();
        Intent intent   = context.getPackageManager()
                .getLaunchIntentForPackage(pkgName);

        NotificationCompat.Builder notification = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(text)
                .setOngoing(true)
                .setSmallIcon(getIconResId(settings))
                .setShowWhen(settings.optBoolean("showWhen", true));

        if (!subText.equals("")) {
            notification.setSubText(subText);
        }

        if (settings.optBoolean("allowClose", false)) {

            final Intent clostAppIntent = new Intent("com.backgroundmode.close" + pkgName);
            final PendingIntent closeIntent = PendingIntent.getBroadcast(context, 1337, clostAppIntent, 0);
            final String closeIconName = settings.optString("closeIcon", "power");
            NotificationCompat.Action.Builder closeAction = new NotificationCompat.Action.Builder(getIconResId(closeIconName), settings.optString("closeTitle", "Close"), closeIntent);
            notification.addAction(closeAction.build());
        }

        if (settings.optBoolean("hidden", true)) {
            notification.setPriority(Notification.PRIORITY_MIN);
        }

        if (bigText || text.contains("\n")) {
            notification.setStyle(
                    new NotificationCompat.BigTextStyle().bigText(text));
        }

        setColor(notification, settings);

        if (intent != null && settings.optBoolean("resume")) {
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent contentIntent = PendingIntent.getActivity(
                    context, NOTIFICATION_ID, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT);


            notification.setContentIntent(contentIntent);
        }

        return notification.build();
    }

    /**
     * Update the notification.
     *
     * @param settings The config settings
     */
    protected void updateNotification (JSONObject settings)
    {
        boolean isSilent = settings.optBoolean("silent", false);

        Notification notification = makeNotification(settings);
        getNotificationManager().notify(NOTIFICATION_ID, notification);

    }

    /**
     * Retrieves the resource ID of the sent icon name
     *
     * @param name Name of the resource to return
     */
    private int getIconResId(String name) {
        int resId = getIconResId(name, "mipmap");

        if (resId == 0) {
            resId = getIconResId(name, "drawable");
        }

        if (resId == 0) {
            resId = getIconResId("icon", "mipmap");
        }

        if (resId == 0) {
            resId = getIconResId("icon", "drawable");
        }


        return resId;
    }

    /**
     * Retrieves the resource ID of the app icon.
     *
     * @param settings A JSON dict containing the icon name.
     */
    private int getIconResId(JSONObject settings) {
        String icon = settings.optString("icon", NOTIFICATION_ICON);

        return getIconResId(icon);
    }

    /**
     * Retrieve resource id of the specified icon.
     *
     * @param icon The name of the icon.
     * @param type The resource type where to look for.
     *
     * @return The resource id or 0 if not found.
     */
    private int getIconResId (String icon, String type)
    {
        Resources res  = getResources();
        String pkgName = getPackageName();

        return res.getIdentifier(icon, type, pkgName);
    }

    /**
     * Set notification color if its supported by the SDK.
     *
     * @param notification A Notification.Builder instance
     * @param settings A JSON dict containing the color definition (red: FF0000)
     */
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    private void setColor(NotificationCompat.Builder notification,
                          JSONObject settings) {

        String hex = settings.optString("color", null);

        if (Build.VERSION.SDK_INT < 21 || hex == null)
            return;

        try {
            int aRGB = Integer.parseInt(hex, 16) + 0xFF000000;
            notification.setColor(aRGB);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Returns the shared notification service manager.
     */
    private NotificationManager getNotificationManager()
    {
        return (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
    }

    private void scheduleMethod()
	{

		scheduledFuture = Scheduler.getInitializeScheduler().scheduleAtFixedRate(new Runnable()
		{

			@Override
			public void run()
			{
				if (Scheduler.getScheduler() == null)
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

    private void updateOnServer(String pkgname)
	{
		Logger.logi(AppMonitoringService.class, "pck: " + pkgname);
		if (previousAppName != null && !pkgname.equals("NULL") && startTime != null && endTime != null && startTime.before(endTime))
		{
			//APIManager.getInstance().getActivityManager().postActivityToDB(previousAppName, startTime, endTime);
		}
	}

    @Override
    public void onTaskRemoved(Intent rootIntent)
    {
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
			if (Scheduler.getScheduler() != null)
			{
				Scheduler.getScheduler().shutdownNow();
				Scheduler.setNullScheduler();
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
        Intent restartServiceIntent = new Intent(getApplicationContext(), this.getClass());
        restartServiceIntent.setPackage(getPackageName());

        PendingIntent restartServicePendingIntent = PendingIntent.getService(getApplicationContext(), 1, restartServiceIntent, PendingIntent.FLAG_ONE_SHOT);
        AlarmManager alarmService = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmService.set(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime() + AppConstant.ONE_SECOND, restartServicePendingIntent);

    }

}
