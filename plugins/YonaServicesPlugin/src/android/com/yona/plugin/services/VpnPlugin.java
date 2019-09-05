package com.yona.plugin.services;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.DialogInterface;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.IBinder;
import android.security.KeyChain;
import android.text.TextUtils;
import android.content.Intent;
import android.content.Context;
import android.util.SparseArray;

import com.yona.plugin.services.api.model.Activity;
import com.yona.plugin.services.state.SharedPreference;
import com.yona.plugin.services.utils.AppConstant;
import com.yona.plugin.services.utils.AppUtils;
import com.yona.plugin.services.utils.Logger;

import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.activities.ConfigConverter;
import de.blinkt.openvpn.core.OpenVPNService;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VpnStatus;

public class VpnPlugin extends CordovaPlugin {

    private static final String ACTION_CONFIGURE_VPN = "configureVPN";
    private static final String ACTION_START_VPN = "startVPN";
    private static final String ACTION_STOP_VPN = "stopVPN";
    private static final String ACTION_TOGGLE_LOG = "toggleVPNLog";
    private static final String ACTION_LOG_ENABLED = "VPNLogEnabled";
    private static final int REQUEST_CODE_PREPARE_VPN = 0;
    private static final int RESULT_OK = -1;  // Standard activity result success

    private static final int IMPORT_PROFILE = 5;
    private static final int INSTALL_CERTIFICATE = 7;
    private CallbackContext callback = null;
    private SparseArray<CallbackContext> mCallbackContexts = new SparseArray<>();


    // Executes an action. Returns true if the supplied action exists.
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        callback = callbackContext;

