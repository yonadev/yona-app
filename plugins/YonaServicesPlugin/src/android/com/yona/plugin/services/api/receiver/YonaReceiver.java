/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.receiver;

import android.annotation.TargetApi;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import android.content.res.Resources;
import android.os.Build;
import android.os.PowerManager;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.yona.plugin.services.AppMonitoringService;
import com.yona.plugin.services.utils.AppConstant;
import com.yona.plugin.services.utils.Logger;
import com.yona.plugin.services.utils.AppUtils;

import nu.yona.app.R;

import static android.content.Context.POWER_SERVICE;

public class YonaReceiver extends BroadcastReceiver
{
	private static final int INTERACTIVE_CHECK_INTERVAL = 10000;

	private Context context;

	private static Intent activityMonitorIntent;

	@Override
	public void onReceive(Context context, Intent intent)
	{
		Logger.logi(YonaReceiver.class, "Received intent");
		this.context = context;
		switch (intent.getAction())
		{
			case Intent.ACTION_BOOT_COMPLETED:
				handleRebootCompletedBroadcast(context);
			case Intent.ACTION_SCREEN_ON:
				handleScreenOnBroadcast(context);
				break;
			case Intent.ACTION_SCREEN_OFF:
				handleScreenOffBroadcast(context);
				break;
			case AppConstant.WAKE_UP:
				handleWakeUpAlarm(context);
				break;
            case PowerManager.ACTION_DEVICE_IDLE_MODE_CHANGED:
				handleDeviceDozeMode(context);
				break;
			case AppConstant.RESTART_VPN:
				handleRestartVPNBroadcast(context);
				break;
			case AppConstant.CONNECT_VPN:
				//AppUtils.removeVPNConnectNotification(context);
				handleConnectVPNBroadcast(context);
				break;
			default:
				break;
		}
	}

	@TargetApi(Build.VERSION_CODES.O)
	private void handleDeviceDozeMode(Context context)
	{
		Logger.loge(YonaReceiver.class, "ACTION_DEVICE_IDLE_MODE_CHANGED");
		PowerManager powerManager = (PowerManager) context.getSystemService(POWER_SERVICE);
		if (powerManager.isDeviceIdleMode() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
		{
			scheduleNextAlarmToCheckIfDeviceIsInteractive(context, INTERACTIVE_CHECK_INTERVAL);
		}
	}

	private void handleRebootCompletedBroadcast(Context context)
	{
		Logger.logi(YonaReceiver.class, "ACTION_BOOT_COMPLETED");
		startService(context);
	}

	private void handleScreenOnBroadcast(Context context)
	{
		Logger.logi(YonaReceiver.class, "ACTION_SCREEN_ON");
		startService(context);
		// AppUtils.startVPN(context, false);
	}

	private void handleScreenOffBroadcast(Context context)
	{
		Logger.logi(YonaReceiver.class, "ACTION_SCREEN_OFF");
		AppUtils.setNullScheduler();
		AppUtils.sendLogToServer(context, AppConstant.ONE_SECOND);
	}

	@TargetApi(Build.VERSION_CODES.O)
	private void handleWakeUpAlarm(Context context)
	{
		Logger.logi(YonaReceiver.class, "WAKE_UP");
		// Device is awake from doze/sleep (it can be because of user interaction or of some silent Push notifications).
		// We should start service only when device is interactive else schedule next alarm
		if (isDeviceInteractive(context))
		{
			startService(context);
			//AppUtils.startVPN(context, false);
			cancelPendingWakeUpAlarms(context);
		}
		else
		{
			scheduleNextAlarmToCheckIfDeviceIsInteractive(context, INTERACTIVE_CHECK_INTERVAL);
		}
	}

	@TargetApi(Build.VERSION_CODES.O)
	private boolean isDeviceInteractive(Context context)
	{
		PowerManager powerManager = (PowerManager) context.getSystemService(POWER_SERVICE);
		return powerManager.isInteractive();
	}

	@TargetApi(Build.VERSION_CODES.O)
	public static void scheduleNextAlarmToCheckIfDeviceIsInteractive(Context context, long delay)
	{
		Intent alarmIntent = new Intent(context, YonaReceiver.class);
		alarmIntent.setAction(AppConstant.WAKE_UP);
		PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, alarmIntent, 0);
		AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
		alarmManager.cancel(pendingIntent);
		alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + delay, pendingIntent);
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

