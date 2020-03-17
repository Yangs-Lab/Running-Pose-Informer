/* Enhanced class of Advantech, 
 * Byron, 2017/03/16
 */
var ADVC = ADVC || function(){};

ADVC.browser = ADVC.browser || function() {
	function uaMatch(ua) {
		var rchrome = /(chrome)[ \/]([\w.]+)/;
		var rsafari = /(safari)[ \/]([\w.]+)/;
		var rwebkit = /(webkit)[ \/]([\w.]+)/;
		var ropera  = /(opera)(?:.*version)?[ \/]([\w.]+)/;
		var rmsie   = /(msie) ([\w.]+)/;
		var rmozilla= /(mozilla)(?:.*? rv:([\w.]+))?/;
		var match = rchrome.exec(ua)||rsafari.exec(ua)||rwebkit.exec(ua)||ropera.exec(ua)||rmsie.exec(ua)||ua.indexOf("compatible")<0&&rmozilla.exec(ua)||[];
		return {browser:match[1]||"", version:match[2]||"0"}
	}
	var b = {};
	var ua = navigator.userAgent.toLowerCase();
	var match = uaMatch(ua);
	var additionals = ["iphone","ipod","ipad","android","mini"];
	b[match.browser] = true;
	b.version = match.version;
	if (b.chrome || b.safari) b.webkit = true;
	for(var i=0,l=additionals.length; i<l; i++)
		if(!!ua.match(additionals[i]))
			b[additionals[i]] = true;
	if (ua.match(/trident/)) {
		b["msie"] = true;
		b["version"] = ua.match(/(msie\s|rv[ :])([\d\.]+)/)[2]
	}
	return b;
}();

