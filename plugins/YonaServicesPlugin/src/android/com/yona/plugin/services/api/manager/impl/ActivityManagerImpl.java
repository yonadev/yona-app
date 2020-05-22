/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.manager.impl;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.yona.plugin.services.api.db.DatabaseHelper;
import com.yona.plugin.services.api.manager.ActivityManager;
import com.yona.plugin.services.api.manager.dao.ActivityTrackerDAO;
import com.yona.plugin.services.api.model.Activity;
import com.yona.plugin.services.api.model.AppActivity;
import com.yona.plugin.services.api.model.ErrorMessage;
import com.yona.plugin.services.api.manager.network.ActivityNetworkImpl;
import com.yona.plugin.services.listener.DataLoadListenerImpl;
import com.yona.plugin.services.state.SharedPreference;
import com.yona.plugin.services.utils.AppConstant;
import com.yona.plugin.services.utils.DateUtility;
import com.yona.plugin.services.utils.Logger;

import java.util.Date;
import java.util.List;
import java.util.Set;


/**
 * Created by kinnarvasa on 06/06/16.
 */
public class ActivityManagerImpl implements ActivityManager
{

    private final ActivityNetworkImpl activityNetwork;
    private final ActivityTrackerDAO activityTrackerDAO;
    private SharedPreference sharedPreferences;


    /**
     * Instantiates a new Activity manager.
     *
     * @param context the context
     */
    public ActivityManagerImpl(Context context)
    {
        activityNetwork = new ActivityNetworkImpl(context);
        activityTrackerDAO = new ActivityTrackerDAO(DatabaseHelper.getInstance(context));
        sharedPreferences = new SharedPreference(context);
    }

    /**
     * Save User app acvitiy to local db
     */
    @Override
    public void postActivityToDB(String applicationName, Date startDate, Date endDate)
    {
        try
        {
            activityTrackerDAO.saveActivities(getAppActivity(applicationName, startDate, endDate));
        }
        catch (Exception e)
        {
            Logger.loge(ActivityManagerImpl.class, e.getMessage());
        }
    }

    /**
     * App activity Business
     */

    @Override
    public void postAllDBActivities(Context context)
    {
        postAppActivitiesBatchWise(context);
    }

    private void postAppActivitiesBatchWise(Context context)
    { // recursive function posts until all activities are posted to the server .
        List<Activity> activityList = activityTrackerDAO.getActivities();
        if (activityList.isEmpty())
        {
            isSyncAPICallDone = true;
            return;
        }
        AppActivity appActivity = new AppActivity();
        appActivity.setDeviceDateTime(DateUtility.getLongFormatDate(new Date()));
        appActivity.setActivities(activityList);
        postActivityOnServerAndDoNextBatch(context, appActivity);
    }

    private boolean isSyncAPICallDone = true;

    private void postActivityOnServerAndDoNextBatch(Context context, AppActivity activity)
    {
        if (!isSyncAPICallDone)
        {
            return;
        }

        DataLoadListenerImpl dataLoadListenerImpl = new DataLoadListenerImpl<>((result) -> handlePostAppActivityOnSuccess(context), (result) -> handlePostAppActivityOnFailure(result), null);
        Logger.logi(ActivityManagerImpl.class, "post app activity: " + activity.toString());

        String serverUrl = sharedPreferences.getServerUrl();
        String appActivityUrl = sharedPreferences.getAppActivityUrl();
        String yonaPassword = sharedPreferences.getYonaPassword();

        String appVersion = "";

        try {
            PackageInfo pInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            appVersion = "ANDROID/" + pInfo.versionCode + "/" + pInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            Logger.loge(ActivityManagerImpl.class, "App version could not be found");
        }

        if (serverUrl != null && appActivityUrl != null && yonaPassword != null) {
            Logger.logi(ActivityManagerImpl.class, "appActivityUrl: " + appActivityUrl);

            activityNetwork.postAppActivity(appActivityUrl, yonaPassword, appVersion, activity, dataLoadListenerImpl);
        }
    }

    private Object handlePostAppActivityOnSuccess(Context context)
    {
        activityTrackerDAO.clearActivities();
        postAppActivitiesBatchWise(context);
        return null; // Dummy return value, to allow use as data load handler
    }

    private Object handlePostAppActivityOnFailure(Object result)
    {
        String errorMessage;
        if (result instanceof ErrorMessage)
        {
            errorMessage = ((ErrorMessage) result).getMessage();
        }
        else
        {
            errorMessage = (String) result;
        }
        Logger.loge(ActivityManagerImpl.class, new Exception("Failed to post app activity of device: " + errorMessage).getMessage());
        return null; // Dummy return value, to allow use as data error handler
    }

    private Activity getAppActivity(String applicationName, Date startDate, Date endDate)
    {
        Activity activity = new Activity();
        activity.setApplication(applicationName);
        activity.setStartTime(DateUtility.getLongFormatDate(startDate));
        activity.setEndTime(DateUtility.getLongFormatDate(endDate));
        return activity;
    }


}
