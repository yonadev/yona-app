package com.yona.plugin.timepicker.utils;

import android.text.TextUtils;
import nu.yona.timepicker.time.Timepoint;

public class TimeUtils {

    /**
     * Merge Two times in format of HH:MM-HH:MM
     *
     * @param firstTimepoint
     * @param secondTimepoint
     * @return
     */
    public static String mergeZoneTime(Timepoint firstTimepoint, Timepoint secondTimepoint)
    {
        StringBuilder strBuilder = new StringBuilder();
        strBuilder.append(getTimeDigit(firstTimepoint.getHour()))
                .append(":")
                .append(getTimeDigit(firstTimepoint.getMinute())).append("-")
                .append(getTimeDigit(secondTimepoint.getHour()))
                .append(":")
                .append(getTimeDigit(secondTimepoint.getMinute()));
        return strBuilder.toString();
    }

    /**
     * Gets time in milliseconds.
     *
     * @param time the time
     * @return the time in milliseconds
     */
    public static Timepoint getTimeInMilliseconds(String time)
    {
        if (!TextUtils.isEmpty(time) && time.contains(":"))
        {
            String[] min = time.split(":");
            return new Timepoint(Integer.parseInt(min[0]), Integer.parseInt(min[1]), 0);
        }
        else
        {
            return new Timepoint(0, 0, 0);
        }
    }

    /**
     * convert one digit number to two digit number appending with 0 if its length is one else return same
     *
     * @param time the time
     * @return the time digit
     */
    public static String getTimeDigit(int time)
    {
        String timeDigit = String.valueOf(time);
        if (timeDigit.length() == 1)
        {
            timeDigit = "0" + timeDigit;
        }
        return timeDigit;
    }

}
