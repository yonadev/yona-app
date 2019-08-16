package com.yona.plugin.timepicker;

public class PickerOptions {

    private String startTime;
    private String endTime;

    public PickerOptions() {
        // empty constructor
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String type) {
        this.startTime = type;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String type) {
        this.endTime = type;
    }
}
