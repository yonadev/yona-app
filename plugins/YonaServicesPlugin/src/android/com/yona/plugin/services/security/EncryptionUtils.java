package com.yona.plugin.services.security;

import android.content.Context;
import android.os.Build;

import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;

import com.yona.plugin.services.utils.Logger;
import com.yona.plugin.services.utils.YonaRuntimeException;


public class EncryptionUtils
{

    public static String encrypt(Context context, String plaintext)
    {
        return getSecurityKey(context).encrypt(plaintext);
    }

    public static String decrypt(Context context, String ciphertext)
    {
        return getSecurityKey(context).decrypt(ciphertext);
    }

    private static SecurityKey getSecurityKey(Context context)
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
        {
            return EncryptionKeyGenerator.getSecurityKey(getKeyStore());
        }
        return EncryptionKeyGenerator.getSecurityKey(context, getKeyStore());
    }

    private static KeyStore getKeyStore()
    {
        try
        {
            KeyStore keyStore;
            keyStore = KeyStore.getInstance(EncryptionKeyGenerator.ANDROID_KEY_STORE);
            keyStore.load(null);
            return keyStore;
        }
        catch (KeyStoreException | CertificateException | NoSuchAlgorithmException | IOException e)
        {
            Logger.loge(EncryptionUtils.class, e.getMessage());
            throw new YonaRuntimeException(e);
        }
    }

    public static void clear()
    {
        KeyStore keyStore = getKeyStore();
        try
        {
            if (keyStore.containsAlias(EncryptionKeyGenerator.KEY_ALIAS))
            {
                keyStore.deleteEntry(EncryptionKeyGenerator.KEY_ALIAS);
            }
        }
        catch (KeyStoreException e)
        {
            Logger.loge(EncryptionUtils.class, e.getMessage());
        }
    }
}