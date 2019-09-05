package com.yona.plugin.services.security;

public class MyCipherData
{

    private final byte[] data;
    private final byte[] iv;

    public MyCipherData(byte[] data, byte[] iv)
    {
        this.data = data;
        this.iv = iv;
    }

    public byte[] getData()
    {
        return data;
    }

    public byte[] getIV()
    {
        return iv;
    }

}