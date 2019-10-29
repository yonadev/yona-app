/*
 * Copyright (c) 2019 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.state;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.text.TextUtils;

import javax.crypto.spec.IvParameterSpec;

import com.yona.plugin.services.enums.EncryptionMethod;
import com.yona.plugin.services.security.EncryptionUtils;
import com.yona.plugin.services.security.MyCipher;

import com.yona.plugin.services.utils.AppConstant;
import com.yona.plugin.services.utils.YonaRuntimeException;

public class SharedPreference
{
    public static final EncryptionMethod LATEST_ENCRYPTION_METHOD = EncryptionMethod.ENHANCED_BASED_ON_ANDROID_KEYSTORE;
    private String yonaPwd = null;
    private Context context;

    public SharedPreference(Context context)
    {
        this.context = context;
    }

    /**
     * Gets user preferences.
     *
     * @return the user preferences
     */
    public synchronized SharedPreferences getUserPreferences()
    {
        return this.context.getSharedPreferences(AppConstant.USER_PREFERENCE_KEY, Context.MODE_PRIVATE);
    }

    /**
     * Gets user preferences.
     *
     * @return the user preferences
     */
    public synchronized SharedPreferences getAppPreferences()
    {
        return this.context.getSharedPreferences(AppConstant.APP_PREFERENCE_KEY, Context.MODE_PRIVATE);
    }


    public String getVPNProfilePath()
    {
        return getUserPreferences().getString(AppConstant.VPN_PROFILE_PATH, null);
    }

    public void setSslRootCertCN(String path)
    {
        SharedPreferences.Editor editor = getUserPreferences().edit();
        editor.putString(AppConstant.ROOT_CERTIFICATE_CN, path);
        editor.commit();
    }

    public String getSslRootCertCN()
    {
        if (getUserPreferences() != null)
        {
            return getUserPreferences().getString(AppConstant.ROOT_CERTIFICATE_CN, null);
        }
        return null;
    }

    public void setRootCertPath(String path)
    {
        SharedPreferences.Editor editor = getUserPreferences().edit();
        editor.putString(AppConstant.ROOT_CERTIFICATE, path);
        editor.putBoolean(AppConstant.ROOT_CERTIFICATE_ACTIVE, false);
        editor.commit();
    }

    public String getRootCertPath()
    {
        if (getUserPreferences() != null)
        {
            return getUserPreferences().getString(AppConstant.ROOT_CERTIFICATE, null);
        }
        return null;
    }


    public void setVPNProfilePath(String path)
    {
        SharedPreferences.Editor editor = getUserPreferences().edit();
        editor.putString(AppConstant.VPN_PROFILE_PATH, path);
        editor.putBoolean(AppConstant.VPN_PROFILE_ACTIVE, false);
        editor.commit();
    }

    /**
     * Gets server url.
     *
     * @return the server url
     */
    public String getServerUrl()
    {
        return getAppPreferences().getString(AppConstant.SERVER_URL, null);
    }

    /**
     * Sets server url.
     *
     * @param serverUrl the server url
     */
    public boolean setServerUrl(String serverUrl)
    {
        return getAppPreferences().edit().putString(AppConstant.SERVER_URL, serverUrl).commit();
    }

    /**
     * Gets server url.
     *
     * @return the server url
     */
    public String getAppActivityUrl()
    {
        return getAppPreferences().getString(AppConstant.APP_ACTIVITY_LINK, null);
    }

    /**
     * Sets server url.
     *
     * @param appActivityUrl the app activity url
     */
    public boolean setAppActivityUrl(String appActivityUrl)
    {
        return getAppPreferences().edit().putString(AppConstant.APP_ACTIVITY_LINK, appActivityUrl).commit();
    }

    /**
     * Gets server url.
     *
     * @return the server url
     */
    public String getVpnLoginID()
    {
        return getUserPreferences().getString(AppConstant.VPN_LOGIN_ID, null);
    }

    /**
     * Sets server url.
     *
     * @param vpnLoginID the server url
     */
    public boolean setVpnLoginID(String vpnLoginID)
    {
        return getUserPreferences().edit().putString(AppConstant.VPN_LOGIN_ID, vpnLoginID).commit();
    }

    /**
     * Gets server url.
     *
     * @return the server url
     */
    public String getVpnPassword()
    {
        return getUserPreferences().getString(AppConstant.VPN_PASSWORD, null);
    }

    /**
     * Sets server url.
     *
     * @param vpnPassword the server url
     */
    public boolean setVpnPassword(String vpnPassword)
    {
        return getUserPreferences().edit().putString(AppConstant.VPN_PASSWORD, vpnPassword).commit();
    }

    /**
     * Sets yona password.
     *
     * @param password yona password
     */
    public boolean setYonaPassword(String password)
    {
        yonaPwd = null;
        return getUserPreferences().edit().putString(AppConstant.YONA_DATA, EncryptionUtils.encrypt(this.context, password)).commit();
    }

    /**
     * Gets yona password.
     *
     * @return return yona password
     */
    public String getYonaPassword()
    {
        if (yonaPwd == null)
        {
            yonaPwd = getDecryptedKey();
        }
        return yonaPwd;
    }

    /**
     * Gets yona passcode.
     *
     * @return return yona passcode
     */
    public String getYonaPasscode()
    {
        return getUserPreferences().getString(AppConstant.YONA_PASSCODE, null);
    }


    private String getDecryptedKey()
    {
        if (!TextUtils.isEmpty(getUserPreferences().getString(AppConstant.YONA_DATA, "")))
        {
            return EncryptionUtils.decrypt(this.context, getUserPreferences().getString(AppConstant.YONA_DATA, ""));
        }
        else
        {
            return "";
        }
    }

    public void upgradeFromInitialPasswordEncryption()
    {
        byte[] encrypted_data = byteToString(getUserPreferences().getString(AppConstant.YONA_DATA, ""));
        byte[] dataIV = byteToString(getUserPreferences().getString(AppConstant.YONA_IV, ""));
        IvParameterSpec iv = new IvParameterSpec(dataIV);
        MyCipher myCipher = new MyCipher(Build.SERIAL);
        setYonaPassword(myCipher.getYonaPasswordWithOldEncryptedData(encrypted_data, iv));
    }

    public void upgradeFromSerialBasedPasswordEncryption()
    {
        setYonaPassword(getDecryptedKeyFromSerialBasedEncryptedData());
    }

    private String getDecryptedKeyFromSerialBasedEncryptedData()
    {
        if (!TextUtils.isEmpty(getUserPreferences().getString(AppConstant.YONA_DATA, "")))
        {
            byte[] encrypted_data = byteToString(getUserPreferences().getString(AppConstant.YONA_DATA, ""));
            byte[] dataIV = byteToString(getUserPreferences().getString(AppConstant.YONA_IV, ""));
            IvParameterSpec iv = new IvParameterSpec(dataIV);
            return new MyCipher(Build.SERIAL).decryptUTF8(encrypted_data, iv);
        }
        else
        {
            return "";
        }
    }

    private byte[] byteToString(String response)
    {
        String[] byteValues = response.substring(1, response.length() - 1).split(",");
        byte[] encrypted_data = new byte[byteValues.length];
        for (int i = 0, len = encrypted_data.length; i < len; i++)
        {
            encrypted_data[i] = Byte.parseByte(byteValues[i].trim());
        }
        return encrypted_data;
    }

    public void upgradePasswordEncryptionIfNeeded()
    {
        EncryptionMethod encryptionMethod = EncryptionMethod.values()[getAppPreferences().getInt(AppConstant.YONA_ENCRYPTION_METHOD, EncryptionMethod.INITIAL_METHOD.ordinal())];
        if (encryptionMethod != LATEST_ENCRYPTION_METHOD)
        {
            upgradePasswordEncryption(encryptionMethod);
        }
    }

    private void upgradePasswordEncryption(EncryptionMethod encryptionMethod)
    {
        switch (encryptionMethod)
        {
            case INITIAL_METHOD:
            {
                upgradeFromInitialPasswordEncryption();
                break;
            }
            case ENHANCED_STILL_BASED_ON_SERIAL:
            {
                upgradeFromSerialBasedPasswordEncryption();
                break;
            }
            case ENHANCED_BASED_ON_ANDROID_KEYSTORE:
                // This is the current encryption version.
                break;
            default:
            {
                throw new YonaRuntimeException("Unknown encryption method: " + encryptionMethod);
            }
        }
        setPasswordEncryptionModeToLatest();
    }

    public void setPasswordEncryptionModeToLatest()
    {
        SharedPreferences.Editor editor = getAppPreferences().edit();
        editor.putInt(AppConstant.YONA_ENCRYPTION_METHOD, LATEST_ENCRYPTION_METHOD.ordinal());
        editor.commit();
    }

    public boolean clearUserPreferences()
    {
        return getUserPreferences()
                .edit()
                .clear()
                .commit();
    }
}
