package com.yona.plugin.services.utils;

import android.annotation.TargetApi;
import android.app.AlarmManager;
import android.app.AppOpsManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.text.TextUtils;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.yona.plugin.services.AppMonitoringService;
import com.yona.plugin.services.api.manager.APIManager;
import com.yona.plugin.services.api.receiver.YonaReceiver;
import com.yona.plugin.services.state.SharedPreference;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.security.KeyStore;
import java.util.Enumeration;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import de.blinkt.openvpn.LaunchVPN;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VpnStatus;
import nu.yona.app.R;

public class AppUtils {

    private static ScheduledExecutorService scheduler;

    private static Intent activityMonitorIntent;

    /**
     * Has permission boolean.
     *
     * @param context the context
     * @return false if user has not given permission for package access so far.
     */
    @TargetApi(Build.VERSION_CODES.KITKAT)
    public static boolean hasPermission(Context context)
    {
        try
        {
            PackageManager packageManager = context.getPackageManager();
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(context.getPackageName(), 0);
            AppOpsManager appOpsManager = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOpsManager.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, applicationInfo.uid, applicationInfo.packageName);
            return (mode == AppOpsManager.MODE_ALLOWED);
        }
        catch (PackageManager.NameNotFoundException e)
        {
            return true;
        }

    }

    /**
     * Start service once user grant permission for application permission (for 5.1+ version)
     *
     * @param context the context
     */
    public static void startService(Context context)
    {
        try
        {
            activityMonitorIntent = new Intent(context, AppMonitoringService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            {
                startForegroundService(context, activityMonitorIntent);
                cancelPendingWakeUpAlarms(context);
            }
            else
            {
                context.startService(activityMonitorIntent);
            }
        }
        catch (Exception e)
        {
            Logger.loge(AppUtils.class, e.getMessage());
        }
    }

    @TargetApi(Build.VERSION_CODES.O)
    public static void cancelPendingWakeUpAlarms(Context context)
    {
        Intent alarmIntent = new Intent(context, YonaReceiver.class);
        alarmIntent.setAction(AppConstant.WAKE_UP);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, alarmIntent, 0);
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(pendingIntent);
    }

    /*
		Checks if application is not permitted to show notifications as this permission is necessary to show foreground notifications and Toasts
		Starts foreground service.
		Post Alert message if app is not permitted to do so.
	 */
    @TargetApi(Build.VERSION_CODES.O)
    private static void startForegroundService(Context context, Intent activityMonitorIntent)
    {
        if (!NotificationManagerCompat.from(context).areNotificationsEnabled())
        {
            return; // Notification permission is required for starting a ForegroundService
        }
        context.startForegroundService(activityMonitorIntent);
    }

    /**
     * Stop service.
     *
     * @param context the context
     */
    public static void stopService(Context context)
    {
        try
        {
            if (activityMonitorIntent != null)
            {
                context.stopService(activityMonitorIntent);
                activityMonitorIntent = null;
            }
        }
        catch (Exception e)
        {
            Logger.loge(AppUtils.class, e.getMessage());
        }
    }

    /**
     * Send log to server.
     *
     * @param delayMilliseconds the delay milliseconds
     */
    public static void sendLogToServer(Context context, long delayMilliseconds)
    {
        new Handler().postDelayed(() -> APIManager.getInstance().getActivityManager(context).postAllDBActivities(), delayMilliseconds);
    }

    /**
     * Gets initialize scheduler.
     *
     * @return the initialize scheduler
     */
    public static ScheduledExecutorService getInitializeScheduler()
    {
        if (scheduler == null)
        {
            scheduler = Executors.newSingleThreadScheduledExecutor();
        }
        return scheduler;
    }

    /**
     * Gets scheduler.
     *
     * @return the scheduler
     */
    public static ScheduledExecutorService getScheduler()
    {
        return AppUtils.scheduler;
    }

    /**
     * Sets null scheduler.
     */
    public static void setNullScheduler()
    {
        if (scheduler != null)
        {
            scheduler.shutdown();
        }
        scheduler = null;
    }

    public static boolean isVPNConnected(Context context)
    {
        SharedPreference sharedPreference  = new SharedPreference(context);

        String profileUUID = sharedPreference.getUserPreferences().getString(AppConstant.PROFILE_UUID, "");
        VpnProfile profile = ProfileManager.get(context, profileUUID);
        return (VpnStatus.isVPNActive() && ProfileManager.getLastConnectedVpn() == profile);
    }

    public static Intent startVPN(Context context, boolean returnIntent)
    {
        SharedPreference sharedPreference  = new SharedPreference(context);

        String profileUUID = sharedPreference.getUserPreferences().getString(AppConstant.PROFILE_UUID, "");
        VpnProfile profile = ProfileManager.get(context, profileUUID);

        String VpnLoginId = sharedPreference.getVpnLoginID();
        String VpnPassword = sharedPreference.getVpnPassword();

        if (profile == null || VpnStatus.isVPNActive() || VpnLoginId == null || VpnPassword == null)
        {
            return null;
        }
        AppUtils.removeVPNConnectNotification(context);
        profile.mUsername = !TextUtils.isEmpty(VpnLoginId) ? VpnLoginId : "";
        profile.mPassword = !TextUtils.isEmpty(VpnPassword) ? VpnPassword : "";
        if (returnIntent)
        {
            return getVPNIntent(profile, context);
        }
        startVPN(profile, context);
        return null;
    }

    private static void startVPN(VpnProfile profile, Context context)
    {
        Logger.logi(AppUtils.class, "Start VPN");
        context.startActivity(getVPNIntent(profile, context));
    }

    private static Intent getVPNIntent(VpnProfile profile, Context context)
    {
        SharedPreference sharedPreference  = new SharedPreference(context);
        ProfileManager.getInstance(context).saveProfile(context, profile);
        Intent intent = new Intent(context, LaunchVPN.class);
        intent.putExtra(LaunchVPN.EXTRA_KEY, profile.getUUID().toString());
        intent.setAction(Intent.ACTION_MAIN);
        intent.putExtra(AppConstant.FROM_LOGIN, true);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        boolean showOpenVpnLog = sharedPreference.getAppPreferences().getBoolean(AppConstant.SHOW_VPN_WINDOW, false);
        intent.putExtra(LaunchVPN.EXTRA_HIDELOG, !showOpenVpnLog);
        return intent;
    }

    @TargetApi(Build.VERSION_CODES.O)
    public static void removeVPNConnectNotification(Context context)
    {
        android.app.NotificationManager notificationManager;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        {
            notificationManager = context.getSystemService(android.app.NotificationManager.class);
            notificationManager.deleteNotificationChannel(AppConstant.YONA_VPN_CHANNEL_ID);
            return;
        }
        notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancel(AppConstant.VPN_CONNECT_NOTIFICATION_ID);
    }

    public static byte[] getCACertificate(String path)
    {
        if (path != null && !TextUtils.isEmpty(path))
        {
            File file = new File(path);
            int size = (int) file.length();
            byte[] bytes = new byte[size];
            try
            {
                BufferedInputStream buf = new BufferedInputStream(new FileInputStream(file));
                buf.read(bytes, 0, bytes.length);
                buf.close();
                return bytes;
            }
            catch (java.io.IOException e)
            {
                Logger.loge(AppUtils.class, e.getMessage());
            }
        }
        return null;
    }

    public static boolean checkCACertificate(Context context)
    {
        boolean isCertExist = false;
        try
        {
            KeyStore ks = KeyStore.getInstance("AndroidCAStore");
            if (ks == null)
            {
                return false;
            }
            ks.load(null, null);
            Enumeration aliases = ks.aliases();
            SharedPreference sharedPreference = new SharedPreference(context);

            String caCertName = sharedPreference.getSslRootCertCN();

            if (caCertName == null)
            {
                return false;
            }

            if (!TextUtils.isEmpty(caCertName))
            {
                while (aliases.hasMoreElements())
                {
                    String alias = (String) aliases.nextElement();
                    java.security.cert.X509Certificate cert = (java.security.cert.X509Certificate) ks.getCertificate(alias);
                    if (cert.getIssuerDN().getName().contains(caCertName))
                    {
                        isCertExist = true;
                        break;
                    }
                }
            }
        }
        catch (Exception e)
        {
            Logger.loge(AppUtils.class, e.getMessage());
        }
        return isCertExist;
    }

    public static void createNotificationChanngel(Context context)
    {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        {
            //Todo: add r.string.yona_vpn_notification_channel_name
            NotificationChannel channel = new NotificationChannel(AppConstant.YONA_NOTIFICATION_CHANNEL_ID,
                    "Notificatie-meldingen",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public static void showNotification(Context context, String message, String title)
    {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context.getApplicationContext(), AppConstant.YONA_NOTIFICATION_CHANNEL_ID);

        NotificationCompat.BigTextStyle bigText = new NotificationCompat.BigTextStyle();
        bigText.bigText(message);
        //Todo: add r.color.grape

        int aRGB = Integer.parseInt("6c2a58", 16) + 0xFF000000;
        mBuilder.setColor(aRGB);
        mBuilder.setStyle(bigText);
        mBuilder.setContentTitle(title);
        mBuilder.setContentText(message);
        mBuilder.setGroup("Notifications");
        //Todo: add r.string.appname
        mBuilder.setTicker("Yona");
        mBuilder.setSmallIcon(R.drawable.notification);
        mBuilder.setPriority(Notification.PRIORITY_MAX);
        mBuilder.setAutoCancel(true);

        notificationManager.notify(AppConstant.MESSAGE_NOTIFICATION_ID, mBuilder.build());
    }

    @TargetApi(Build.VERSION_CODES.O)
    public static boolean arePersistentNotificationsEnabled(Context context)
    {
        if (getPersistentNotificationChannel(context) == null) // Channel will be null on first launch of the application.
        {
            createPersistentNotificationChannel(context);
        }
        return getPersistentNotificationChannel(context).getImportance() != android.app.NotificationManager.IMPORTANCE_NONE;
    }

    @TargetApi(Build.VERSION_CODES.O)
    private static void createPersistentNotificationChannel(Context context)
    {
        removeOldPersistentNotificationChannel(context);
        NotificationChannel channel = new NotificationChannel(AppConstant.YONA_SERVICE_CHANNEL_ID,
                "Yona persistent notifications",
                NotificationManager.IMPORTANCE_MIN);
        channel.setShowBadge(false);
        ((NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);
    }

    @TargetApi(Build.VERSION_CODES.O)
    private static void removeOldPersistentNotificationChannel(Context context)
    {
        android.app.NotificationManager notificationManager = context.getSystemService(android.app.NotificationManager.class);
        notificationManager.deleteNotificationChannel(AppConstant.OLD_YONA_SERVICE_CHANNEL_ID);
    }

    @TargetApi(Build.VERSION_CODES.O)
    private static NotificationChannel getPersistentNotificationChannel(Context context)
    {
        android.app.NotificationManager notificationManager = context.getSystemService(android.app.NotificationManager.class);
        return notificationManager.getNotificationChannel(AppConstant.YONA_SERVICE_CHANNEL_ID);
    }

}
