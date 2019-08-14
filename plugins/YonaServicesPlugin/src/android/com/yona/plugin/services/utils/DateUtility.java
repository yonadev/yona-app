/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by bhargavsuthar on 10/05/16.
 */
public class DateUtility
{
    /**
     * Gets long format date.
     *
     * @param date the date
     * @return the long format date
     */
    public static String getLongFormatDate(Date date)
    {
        SimpleDateFormat sdf = new SimpleDateFormat(AppConstant.YONA_LONG_DATE_FORMAT, Locale.getDefault());
        return sdf.format(date);
    }

}