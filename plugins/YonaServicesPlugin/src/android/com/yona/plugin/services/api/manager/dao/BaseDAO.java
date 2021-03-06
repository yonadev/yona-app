/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.manager.dao;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.List;

import com.yona.plugin.services.api.db.DbSerializer;
import com.yona.plugin.services.api.db.JsonSerializer;
import com.yona.plugin.services.api.model.BaseEntity;
import com.yona.plugin.services.listener.DataLoader;
import com.yona.plugin.services.utils.Logger;

/**
 * Author @MobiquityInc
 */
class BaseDAO
{

    /**
     * The Serializer.
     */
    final DbSerializer serializer = new JsonSerializer();
    private final SQLiteOpenHelper mOpenHelper;

    /**
     * Instantiates a new Base dao.
     *
     * @param mOpenHelper the m open helper
     */
    BaseDAO(SQLiteOpenHelper mOpenHelper)
    {
        this.mOpenHelper = mOpenHelper;
    }

    /**
     * Delete.
     *
     * @param tableName the table name
     * @param where     the where
     * @param whereArgs the where args
     */
    protected void delete(String tableName, String where, String[] whereArgs)
    {
        if (mOpenHelper != null)
        {
            mOpenHelper.getWritableDatabase().delete(tableName, where, whereArgs);
        }
    }


    /**
     * Delete.
     *
     * @param whereArgs the where args
     */
    protected void delete(String query, String[] whereArgs)
    {
        if (mOpenHelper != null)
        {
            mOpenHelper.getWritableDatabase().rawQuery(query, whereArgs);
        }
    }


    /**
     * Insert long.
     *
     * @param tableName     the table name
     * @param initialValues the initial values
     * @return the long
     */
    long insert(String tableName, ContentValues initialValues)
    {
        if (mOpenHelper != null)
        {
            return mOpenHelper.getWritableDatabase().insertOrThrow(tableName, null, initialValues);
        }
        return 0;
    }

    /**
     * Update.
     *
     * @param tableName the table name
     * @param values    the values
     * @param where     the where
     * @param whereArgs the where args
     */
    void update(String tableName, ContentValues values, String where, String... whereArgs)
    {
        if (mOpenHelper != null)
        {
            mOpenHelper.getWritableDatabase().update(tableName, values, where, whereArgs);
        }
    }

    /**
     * Query cursor.
     *
     * @param tableName the table name
     * @return the cursor
     */
    Cursor query(String tableName)
    {
        if (mOpenHelper == null)
        {
            return null;
        }
        return mOpenHelper.getWritableDatabase().query(tableName, null, null, null, null, null, null);
    }

    /**
     * Query cursor.
     *
     * @param tableName the table name
     * @param orderBy   the column name to order rows in Descending order
     * @param rowLimit  maximum rows to fetch at a time.
     * @return the cursor
     */
    Cursor query(String tableName, String orderBy, String rowLimit)
    {
        if (mOpenHelper == null)
        {
            return null;
        }
        return mOpenHelper.getWritableDatabase().query(tableName, null, null, null, null, null, orderBy, rowLimit);
    }

    /**
     * Bulk insert.
     *
     * @param tableName the table name
     * @param items     the items
     */
    protected void bulkInsert(final String tableName, final List<? extends BaseEntity> items)
    {
        try
        {
            new DataLoader()
            {
                @Override
                public Object doDBCall()
                {
                    SQLiteDatabase db = mOpenHelper.getWritableDatabase();
                    db.beginTransaction();
                    for (BaseEntity q : items)
                    {
                        db.insert(tableName, null, q.getDbContentValues());
                    }
                    db.setTransactionSuccessful();
                    db.endTransaction();
                    db.close();
                    return null;
                }
            }.executeAsync();
        }
        catch (Exception e)
        {
            Logger.loge(BaseDAO.class, e.getMessage());
        }
    }
}