(function(){
  // base --
  ADVC.base = function(args) {
    var that = {};
    that._private = {};
    return that;
  };
  // utils
  ADVC.utils = {
    isBoolean: function(value) {
      return typeof value==="boolean";
    },
    isString: function(value) {
      return typeof value==="string";
    },
    isObject: function(value) {
      return (typeof value==="object") && (value? true: false);
    },
    isArray: function(value) {
      return ADVC.utils.isObject(value)
          && typeof value.length==="number"
          && typeof value.splice==="function"
          && !value.propertyIsEnumerable("length");
    },
    getTagHtml: function(tagName, id, classes, innerHTML) {
      var classesStr = ADVC.utils.isArray(classes)? 'class="' + classes.concatToStr(' ') + '"': '';
      var idStr = id && ADVC.utils.isString(id)? 'id="' + id + '_' + tagName.toUpperCase() + '"': '';
      var _innerHTML = ADVC.utils.isString(innerHTML)? innerHTML: '';
      var html = '<' + tagName + ' ' + idStr + ' ' + classesStr + '>' + _innerHTML + '</' + tagName + '>';
      return html;
    }
  };
  // full screen --
  ADVC.fullScreen = function() {
    var that = ADVC.base();
    that.enable = function() {
			return (document.documentElement.requestFullscreen? true:
							document.documentElement.webkitRequestFullscreen? true:
							document.documentElement.mozRequestFullScreen? true:
							document.documentElement.msRequestFullscreen? true: false);
    };
    that.is_enable = function(doc) {
			if (typeof doc == "undefined") doc = document;
			if (doc.webkitIsFullScreen ) return doc.webkitIsFullScreen;
			if (doc.mozFullScreen      ) return doc.mozFullScreen;
			if (doc.fullscreenElement  ) return doc.fullscreenElement;
			if (doc.msFullscreenElement) return doc.msFullscreenElement;
			return false; 
    };
		that.enter = function(id_name, doc, exit_handler) {
			if (typeof id_name == 'undefined' || id_name == "") return;
			if (typeof doc == "undefined" ) doc = document;
			var elm = doc.getElementById(id_name);
			if (elm == null) return;
			if (elm.requestFullscreen) {
				if (typeof exit_handler != 'undefined') 
				doc.addEventListener('fullscreenchange', exit_handler, false);
				elm.requestFullscreen();
			} else 
			if (elm.webkitRequestFullscreen) {
				if (typeof exit_handler != 'undefined') 
				doc.addEventListener('webkitfullscreenchange', exit_handler, false);
				elm.webkitRequestFullscreen();
			} else 
			if (elm.mozRequestFullScreen) {
				if (typeof exit_handler != 'undefined') 
				doc.addEventListener('mozfullscreenchange', exit_handler, false);
				elm.mozRequestFullScreen();
			} else 
			if (elm.msRequestFullscreen) {
				if (typeof exit_handler != 'undefined') 
				doc.addEventListener('MSFullscreenChange', exit_handler, false);
				elm.msRequestFullscreen();
			}
		};
		that.exit = function() {
			/* */if (document.exitFullscreen)       document.exitFullscreen();
			else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
			else if (document.mozCancelFullScreen)  document.mozCancelFullScreen();
			else if (document.msExitFullscreen)     document.msExitFullscreen();
		};
    return that;
  };
  // curtain --
  ADVC.curtain = function() {
    var that = ADVC.base();
    that.created = false;
    that.name = "curtain";
    that.display = function(show) {
    //console.log("that.created: " + that.created);
      if (that.created != true) return that;
      $("#"+that.name+"_DIV").css("display", (show? "block": "none"));
    //$("#"+that.name+"x_DIV", window.parent.frames[0].document).css("display", (show? "block": "none"));
      return that;
    };
    that.create = function() {
    //console.log("create()-- that.created: " + that.created);
      $("body").append(ADVC.utils.getTagHtml("div", that.name));
    //if (typeof window.parent.frames[0] == "undefined") return that;
    //$("body", window.parent.frames[0].document).append(ADVC.utils.getTagHtml("div", that.name+'x'));
      that.created = true;
      return that;
    }
    return that;
  };
  //
  ADVC.base64 = {
    encode:function(str){
      var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var i=0, len=str.length, out="";
      var c1, c2, c3;
      var i=0, len=str.length, out="";
      while(i<len){
        c1 = str.charCodeAt(i++)&255;
        if(i===len){
          out += chars.charAt(c1>>2);
          out += chars.charAt((c1&3)<<4);
          out += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if(i===len){
          out += chars.charAt(c1>>2);
          out += chars.charAt((c1&3)<<4|(c2&240)>>4);
          out += chars.charAt((c2&15)<<2);
          out += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        out += chars.charAt(c1>>2);
        out += chars.charAt((c1&3)<<4|(c2&240)>>4);
        out += chars.charAt((c2&15)<<2|(c3&192)>>6);
        out += chars.charAt(c3&63)
      }
      return out;
    },
    decode:function(str){
      var chars=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                 -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                 -1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,
                 -1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,
                 22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,
                 37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1];
      var c1, c2, c3, c4;
      var i=0, len=str.length, out="";
      while(i<len){
        do c1 = chars[str.charCodeAt(i++)&255];
        while(i<len && c1===-1);
        if(c1===-1) break;
        do c2 = chars[str.charCodeAt(i++)&255];while(i<len&&c2===-1);
        if(c2===-1) break;
        out += String.fromCharCode(c1<<2|(c2&48)>>4);
        do{
          c3 = str.charCodeAt(i++)&255;
          if(c3===61) return out;
          c3 = chars[c3]
        } while(i<len&&c3===-1);
        if(c3===-1) break;
        out += String.fromCharCode((c2&15)<<4|(c3&60)>>2);
        do{
          c4 = str.charCodeAt(i++)&255;
          if(c4===61) return out;
          c4 = chars[c4]
        } while(i<len&&c4===-1);
        if(c4===-1) break;
        out+=String.fromCharCode((c3&3)<<6|c4)
      }
      return out;
    }
  }
})();

function _console_log(msg) {
  var elm = parent.document.getElementById("inter_message"); 
  elm.innerHTML = msg; elm.click();
}

function _get_source_url() {
  var src_url = parent.document.getElementById("src_url").innerHTML;
//_console_log('_get_source_url()-- ' + src_url);
  return src_url;
}

function _is_emulator() {
  var str = parent.document.getElementById("dev_emulator").innerHTML;
//_console_log('_is_emulator()-- ' + str);
  return str;
}

function _check_to_page(page_id, mode) {
//console.log("_check_to_page()-- mode: " + mode);
  $('.nav a[href="#'+page_id+'"]').tab('show');           
  // scroll to top & show tab page
  window.scroll(0,0);
  document.getElementById('tab-contents').style.display = 'block';
  window.scroll(0,0);
  //
  g_curtain.display(mode);
}

function reloadPage(url) {
	console.log("url: " + url);
	if (typeof url !== "undefined")
		window.location = url;
	else
		window.location.reload();
}

function msleep(msec) {
	var start = new Date().getTime();
	while((new Date().getTime()-start) <= msec);
}

function correct_cgi(data) {
	var dd = data.split('\n'); data = '';
	for(var i in dd)
		if (dd[i].substr(0,4) == 'var ')
			data += dd[i] + '\n';
	return data;
}

function resize_iframe_4app() {
  var iframe = parent.document.getElementById('content_page');
  var docHeight = $(parent.document).height();
  var topHeight = iframe.offsetTop;
  iframe.height = (docHeight-topHeight) - 16;
}

function adv_init(no_tab) {
  console.log("\n"+window.location.pathname.replace("/","")+"+++++++");
  resize_iframe_4app();
  if (typeof no_tab != 'undefined') return;
  document.getElementById('tab-contents').style.display = 'none';
}