        if (action.equals(ACTION_START_VPN)) {
            startVPN();
            return true;
        } else if (action.equals(ACTION_CONFIGURE_VPN)) {
            if (args.length() < 1) {
                callbackContext.error("Cannot start VPN without config.");
                return true;
            }
            String vpnProfilePath = args.optString(0);
            String vpnLoginId = args.optString(1);
            String vpnPassword = args.optString(2);
            configureVPN(vpnProfilePath, vpnLoginId, vpnPassword);
            return true;
        } else if (action.equals(ACTION_STOP_VPN)) {
            stopVPN();
            return true;
        }else if (action.equals(ACTION_TOGGLE_LOG)) {
            toggleVPNLogWindowDisplay();
            return true;
        }else if (action.equals(ACTION_LOG_ENABLED)) {
            VPNLogEnabled();
            return true;
        }
        return false;
    }

    private void toggleVPNLogWindowDisplay() {
        SharedPreference sharedPreference = new SharedPreference(getBaseContext());
        boolean showOpenVpnLog = sharedPreference.getAppPreferences().getBoolean(AppConstant.SHOW_VPN_WINDOW, false);
        sharedPreference.getAppPreferences().edit().putBoolean(AppConstant.SHOW_VPN_WINDOW, !showOpenVpnLog).commit();

        PluginResult result = new PluginResult(PluginResult.Status.OK, !showOpenVpnLog);
        result.setKeepCallback(true);
        callback.sendPluginResult(result);
    }

    private void VPNLogEnabled() {
        SharedPreference sharedPreference = new SharedPreference(getBaseContext());
        boolean showOpenVpnLog = sharedPreference.getAppPreferences().getBoolean(AppConstant.SHOW_VPN_WINDOW, false);

        PluginResult result = new PluginResult(PluginResult.Status.OK, showOpenVpnLog);
        result.setKeepCallback(true);
        callback.sendPluginResult(result);
    }

    private void configureVPN(String vpnProfilePath, String vpnLoginId, String vpnPassword)
    {
        SharedPreference sharedPreference = new SharedPreference(getBaseContext());
        sharedPreference.setVPNProfilePath(vpnProfilePath);
        sharedPreference.setVpnLoginID(vpnLoginId);
        sharedPreference.setVpnPassword(vpnPassword);

        importVPNProfile();
    }

    private void startVPN()
    {
        AppUtils.startVPN(getBaseContext(), false);
    }

    private void stopVPN() {
        Context context = getBaseContext();
        SharedPreference sharedPreference = new SharedPreference(context);

        String profileUUID = sharedPreference.getUserPreferences().getString(AppConstant.PROFILE_UUID, "");
        VpnProfile profile = ProfileManager.get(context, profileUUID);
        if (!VpnStatus.isVPNActive() || !(ProfileManager.getLastConnectedVpn() == profile))
        {
            return;
        }
        bindOpenVPNService(getVpnServiceStopperConnection());
        Logger.loge(AppUtils.class, "VPN stop called");
    }

    private void importVPNProfile()
    {
        Context context = getBaseContext();
        SharedPreference sharedPreference = new SharedPreference(context);
        cordova.setActivityResultCallback (this);

        if (sharedPreference.getVPNProfilePath() != null)
        {
            Intent startImport = new Intent(context, ConfigConverter.class);
            startImport.setAction(ConfigConverter.IMPORT_PROFILE);
            Uri uri = Uri.parse(sharedPreference.getVPNProfilePath());
            startImport.setData(uri);
            cordova.getActivity().startActivityForResult(startImport, IMPORT_PROFILE);
        }
    }


    /*public void installCertificate(String title, String message)
    {

        Context context = getBaseContext();
        SharedPreference sharedPreference = new SharedPreference(context);

        new AsyncTask<Void, Void, byte[]>()
        {
            @Override
            protected byte[] doInBackground(Void... params)
            {
                if (!AppUtils.checkCACertificate(context))
                {
                    String path = sharedPreference.getRootCertPath();
                    if (path != null)
                    {
                        return AppUtils.getCACertificate(path);
                    }
                }
                return null;
            }

            @Override
            protected void onPostExecute(byte[] keystore)
            {
                if (keystore != null)
                {
                    showInstallAlert(title, message, keystore);
                }
                else
                {
                    checkVPN();
                }
            }
        }.execute();
    }

    private void showInstallAlert(String title, String message, final byte[] keystore)
    {
        Context context = getBaseContext();
        SharedPreference sharedPreference = new SharedPreference(context);

        cordova.setActivityResultCallback (this);

        if (sharedPreference.getUserPreferences().getString(AppConstant.PROFILE_UUID, null) != null)
        {
            final AlertDialog.Builder builder = new AlertDialog.Builder(context);
            builder.setTitle(title); //certificate_installation
            builder.setMessage(message); //certfiicate_installtion_detail
            builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener()
            {
                @Override
                public void onClick(DialogInterface dialog, int which)
                {
                    Intent installIntent = KeyChain.createInstallIntent();
                    installIntent.putExtra(KeyChain.EXTRA_CERTIFICATE, keystore);
                    installIntent.putExtra(KeyChain.EXTRA_NAME, "Yona");
                    cordova.getActivity().startActivityForResult (installIntent, INSTALL_CERTIFICATE);
                }
            });
            builder.setCancelable(false);
            builder.create().show();
        }
        else
        {
            checkVPN();
        }
    }*/

    private void checkVPN()
    {

        Context context = getBaseContext();

        new Handler().postDelayed(new Runnable()
        {
            @Override
            public void run()
            {
                if (!AppUtils.isVPNConnected(context))
                {
                    startVPN();
                }
            }
        }, AppConstant.ONE_SECOND);
    }

    private Context getBaseContext() {
        return this.cordova.getActivity().getApplicationContext();
    }

    private void handleImportProfileRequest(Intent data)
    {
        Context context = getBaseContext();
        SharedPreference sharedPreference = new SharedPreference(context);

        if (!TextUtils.isEmpty(data.getStringExtra(VpnProfile.EXTRA_PROFILEUUID)))
        {
            sharedPreference.getUserPreferences().edit().putString(AppConstant.PROFILE_UUID, data.getStringExtra(VpnProfile.EXTRA_PROFILEUUID)).commit();
            AppUtils.startVPN(context, false);

            PluginResult result = new PluginResult(PluginResult.Status.OK, true );
            result.setKeepCallback(true);
            callback.sendPluginResult(result);

        }
        else
        {
            importVPNProfile();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        /*if( requestCode == INSTALL_CERTIFICATE )
        {
            if( resultCode == Activity.RESULT_OK && data.hasExtra("return_val") )
            {
                PluginResult result = new PluginResult(PluginResult.Status.OK, data.getStringExtra("return_val"));
                result.setKeepCallback(true);
                callback.sendPluginResult(result);
            }
            else
            {
                PluginResult result = new PluginResult(PluginResult.Status.ERROR, "no params returned successfully" );
                result.setKeepCallback(true);
                callback.sendPluginResult(result);
            }
        } else */
        if ( requestCode == IMPORT_PROFILE )
        {
            if (resultCode == RESULT_OK)
            {
                handleImportProfileRequest(data);
            }
        }
    }

    private ServiceConnection getVpnServiceStopperConnection()
    {
        Context context = getBaseContext();

        return new ServiceConnection()
        {
            @Override
            public void onServiceConnected(ComponentName className,
                                           IBinder service)
            {
                // We've bound to LocalService, cast the IBinder and get LocalService instance
                OpenVPNService.LocalBinder binder = (OpenVPNService.LocalBinder) service;
                stopVPN(binder.getService());
                context.unbindService(this);
            }

            @Override
            public void onServiceDisconnected(ComponentName componentName)
            {
                // TODO: Need to show user a alert on failure to stop vpn.
                Logger.loge(VpnPlugin.class, "Error in binding the vpn service with " + componentName.getClassName());
            }

            private void stopVPN(OpenVPNService vpnService)
            {
                ProfileManager.setConntectedVpnProfileDisconnected(context);
                if (vpnService != null && vpnService.getManagement() != null)
                {
                    vpnService.getManagement().stopVPN(false);
                }
            }
        };
    }

    private void bindOpenVPNService(ServiceConnection connection)
    {
        Context context = getBaseContext();
        Intent intent = new Intent(context, OpenVPNService.class);
        intent.setAction(OpenVPNService.START_SERVICE);
        context.bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

}
