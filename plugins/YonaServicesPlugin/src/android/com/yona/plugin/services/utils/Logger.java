/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.utils;

import android.util.Log;

import com.google.firebase.crashlytics.FirebaseCrashlytics;

/**
 * A common Logger implementation to support logging mechanism in application.
 */

public class Logger
{

	public static void logi(Class<?> originClass, String message)
	{
		FirebaseCrashlytics.getInstance().log(message);

		Log.i(originClass.getName(), message);
	}

	public static void loge(Class<?> originClass, String message)
	{
		FirebaseCrashlytics.getInstance().log(message);
		Log.e(originClass.getName(), message);
	}

	public static void loge(Class<?> originClass, String message, Exception exception)
	{
		FirebaseCrashlytics.getInstance().log(message);
		FirebaseCrashlytics.getInstance().recordException(exception);

		Log.e(originClass.getName(), message, exception);
	}

	public static void logd(Class<?> originClass, String message)
	{
		FirebaseCrashlytics.getInstance().log(message);
		Log.d(originClass.getName(), message);
	}
}
