package com.yona.plugin.services;

import android.content.Context;

import com.yona.plugin.services.api.manager.dao.AuthenticateDAO;
import com.yona.plugin.services.state.SharedPreference;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class UserPreferences extends CordovaPlugin {

    private static final int VALUE = 0;

    private static final String MISSING_KEY = "Missing key";
    private static final String FAILED_TO_WRITE = "Failed to write";
    private static final String FAILED_TO_READ = "Failed to read";

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("setServerUrl")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String value = args.getString(VALUE);

                        boolean success = getSharedPreferences()
                            .setServerUrl(value);

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("setAppActivityUrl")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String value = args.getString(VALUE);

                        boolean success = getSharedPreferences()
                                .setAppActivityUrl(value);

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("setYonaPassword")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String value = args.getString(VALUE);

                        boolean success = getSharedPreferences()
                                .setYonaPassword(value);

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("getMigrationData")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {

                        Context context = cordova.getContext();
                        AuthenticateDAO authenticateDao = new AuthenticateDAO(context);

                        if (authenticateDao.getUser() != null && authenticateDao.getUser().isActive() && authenticateDao.getUser().getLinks() != null)
                        {
                            String selfHref = authenticateDao.getUser().getLinks().getSelf().getHref();
                            String passCode = getSharedPreferences().getYonaPasscode();
                            String passWord = getSharedPreferences().getYonaPassword();

                            JSONObject response = new JSONObject();
                            response.put("selfHref", selfHref);
                            response.put("passCode", passCode);
                            response.put("passWord", passWord);

                            callbackContext.success(response.toString());

                        }

                        return;

                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if(action.equals("clear")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        boolean success = getSharedPreferences()
                            .clearUserPreferences();

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        return false;
    }

    public SharedPreference getSharedPreferences() {
        Context context = cordova.getContext();

        return new SharedPreference(context);
    }
}
