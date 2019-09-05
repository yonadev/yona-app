package com.yona.plugin.services.utils;

public class YonaRuntimeException extends RuntimeException {
    public YonaRuntimeException(Throwable cause) {
        super(cause);
    }

    public YonaRuntimeException(String message) {
        super(message);
    }
}