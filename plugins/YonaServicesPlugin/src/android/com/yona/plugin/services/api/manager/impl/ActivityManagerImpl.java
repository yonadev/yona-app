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

import com.yona.plugin.services.api.db.DatabaseHelper;
import com.yona.plugin.services.api.manager.ActivityManager;
import com.yona.plugin.services.api.manager.dao.ActivityTrackerDAO;
import com.yona.plugin.services.api.model.Activity;
import com.yona.plugin.services.api.model.AppActivity;
import com.yona.plugin.services.api.model.ErrorMessage;
import com.yona.plugin.services.api.manager.network.ActivityNetworkImpl;
import com.yona.plugin.services.listener.DataLoadListenerImpl;
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
    private SharedPreferences sharedPreferences;


    /**
     * Instantiates a new Activity manager.
     *
     * @param context the context
     */
    public ActivityManagerImpl(Context context)
    {
        activityNetwork = new ActivityNetworkImpl(context);
        activityTrackerDAO = new ActivityTrackerDAO(DatabaseHelper.getInstance(context));
        sharedPreferences = context.getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, android.app.Activity.MODE_PRIVATE);
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
    public void postAllDBActivities()
    {
        postAppActivitiesBatchWise();
    }

    private void postAppActivitiesBatchWise()
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
        postActivityOnServerAndDoNextBatch(appActivity);
    }

    private boolean isSyncAPICallDone = true;

    private void postActivityOnServerAndDoNextBatch(AppActivity activity)
    {
        if (!isSyncAPICallDone)
        {
            return;
        }

        DataLoadListenerImpl dataLoadListenerImpl = new DataLoadListenerImpl<>((result) -> handlePostAppActivityOnSuccess(), (result) -> handlePostAppActivityOnFailure(result), null);
        Logger.logi(ActivityManagerImpl.class, "post app activity: " + activity.toString());
        //activityNetwork.postAppActivity(getAppUser().getPostDeviceAppActivityLink(), YonaApplication.getEventChangeManager().getSharedPreference().getYonaPassword(), activity, dataLoadListenerImpl);
        //Todo: add link

        Set<String> keys = sharedPreferences.getAll().keySet();
        Logger.logi(ActivityManagerImpl.class, keys.toString());

        if (sharedPreferences.contains("YonaPassword") && sharedPreferences.contains("appActivityLink")) {
            String yonaPassword = sharedPreferences.getString("YonaPassword", "");
            String appActivityUrl = sharedPreferences.getString("YonaPassword", "");

            Logger.logi(ActivityManagerImpl.class, "appActivityUrl: " + appActivityUrl);

            activityNetwork.postAppActivity(appActivityUrl, yonaPassword, activity, dataLoadListenerImpl);
        }
    }

    private Object handlePostAppActivityOnSuccess()
    {
        activityTrackerDAO.clearActivities();
        postAppActivitiesBatchWise();
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
