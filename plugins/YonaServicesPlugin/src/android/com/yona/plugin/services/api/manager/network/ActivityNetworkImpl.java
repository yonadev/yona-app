/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.manager.network;

import android.content.Context;

import java.util.Locale;

import com.yona.plugin.services.api.model.AppActivity;
import com.yona.plugin.services.listener.DataLoadListener;
import com.yona.plugin.services.utils.Logger;

/**
 * The type Activity network.
 */
public class ActivityNetworkImpl extends BaseImpl
{

    public ActivityNetworkImpl(Context context) {
        super(context);
    }
    /**
     * Post app activity.
     *
     * @param url          the url
     * @param yonaPassword the yona password
     * @param appVersion   the app version
     * @param appActivity  the app activity
     * @param listener     the listener
     */
    public void postAppActivity(String url, String yonaPassword, String appVersion, AppActivity appActivity, DataLoadListener listener)
    {
        try
        {

            getRestApi().postAppActivity(url, yonaPassword, appVersion, Locale.getDefault().toString().replace('_', '-'), appActivity).enqueue(getCall(listener));
        }
        catch (Exception e)
        {
            Logger.loge(ActivityNetworkImpl.class, e.getMessage());
        }
    }
}
