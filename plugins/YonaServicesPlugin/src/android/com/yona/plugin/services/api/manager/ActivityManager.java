/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.manager;

import android.content.Context;

import java.util.Date;

public interface ActivityManager
{
    /**
     * Post activity to db.
     *
     * @param applicationName the application name
     * @param startDate       the start date
     * @param endDate         the end date
     */
    void postActivityToDB(String applicationName, Date startDate, Date endDate);

    /**
     * Post all db activities.
     *
     * @param context Context
     */
    void postAllDBActivities(Context context);
}