	private void startService(Context context)
	{
		if ((Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1 && hasPermission())
				|| Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP_MR1)
		{
			utilsStartService(context);
		}
	}

	/**
	 * Start service once user grant permission for application permission (for 5.1+ version)
	 *
	 * @param context the context
	 */
	public static void utilsStartService(Context context)
	{
		try
		{
			activityMonitorIntent = new Intent(context, AppMonitoringService.class);
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
			{
				startAppMonitoringService(context, activityMonitorIntent);
				cancelPendingWakeUpAlarms(context);
			}
			else
			{
				context.startService(activityMonitorIntent);
			}
		}
		catch (Exception e)
		{
			Logger.loge(YonaReceiver.class, e.getMessage());
		}
	}


	/**
	 * Has permission boolean.
	 *
	 * @return false if user has not given permission for package access so far.
	 */
	@TargetApi(Build.VERSION_CODES.KITKAT)
	public static boolean hasPermission()
	{
		//Todo: add proper check for hasPermission
		return true;

	}

	private void handleRestartVPNBroadcast(Context context)
	{
		Logger.logi(YonaReceiver.class, "Restart VPN Broadcast received");
		//Todo add R.string.vpn_disconnected
		showRestartVPNNotification("VPN Disconnected. Click to connect again");
	}

	private void handleConnectVPNBroadcast(Context context)
	{
		Logger.logi(YonaReceiver.class, "Connect VPN Broadcast received");
		AppUtils.startVPN(context, false);
	}

	/*
		Checks if application is not permitted to show notifications as this permission is necessary to show foreground notifications and Toasts
		Starts foreground service.
		Post Alert message if app is not permitted to do so.
	 */
	@TargetApi(Build.VERSION_CODES.O)
	private static void startAppMonitoringService(Context context, Intent activityMonitorIntent)
	{
		if (!NotificationManagerCompat.from(context).areNotificationsEnabled())
		{
			return; // Notification permission is required for starting a AppMonitoringService
		}
		context.startForegroundService(activityMonitorIntent);
	}

	private void showRestartVPNNotification(String message)
	{
		Intent intent = new Intent(context.getApplicationContext(), YonaReceiver.class);
		intent.setAction(AppConstant.CONNECT_VPN);
		PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
		if (pendingIntent == null)
		{
			return;
		}
		NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
		{
			//Todo: add r.string.yona_vpn_notification_channel_name
			NotificationChannel channel = new NotificationChannel(AppConstant.YONA_VPN_CHANNEL_ID,
					"VPN-meldingen",
					NotificationManager.IMPORTANCE_DEFAULT);
			notificationManager.createNotificationChannel(channel);
		}
		notificationManager.notify(AppConstant.VPN_CONNECT_NOTIFICATION_ID, getConfiguredVPNRestartNotification(message, pendingIntent));
	}

	private Notification getConfiguredVPNRestartNotification(String message, PendingIntent pendingIntent)
	{
		NotificationCompat.Builder mBuilder =
				new NotificationCompat.Builder(context.getApplicationContext(), AppConstant.YONA_VPN_CHANNEL_ID);
		NotificationCompat.BigTextStyle bigText = new NotificationCompat.BigTextStyle();
		bigText.bigText(message);
		//Todo: add r.color.grape

		int aRGB = Integer.parseInt("6c2a58", 16) + 0xFF000000;
		mBuilder.setColor(aRGB);
		mBuilder.setStyle(bigText);
		mBuilder.setContentIntent(pendingIntent);
		mBuilder.setContentText(message);
		//Todo: add r.string.appname
		mBuilder.setTicker("Yona");
		mBuilder.setSmallIcon(R.drawable.notification);
		mBuilder.setPriority(Notification.PRIORITY_MAX);
		mBuilder.setAutoCancel(true);
		return mBuilder.build();
	}
}
