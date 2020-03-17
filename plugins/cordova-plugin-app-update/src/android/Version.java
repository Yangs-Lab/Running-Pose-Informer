package com.vaenow.appupdate.android;

/**
 * Created by LuoWen on 2015/12/14.
 */
public class Version {
    private int local;
    private int remote;
    
  //public Version(int local, int remote) {
  //    this.local = local;
  //    this.remote = remote;
  //}
    // Byron, 2020/02/26 -------------------------
    private String localName;
    private String remoteName;
    
    public Version(int local, int remote, String localName, String remoteName) {
        this.local = local;
        this.remote = remote;
        this.localName = localName;
        this.remoteName = remoteName;
    }
    //--------------------------------------------

    public int getLocal() {
        return local;
    }

    public int getRemote() {
        return remote;
    }
    
    // Byron, 2020/02/26 -------------------------
    public String getLocalName() {
        return localName;
    }

    public String getRemoteName() {
        return remoteName;
    }
    // -------------------------------------------
}
