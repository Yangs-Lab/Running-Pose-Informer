/* index.js -- javascript for index.html
 * 
 * Purpose: for VEGA Mobile
 * Author:  Byron Yang
 */
// cordova-plugin-media -- record & play audio
// cordova-plugin-dns -- manually resolve hostnames into 
var app = {
  isEmulation: false,
  // Application Constructor
  click_backButton: false,
  initialize: function() {
    console.log('app.initialize ..... ');
    this.bindEvents();
  },
  // Bind events which will be required on app. startup. 
  // Common events are: 'load', 'deviceready', 'offline', 'online', ...
  bindEvents: function() {
    document.addEventListener('online', this.onOnline, false);
    document.addEventListener('offline', this.onOffline, false);
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler --
  //   The scope of 'this' is the event. In order to call the 'receivedEvent'
  //   function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    console.log('onDeviceReady()-- enter, platformId is ' + device.platform);
  //console.log('onDeviceReady()-- cordova:\n' + JSON.stringify(cordova));
    console.log('onDeviceReady()-- device: ', JSON.stringify(device));
  //alert('onDeviceReady()-- device: ' + JSON.stringify(device));
  //alert('onDeviceReady()-- AppVersion: ' + JSON.stringify(AppVersion));

    document.addEventListener('backbutton', app.onBackKeyDown, false);
    $('#src_url')[0].innerHTML = '';
    
    // check if running in Android, iOS, iPad, Browser, ...
    if (device.platform == 'Android') {
      /* */if (device.model == 'AOSP on IA Emulator') app.isEmulation = true;
      else if (device.model == 'Android SDK built for x86') app.isEmulation = true;
    } else
    if (device.platform == 'iOS') {        // device.model for iPhone, iPad, ...
      app.isEmulation = true;
    } else
    if (device.platform == 'browser') {    // device.model for Chrome, Safari, ...
      app.isEmulation = false;
    } else
    if (device.platform == 'BlackBerry') { // device.model for Torch, ...
      app.isEmulation = true;
    } else
    if (device.platform == 'OSX') {        // device.model for x86_64, ...
      app.isEmulation = true;
    }

    // plugin-battery, monitor battery status
    window.addEventListener("batterystatus", app.onBatteryStatus, false);
    window.addEventListener("batterylow", app.onBatteryLow, false);
    window.addEventListener("batterycritical", app.onBatteryCritical, false);
    
    // plugin-screen-orientation, lock for 'portrait'
    if (device.platform != 'browser') {
      console.log('onDeviceReady()-- screen.orientation.type: ' + screen.orientation.type);
      screen.orientation.lock('portrait-primary');
      window.addEventListener("orientationchange", app.onOrientationChange, false);
    }

    // plugin-statusbar, hide status bar.
    if (device.platform != 'browser') {
      StatusBar.hide();
    }
    
    // ** Check if not 'browser' but 'app' mode
    if (device.platform != 'browser') {   
      // cordova-plugin-app-version, retrieve name, code & version of app
      if (typeof cordova.getAppVersion != 'undefined') {
        cordova.getAppVersion.getAppName(app.onAppNameOk, app.onAppNameFail);
        cordova.getAppVersion.getVersionNumber(app.onAppVersionNumberOk, app.onAppVersionNumberFail);
        // the following don't work well ???  
      //cordova.getAppVersion.getAppPackageName(app.onAppPackageNameOk, app.onAppPackageNameFail);
      //cordova.getAppVersion.getVersionCode(app.onVersionCodeOk, app.onAppVersionCodeFail);
      } else {
        console.log("onDeviceReady()-- module 'getAppVersion', running in browser or non-app mode");
      }
    }
  
    // cordova-plugin-vibration, inform device & every thing is ready
    if (device.platform != 'browser') {
    //navigator.vibrate(333);
    }
     
    // set fields of 'device'
    $("#dev_cordova")[0].innerHTML = device.cordova;
    $("#dev_platform")[0].innerHTML = device.platform;
    $("#dev_version")[0].innerHTML = device.version;
    $("#dev_manufacturer")[0].innerHTML = device.manufacturer;
    $("#dev_model")[0].innerHTML = device.model;
    $("#dev_serial")[0].innerHTML = device.serial;
    $("#dev_uuid")[0].innerHTML = device.uuid;

    // Disable GUI item of browser mode
    $(".cls_browser").css("display", device.platform=='browser'?"none":"block");

    console.log('onDeviceReady()-- exit');
    console.log('----------------------');
  },
  toggleSidebar: function() {
    var sidebar = document.getElementById("sidebar");
    var side_ul = document.getElementById("sidebar_ul");
    var width = 232; // sync. with .css
  //console.log("toggleSidebar()-- sidebar: >" , sidebar.style.left + '<');
    if (sidebar.style.left == '' ||
        sidebar.style.left == ("-" + width + "px")) {
      side_ul.style.left = width + "px";
      sidebar.style.left = "0px";
      $('#sidebar').addClass('on');
    } else {
      side_ul.style.left = "0px";
      sidebar.style.left = "-" + width + "px";
      $('#sidebar').removeClass('on');
    }
  },
  click_menu: function(id) {
  //console.log("app.click_menu()-- id: " + id);
    var menu = ["Information", "Settings", "Monitor", "Broadcast"];
    for (var i in menu) {
      if (menu[i] == id) continue;
      $('#'+menu[i]).removeClass('in');
    }
  },
  click_href: function(content_page, obj, init) {
  //console.log('app.click_href()-- init: ' + init + ', ' + content_page + ', obj:', obj);
    $('.cls-content').hide(); 
    obj.href = content_page;
    $('.cls-content').show(); 
    if (init === true) return;
    $('#sidemenu').trigger('click');
  },
  // string to array buffer
  str2ab: function(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0,strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },
  confirmBox: function(message, fnCallback) {
    var title = "VEGA Mobile";
    navigator.notification.confirm(message, function(btnIdx) {
      if (typeof fnCallback != 'undefined') fnCallback();
    }, title, "");
  }, 
  confirm_exit_app: function() {
    var title   = "VEGA Mobile";
    var message = "Are you sure you want to exit?";
    var buttons = ""; // "Yes,No";
    navigator.notification.confirm(message, function(btnIdx) {
      if (btnIdx != 1) return; // 0: close, 1: Ok, 2: Cancel
      navigator.app.exitApp();
    }, title, buttons);
  },
  // Event - key down, 'ESC' for keyboard or 'return' for mobile phone
  onBackKeyDown: function() {
    // Check if side menu visible  
    if ($('#sidebar').hasClass('on')) {
      app.toggleSidebar();
      return;
    }
    app.confirm_exit_app();
  },
  // menu - onReloadApp
  onReloadApp: function(obj) {
    window.location.reload();
  },
  // menu - onExitApp
  onExitApp: function() {
    app.toggleSidebar();
    app.confirm_exit_app();
  },
  //// cordova-plugin-screen-orientation ------
  // screen orientation change, following definition
  //    portrait-primary,  portrait-secondary,  portrait
  //    landscape-primary, landscape-secondary, landscape
  //    any
  onOrientationChange: function() {
    console.log("onOrientationChange()-- " + screen.orientation.type); 
  },
  //// cordova-plugin-app-version ------
  // event: 'getAppName'
  onAppNameOk: function(name) {
    console.log("onAppNameOk()-- " + name);
  //alert("onAppNameOk()-- " + name);
    $("#app_name")[0].innerHTML = name;
  },
  onAppNameFail: function(err) {
    console.log("onAppNameFail()-- " + err);
  },
  // event: 'getAppVersionNumber'
  onAppVersionNumberOk: function(versionNumber) {
    console.log("onAppVersionNumberOk()-- " + versionNumber);
  //alert("onAppVersionNumberOk()-- " + versionNumber);
    $("#app_version")[0].innerHTML = versionNumber;
  },
  onAppVersionNumberFail: function(err) {
    console.log("onAppVersionNumberFail()-- " + err);
  },
  // event: 'getAppPackageName'
  onAppPackageNameOk: function(pkgName) {
    console.log("onAppPackageNameOk()-- " + pkgName);
    alert("onAppPackageNameOk()-- " + pkgName);
  },
  onAppPackageNameFail: function(err) {
    console.log("onAppNameFail()-- " + err);
  },
  // event: 'getAppVersionCode'
  onAppVersionCodeOk: function(versionCode) {
    console.log("onAppVersionCodeOk()-- " + versionCode);
    alert("onAppVersionCodeOk()-- " + versionCode);
  },
  onAppVersionCodeFail: function(err) {
    console.log("onAppVersionCodeFail()-- " + err);
  },
  //// cordova-plugin-battery-status ------
  // event: 'batterystatus', battery status changed
  onBatteryStatus: function(status) {
    console.log("onBatteryStatus()-- " + status.level + "%, " + 
                (status.isPlugged?"charging":"battery") + " mode");
  },
  // event: 'batterylow', battery is too low < 20%
  onBatteryLow: function(status) {
    console.log("onBatteryLow()-- " + status.level + " !!!");
  },
  // event: 'batterycritical', battery lower than critical level < 5%
  onBatteryCritical: function(status) {
    console.log("onBatteryCritical()-- " + status.level + " !!!");
  },
  //// cordova-plugin-network-information ------
  // event: 'online', device becomes connection, app can access the internet. 
  onOnline: function() {
    console.log('onOnline()-- Connection: ', JSON.stringify(navigator.connection || navigator.network.connection));
  },
  // event: 'offline', device loses connection, app cannot longer access the internet. 
  onOffline: function() {
    console.log('onOffline()-- Connection: ', JSON.stringify(navigator.connection || navigator.network.connection));
  }
};
