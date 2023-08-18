package com.govt.module.utils;

public class Util {
    public static long hash(String[] values) {
        long result = 17;
        for (String v:values) {
            result = result * 37 + v.hashCode();
        }
        return result;
    }
}
