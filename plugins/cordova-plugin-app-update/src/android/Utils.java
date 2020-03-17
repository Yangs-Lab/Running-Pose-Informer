package com.vaenow.appupdate.android;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by LuoWen on 16/7/22.
 */
public class Utils {

    static JSONObject makeJSON(int code, Object msg) {
        JSONObject json = new JSONObject();

        try {
            json.put("code", code);
            json.put("msg", msg);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return json;
    }

    static JSONObject makeJSONex(int code, Object msg, int localCode, int remoteCode,
                                 Object localName, Object remoteName) {
        JSONObject json = new JSONObject();

        try {
            json.put("code", code);
            json.put("msg", msg);
            json.put("localVersionCode", localCode);
            json.put("remoteVersionCode", remoteCode);
            json.put("localVersionName", localName);
            json.put("remoteVersionName", remoteName);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return json;
    }

    static JSONObject makeJSONex2(int code, Object msg, int value) {
        JSONObject json = new JSONObject();

        try {
            json.put("code", code);
            json.put("msg", msg);
            json.put("value", value);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return json;
    }
}
