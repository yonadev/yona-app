/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services;

/**
 * Created by kinnarvasa on 21/03/16.
 */
public interface AppConstant
{

	String SHOW_VPN_WINDOW = "showVpnWindow";

	/**
	 * The constant ONE_SECOND.
	 */
	int ONE_SECOND = 1000;

	//Custom Broadcast actions.
	String RESTART_VPN = "com.yona.app.RESTART_VPN";
	String RESTART_DEVICE = "com.yona.app.RESTART_DEVICE";
	String WAKE_UP = "com.yona.app.WAKE_UP_ALARM";
	String CONNECT_VPN = "nu.yona.app.CONNECT_VPN";

	// Notifications Channel Id's
	String YONA_VPN_CHANNEL_ID = "yona-vpn-channel";
	String YONA_SERVICE_CHANNEL_ID = "yona-service-channel";
	String OLD_YONA_SERVICE_CHANNEL_ID = "yona-channel";

	/**
	 * The constant FROM_LOGIN.
	 */
	String FROM_LOGIN = "fromLogin";

	/**
	 * The constant TERMINATED_APP.
	 */
	String TERMINATED_APP = "isTerminated";

	/**
	 * The constant USER_PREFERENCE_KEY.
	 */
	String USER_PREFERENCE_KEY = "userPreferenceKey";
	/**
	 * The constant APP_PREFERENCE_KEY.
	 */
	String APP_PREFERENCE_KEY = "appPreferenceKey";
	/**
	 * The constant YONA_PASSWORD.
	 */
	String YONA_DATA = "yonaPassword";

	String YONA_IV = "yona_key";
	/**
	 * The constant YONA_PASSCODE.
	 */
	String YONA_PASSCODE = "yonaPasscode";
	/**
	 * The constant YONA_WRONG_PASSCODE_COUNTER.
	 */
	String YONA_WRONG_PASSCODE_COUNTER = "wrongPasscodeCounter";

	String PROFILE_UUID = "profileUUID";

	// Notification Id's. Before changing them please ensure that existing notifications with old Id's are cancelled at-least once.
	int APP_MONITOR_NOTIFICATION_ID = 1111;
	int VPN_CONNECT_NOTIFICATION_ID = 1112;
}
