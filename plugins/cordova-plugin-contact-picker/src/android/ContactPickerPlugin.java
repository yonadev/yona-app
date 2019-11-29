package by.chemerisuk.cordova;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.text.TextUtils;

import com.yona.plugin.services.utils.Logger;

import by.chemerisuk.cordova.support.CordovaMethod;
import by.chemerisuk.cordova.support.ReflectiveCordovaPlugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static android.app.Activity.RESULT_OK;

public class ContactPickerPlugin extends ReflectiveCordovaPlugin {
    private static final String TAG = "ContactPickerPlugin";
    private static final int SELECT_CONTACT = 123344;

    private CallbackContext contactCallback;

    @CordovaMethod
    private void requestContact(JSONObject settings, CallbackContext callbackContext) {
        if (this.contactCallback != null) {
            callbackContext.error("Only single contact request is allowed");
        } else {
            this.contactCallback = callbackContext;

            Intent intent = new Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI);
            cordova.startActivityForResult(this, intent, SELECT_CONTACT);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == SELECT_CONTACT && this.contactCallback != null) {
            if (resultCode != RESULT_OK) {
                this.contactCallback.sendPluginResult(
                    new PluginResult(PluginResult.Status.OK, (String)null)
                );
            } else {

                try {

                    Uri result = intent.getData();
                    String id = result.getLastPathSegment();

                    JSONObject pluginResult = new JSONObject();

                    //To get email address of user
                    Cursor cursor = this.cordova.getActivity().getContentResolver().query(ContactsContract.CommonDataKinds.Email.CONTENT_URI,
                            null, ContactsContract.CommonDataKinds.Email.CONTACT_ID + "=?", new String[]{id}, null);

                    // If the cursor returned is valid, get the phone number
                    if (cursor != null && cursor.moveToFirst()) {
                            pluginResult.put("email", cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.Email.DATA)));
                    }

                    cursor.close();

                    // To get contact name etc of user
                    String whereName = ContactsContract.Data.MIMETYPE + " = ? AND " + ContactsContract.CommonDataKinds.StructuredName.CONTACT_ID + " = ? ";
                    String[] whereNameParams = new String[]{ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE, id};
                    Cursor nameCur = this.cordova.getActivity().getContentResolver().query(ContactsContract.Data.CONTENT_URI, null, whereName, whereNameParams, ContactsContract.CommonDataKinds.StructuredName.GIVEN_NAME);
                    while (nameCur.moveToNext())
                    {
                        pluginResult.put("firstName", nameCur.getString(nameCur.getColumnIndex(ContactsContract.CommonDataKinds.StructuredName.GIVEN_NAME)));
                        pluginResult.put("lastName", nameCur.getString(nameCur.getColumnIndex(ContactsContract.CommonDataKinds.StructuredName.FAMILY_NAME)));

                    }
                    nameCur.close();

                    JSONArray numberResult = new JSONArray();

                    // To get Mobile number of contact
                    Cursor phoneCur = this.cordova.getActivity().getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                            null, ContactsContract.CommonDataKinds.Phone.CONTACT_ID + "=?", new String[]{id}, null);
                    List<String> numberList = new ArrayList<String>();
                    phoneCur.moveToFirst();
                    do
                    {
                        String number = phoneCur.getString(phoneCur.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                        number = TextUtils.isEmpty(number) ? "" : number.replace(" ", "");

                        numberResult.put(number);
                    } while (phoneCur.moveToNext());

                    pluginResult.put("mobileNumbers", numberResult);

                    phoneCur.close();
                    this.contactCallback.success(pluginResult);

                } catch (Exception e) {
                    Logger.loge(ContactPickerPlugin.class, e.getMessage());
                }
            }

            this.contactCallback = null;
        }
    }
}
