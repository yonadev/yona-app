package com.yona.plugin.services.api.manager;

import android.content.Context;

import com.yona.plugin.services.api.manager.impl.ActivityManagerImpl;

public class APIManager {

    private static APIManager apiManager;
    private ActivityManager activityManager;

    /**
     * Gets instance.
     *
     * @return the instance
     */
    public static APIManager getInstance()
    {
        if (apiManager == null)
        {
            apiManager = new APIManager();
        }
        return apiManager;
    }

    /**
     * Gets activity manager.
     *
     * @return the activity manager
     */
    public ActivityManager getActivityManager(Context context)
    {
        if (activityManager == null)
        {
            activityManager = new ActivityManagerImpl(context);
        }
        return this.activityManager;
    }


    /**
     * Sets activity manager.
     *
     * @param activityManager the activity manager
     */
    public void setActivityManager(ActivityManager activityManager)
    {
        this.activityManager = activityManager;
    }
}
