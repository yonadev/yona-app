package com.yona.plugin.services.utils;

import android.annotation.TargetApi;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;

import com.yona.plugin.services.api.manager.APIManager;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import de.blinkt.openvpn.LaunchVPN;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VpnStatus;

public class AppUtils {

    private static ScheduledExecutorService scheduler;


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
        String profileUUID = context.getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, Context.MODE_PRIVATE).getString(AppConstant.PROFILE_UUID, "");
        VpnProfile profile = ProfileManager.get(context, profileUUID);
        return (VpnStatus.isVPNActive() && ProfileManager.getLastConnectedVpn() == profile);
    }

    public static Intent startVPN(Context context, boolean returnIntent)
    {

        String profileUUID = context.getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, Context.MODE_PRIVATE).getString(AppConstant.PROFILE_UUID, "");
        VpnProfile profile = ProfileManager.get(context, profileUUID);
        /*User user = getAppUser();
        if (profile == null || VpnStatus.isVPNActive() || user == null || getAppUser().getVpnProfile() == null)
        {
            return null;
        }
        AppUtils.removeVPNConnectNotification(context);
        profile.mUsername = !TextUtils.isEmpty(user.getVpnProfile().getVpnLoginID()) ? user.getVpnProfile().getVpnLoginID() : "";
        profile.mPassword = !TextUtils.isEmpty(user.getVpnProfile().getVpnPassword()) ? user.getVpnProfile().getVpnPassword() : "";
        if (returnIntent)
        {
            return getVPNIntent(profile, context);
        }*/
        startVPN(profile, context);
        return null;
    }

    private static void startVPN(VpnProfile profile, Context context)
    {
        context.startActivity(getVPNIntent(profile, context));
    }

    private static Intent getVPNIntent(VpnProfile profile, Context context)
    {
        ProfileManager.getInstance(context).saveProfile(context, profile);
        Intent intent = new Intent(context, LaunchVPN.class);
        intent.putExtra(LaunchVPN.EXTRA_KEY, profile.getUUID().toString());
        intent.setAction(Intent.ACTION_MAIN);
        intent.putExtra(AppConstant.FROM_LOGIN, true);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        boolean showOpenVpnLog = context.getSharedPreferences(AppConstant.APP_PREFERENCE_KEY, Context.MODE_PRIVATE).getBoolean(AppConstant.SHOW_VPN_WINDOW, false);
        intent.putExtra(LaunchVPN.EXTRA_HIDELOG, !showOpenVpnLog);
        return intent;
    }

    public static void stopVPN(Context context)
    {
        String profileUUID = context.getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, Context.MODE_PRIVATE).getString(AppConstant.PROFILE_UUID, "");
        /*VpnProfile profile = ProfileManager.get(context, profileUUID);
        if (!VpnStatus.isVPNActive() || !(ProfileManager.getLastConnectedVpn() == profile))
        {
            return;
        }
        context.getApplicationContext().stopOpenVPNService();*/
        Logger.loge(AppUtils.class, "VPN stop called");
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

}
