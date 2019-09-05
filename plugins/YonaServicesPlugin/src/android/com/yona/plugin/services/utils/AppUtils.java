package com.yona.plugin.services.utils;

import android.annotation.TargetApi;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.text.TextUtils;

import com.yona.plugin.services.api.manager.APIManager;
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

}
