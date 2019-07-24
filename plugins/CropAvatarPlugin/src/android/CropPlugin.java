package com.yona.crop;

import android.app.Activity;
import android.content.Intent;
import android.util.Base64;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.theartofdev.edmodo.cropper.CropImage;
import com.theartofdev.edmodo.cropper.CropImageView;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

import java.io.IOException;

public class CropPlugin extends CordovaPlugin {
    private CallbackContext callbackContext;

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
      if (action.equals("cropImage")) {
          String imagePath = args.getString(0);
          JSONObject options = args.getJSONObject(1);

          PluginResult pr = new PluginResult(PluginResult.Status.NO_RESULT);
          pr.setKeepCallback(true);
          callbackContext.sendPluginResult(pr);
          this.callbackContext = callbackContext;

          cordova.setActivityResultCallback(this);

          CropImage.activity()
				.setGuidelines(CropImageView.Guidelines.ON)
				.setCropShape(CropImageView.CropShape.OVAL)
				.setAspectRatio(1, 1)
				.setInitialCropWindowPaddingRatio(0)
				.start(cordova.getActivity());

          return true;
      }
      return false;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {

        if (requestCode == CropImage.CROP_IMAGE_ACTIVITY_REQUEST_CODE) {

            CropImage.ActivityResult result = CropImage.getActivityResult(intent);
            if (resultCode == Activity.RESULT_OK) {
                String imageBase64 = compressFile(result);
                this.callbackContext.success(imageBase64);
                this.callbackContext = null;
            } else if (resultCode == CropImage.CROP_IMAGE_ACTIVITY_RESULT_ERROR_CODE) {
                try {
                    JSONObject err = new JSONObject();
                    err.put("message", "Error on cropping");
                    err.put("code", String.valueOf(resultCode));
                    this.callbackContext.error(err);
                    this.callbackContext = null;
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                try {
                    JSONObject err = new JSONObject();
                    err.put("message", "User cancelled");
                    err.put("code", "userCancelled");
                    this.callbackContext.error(err);
                    this.callbackContext = null;
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        super.onActivityResult(requestCode, resultCode, intent);
    }

    private static String getBase64FromFile(File file) {
        String base64 = "";
        try {
            byte[] buffer = new byte[(int) file.length() + 100];
            @SuppressWarnings("resource")
            int length = new FileInputStream(file).read(buffer);
            base64 = Base64.encodeToString(buffer, 0, length,
                    Base64.DEFAULT);
            file.delete();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return base64;
    }


    private String compressFile(CropImage.ActivityResult result)
	{
		File file = new File(getTempDirectoryPath(), "prof_pic_" + System.currentTimeMillis() + ".jpeg|");
		try
		{
			FileInputStream fis = new FileInputStream(result.getUri().getPath());
			Bitmap imageBitmap = BitmapFactory.decodeStream(fis);
			imageBitmap = Bitmap.createScaledBitmap(imageBitmap, 90, 90, false);
			FileOutputStream fos = new FileOutputStream(file);
			imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos);
		}
		catch (FileNotFoundException e)
		{
			e.printStackTrace();
			return null;
		}

		return getBase64FromFile(file);
	}

    private String getTempDirectoryPath() {
        File cache = null;

        // SD Card Mounted
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            cache = new File(Environment.getExternalStorageDirectory().getAbsolutePath() +
                    "/Android/data/" + cordova.getActivity().getPackageName() + "/cache/");
        }
        // Use internal storage
        else {
            cache = cordova.getActivity().getCacheDir();
        }

        // Create the cache directory if it doesn't exist
        cache.mkdirs();
        return cache.getAbsolutePath();
    }
}
