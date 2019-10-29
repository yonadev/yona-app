/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.manager.dao;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;

import com.yona.plugin.services.api.db.DBConstant;
import com.yona.plugin.services.api.db.DatabaseHelper;
import com.yona.plugin.services.api.model.User;
import com.yona.plugin.services.enums.UserStatus;
import com.yona.plugin.services.listener.DataLoadListener;
import com.yona.plugin.services.utils.AppConstant;
import com.yona.plugin.services.utils.AppUtils;
import com.yona.plugin.services.utils.Logger;

/**
 * Created by kinnarvasa on 28/03/16.
 */
public class AuthenticateDAO extends BaseDAO
{

    /**
     * Instantiates a new Authenticate dao.
     *
     * @param context the context
     */
    public AuthenticateDAO(Context context)
    {
        super(DatabaseHelper.getInstance(context));
    }

    /**
     * Gets user.
     *
     * @return the user
     */
    public User getUser()
    {
        Cursor c = query(DBConstant.TBL_USER_DATA);
        try
        {
            if (c != null && c.getCount() > 0)
            {

                if (c.moveToFirst())
                {
                    return serializer.deserialize(c.getBlob(c.getColumnIndex(DBConstant.SOURCE_OBJECT)), User.class);
                }
            }
        }
        catch (Exception e)
        {
            Logger.loge(AuthenticateDAO.class, e.getMessage());
        }
        finally
        {
            if (c != null)
            {
                c.close();
            }
        }
        return null;
    }
}