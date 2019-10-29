/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.model;

import android.content.ContentValues;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

import com.yona.plugin.services.enums.UserStatus;

/**
 * The type User.
 */
public class User extends BaseEntity
{

    @SerializedName("_links")
    @Expose
    private Links Links;

    @SerializedName("firstName")
    @Expose
    private String firstName;

    @SerializedName("lastName")
    @Expose
    private String lastName;

    @SerializedName("mobileNumber")
    @Expose
    private String mobileNumber;

    @SerializedName("nickname")
    @Expose
    private String nickname;

    @SerializedName("devices")
    @Expose
    private List<String> devices = new ArrayList<>();

    @SerializedName("mobileNumberConfirmationCode")
    @Expose
    private String mobileNumberConfirmationCode;

    @SerializedName("status")
    @Expose
    private UserStatus status;

    @SerializedName("version")
    @Expose
    private int version;


    /**
     * Gets links.
     *
     * @return The Links
     */
    public Links getLinks()
    {
        return Links;
    }

    /**
     * Sets links.
     *
     * @param Links The _links
     */
    public void setLinks(Links Links)
    {
        this.Links = Links;
    }

    /**
     * Gets first name.
     *
     * @return The firstName
     */
    public String getFirstName()
    {
        return firstName;
    }

    /**
     * Gets last name.
     *
     * @return The lastName
     */
    public String getLastName()
    {
        return lastName;
    }

    /**
     * Gets mobile number.
     *
     * @return The mobileNumber
     */
    public String getMobileNumber()
    {
        return mobileNumber;
    }

    /**
     * Gets nickname.
     *
     * @return The nickname
     */
    public String getNickname()
    {
        return nickname;
    }

    /**
     * Gets devices.
     *
     * @return The devices
     */
    public List<String> getDevices()
    {
        return devices;
    }

    @Override
    public ContentValues getDbContentValues()
    {
        return null;
    }

    public UserStatus getStatus()
    {
        return status;
    }

    public int getVersion()
    {
        return version;
    }

    public boolean isActive()
    {
        return this.getStatus() == UserStatus.ACTIVE;
    }
}