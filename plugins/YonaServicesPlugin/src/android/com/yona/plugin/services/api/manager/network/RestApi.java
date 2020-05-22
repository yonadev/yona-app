/*
 * Copyright (c) 2018 Stichting Yona Foundation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package com.yona.plugin.services.api.manager.network;

import com.yona.plugin.services.api.model.AppActivity;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Url;

public interface RestApi
{

    /********
     * APP ACTIVITY
     *
     * @param url      the url
     * @param password the password
     * @param appVersion the appversion
     * @param activity the activity
     * @return the call
     */
    @POST
    Call<Void> postAppActivity(@Url String url, @Header(NetworkConstant.YONA_PASSWORD) String password, @Header(NetworkConstant.YONA_APP_VERSION) String appVersion, @Header(NetworkConstant.ACCEPT_LANGUAGE) String acceptLanguage, @Body AppActivity activity);

}
