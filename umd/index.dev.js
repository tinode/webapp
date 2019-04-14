/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../tinode-js/umd/tinode.prod.js":
/*!***************************************!*\
  !*** ../tinode-js/umd/tinode.prod.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {!function(e){if(true)module.exports=e();else {}}(function(){var e={exports:{}},t=[{name:"ST",start:/(?:^|\W)(\*)[^\s*]/,end:/[^\s*](\*)(?=$|\W)/},{name:"EM",start:/(?:^|[\W_])(_)[^\s_]/,end:/[^\s_](_)(?=$|[\W_])/},{name:"DL",start:/(?:^|\W)(~)[^\s~]/,end:/[^\s~](~)(?=$|\W)/},{name:"CO",start:/(?:^|\W)(`)[^`]/,end:/[^`](`)(?=$|\W)/}],n=[{name:"LN",dataName:"url",pack:function(e){return/^[a-z]+:\/\//i.test(e)||(e="http://"+e),{url:e}},re:/(?:(?:https?|ftp):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/gi},{name:"MN",dataName:"val",pack:function(e){return{val:e.slice(1)}},re:/\B@(\w\w+)/g},{name:"HT",dataName:"val",pack:function(e){return{val:e.slice(1)}},re:/\B#(\w\w+)/g}],i={ST:{name:"b",isVoid:!1},EM:{name:"i",isVoid:!1},DL:{name:"del",isVoid:!1},CO:{name:"tt",isVoid:!1},BR:{name:"br",isVoid:!0},LN:{name:"a",isVoid:!1},MN:{name:"a",isVoid:!1},HT:{name:"a",isVoid:!1},IM:{name:"img",isVoid:!0},FM:{name:"div",isVoid:!1},RW:{name:"div",isVoid:!1},BN:{name:"button",isVoid:!1},HD:{name:"",isVoid:!1}};function s(e,t){var n;try{for(var i=(n=atob(e)).length,s=new ArrayBuffer(i),r=new Uint8Array(s),o=0;o<i;o++)r[o]=n.charCodeAt(o);return URL.createObjectURL(new Blob([s],{type:t}))}catch(a){console.log("Drafty: failed to convert object.",a.message)}return null}var r={ST:{open:function(){return"<b>"},close:function(){return"</b>"}},EM:{open:function(){return"<i>"},close:function(){return"</i>"}},DL:{open:function(){return"<del>"},close:function(){return"</del>"}},CO:{open:function(){return"<tt>"},close:function(){return"</tt>"}},BR:{open:function(){return"<br/>"},close:function(){return""}},HD:{open:function(){return""},close:function(){return""}},LN:{open:function(e){return'<a href="'+e.url+'">'},close:function(e){return"</a>"},props:function(e){return e?{href:e.url,target:"_blank"}:null}},MN:{open:function(e){return'<a href="#'+e.val+'">'},close:function(e){return"</a>"},props:function(e){return e?{name:e.val}:null}},HT:{open:function(e){return'<a href="#'+e.val+'">'},close:function(e){return"</a>"},props:function(e){return e?{name:e.val}:null}},BN:{open:function(e){return"<button>"},close:function(e){return"</button>"},props:function(e){return e?{"data-act":e.act,"data-val":e.val,"data-name":e.name,"data-ref":e.ref}:null}},IM:{open:function(e){var t=s(e.val,e.mime),n=e.ref?e.ref:t;return(e.name?'<a href="'+n+'" download="'+e.name+'">':"")+'<img src="'+t+'"'+(e.width?' width="'+e.width+'"':"")+(e.height?' height="'+e.height+'"':"")+' border="0" />'},close:function(e){return e.name?"</a>":""},props:function(e){return e?{src:s(e.val,e.mime),title:e.name,"data-width":e.width,"data-height":e.height,"data-name":e.name,"data-size":e.val?.75*e.val.length|0:0,"data-mime":e.mime}:null}},FM:{open:function(e){return"<div>"},close:function(e){return"</div>"}},RW:{open:function(e){return"<div>"},close:function(e){return"</div>"}}},o=function(){};o.parse=function(e){if("string"!=typeof e)return null;var i=e.split(/\r?\n/),s=[],r={},o=[];i.map(function(e){var i,a,c=[];if(t.map(function(t){c=c.concat(function(e,t,n,i){for(var s=[],r=0,o=e.slice(0);o.length>0;){var a=t.exec(o);if(null==a)break;var c=a.index+a[0].lastIndexOf(a[1]);o=o.slice(c+1),r=(c+=r)+1;var u=n?n.exec(o):null;if(null==u)break;var h=u.index+u[0].indexOf(u[1]);o=o.slice(h+1),r=(h+=r)+1,s.push({text:e.slice(c+1,h),children:[],start:c,end:h,type:i})}return s}(e,t.start,t.end,t.name))}),0==c.length)a={txt:e};else{c.sort(function(e,t){return e.start-t.start}),c=function e(t){if(0==t.length)return[];for(var n=[t[0]],i=t[0],s=1;s<t.length;s++)t[s].start>i.end?(n.push(t[s]),i=t[s]):t[s].end<i.end&&i.children.push(t[s]);for(var s in n)n[s].children=e(n[s].children);return n}(c);var u=function e(t,n){var i="",s=[];for(var r in t){var o=t[r];if(!o.text){var a=e(o.children,i.length+n);o.text=a.txt,s=s.concat(a.fmt)}o.type&&s.push({at:i.length+n,len:o.text.length,tp:o.type}),i+=o.text}return{txt:i,fmt:s}}(function e(t,n,i,s){var r=[];if(0==s.length)return[];for(var o in s){var a=s[o];a.start>n&&r.push({text:t.slice(n,a.start)});var c={type:a.type},u=e(t,a.start+1,a.end-1,a.children);u.length>0?c.children=u:c.text=a.text,r.push(c),n=a.end+1}return n<i&&r.push({text:t.slice(n,i)}),r}(e,0,e.length,c),0);a={txt:u.txt,fmt:u.fmt}}if((i=function(e){var t,i=[];if(n.map(function(n){for(;null!==(t=n.re.exec(e));)i.push({offset:t.index,len:t[0].length,unique:t[0],data:n.pack(t[0]),type:n.name})}),0==i.length)return i;i.sort(function(e,t){return e.offset-t.offset});var s=-1;return i=i.filter(function(e){var t=e.offset>s;return s=e.offset+e.len,t})}(a.txt)).length>0){var h=[];for(var l in i){var d=i[l],f=r[d.unique];f||(f=s.length,r[d.unique]=f,s.push({tp:d.type,data:d.data})),h.push({at:d.offset,len:d.len,key:f})}a.ent=h}o.push(a)});var a={txt:""};if(o.length>0){a.txt=o[0].txt,a.fmt=(o[0].fmt||[]).concat(o[0].ent||[]);for(var c=1;c<o.length;c++){var u=o[c],h=a.txt.length+1;a.fmt.push({tp:"BR",len:1,at:h-1}),a.txt+=" "+u.txt,u.fmt&&(a.fmt=a.fmt.concat(u.fmt.map(function(e){return e.at+=h,e}))),u.ent&&(a.fmt=a.fmt.concat(u.ent.map(function(e){return e.at+=h,e})))}0==a.fmt.length&&delete a.fmt,s.length>0&&(a.ent=s)}return a},o.insertImage=function(e,t,n,i,s,r,o,a,c){return(e=e||{txt:" "}).ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:t,len:1,key:e.ent.length}),e.ent.push({tp:"IM",data:{mime:n,val:i,width:s,height:r,name:o,ref:c,size:0|a}}),e},o.appendImage=function(e,t,n,i,s,r,a,c){return(e=e||{txt:""}).txt+=" ",o.insertImage(e,e.txt.length-1,t,n,i,s,r,a,c)},o.attachFile=function(e,t,n,i,s,r){(e=e||{txt:""}).ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:-1,len:0,key:e.ent.length});var o={tp:"EX",data:{mime:t,val:n,name:i,ref:r,size:0|s}};return r instanceof Promise&&(o.data.ref=r.then(function(e){o.data.ref=e},function(e){})),e.ent.push(o),e},o.wrapAsForm=function(e,t,n){return"string"==typeof e&&(e={txt:e}),e.fmt=e.fmt||[],e.fmt.push({at:t,len:n,tp:"FM"}),e},o.insertButton=function(e,t,n,i,s,r,o){return"string"==typeof e&&(e={txt:e}),!e||!e.txt||e.txt.length<t+n?null:n<=0||-1==["url","pub"].indexOf(s)?null:"url"!=s||o?(o=""+o,e.ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:t,len:n,key:e.ent.length}),e.ent.push({tp:"BN",data:{act:s,val:r,ref:o,name:i}}),e):null},o.appendButton=function(e,t,n,i,s,r){var a=(e=e||{txt:""}).txt.length;return e.txt+=t,o.insertButton(e,a,t.length,n,i,s,r)},o.attachJSON=function(e,t){return(e=e||{txt:""}).ent=e.ent||[],e.fmt=e.fmt||[],e.fmt.push({at:-1,len:0,key:e.ent.length}),e.ent.push({tp:"EX",data:{mime:"application/json",val:t}}),e},o.appendLineBreak=function(e){return(e=e||{txt:""}).fmt=e.fmt||[],e.fmt.push({at:e.txt.length,len:1,tp:"BR"}),e.txt+=" ",e},o.UNSAFE_toHTML=function(e){var t,n,i,s=e.txt,o=e.fmt,a=e.ent,c=[];if(o)for(var u in o){var h=o[u],l=h.tp,d=void 0;if(!l){var f=a[0|h.key];f&&(l=f.tp,d=f.data)}r[l]&&(c.push({idx:h.at+h.len,len:-h.len,what:r[l].close(d)}),c.push({idx:h.at,len:h.len,what:r[l].open(d)}))}for(var p in c.sort(function(e,t){return t.idx==e.idx?t.len-e.len:t.idx-e.idx}),c)c[p].what&&(t=s,n=c[p].idx,i=c[p].what,s=t.slice(0,n)+i+t.slice(n));return s},o.format=function(e,t,n){var s=e.txt,r=e.fmt,o=e.ent;if(s=s||"",Array.isArray(o)||(o=[]),!Array.isArray(r)){if(1!=o.length)return[s];r=[{at:0,len:0,key:0}]}var a=[].concat(r);return a.map(function(e){e.at=e.at||0,e.len=e.len||0,e.len<0&&(e.len=0),e.at<-1&&(e.at=-1)}),a.sort(function(e,t){return e.at-t.at==0?t.len-e.len:e.at-t.at}),a=a.map(function(e){var t,n=e.tp;return n||(e.key=e.key||0,o[e.key]&&(t=o[e.key].data,n=o[e.key].tp)),{tp:n=n||"HD",data:t,at:e.at,len:e.len}}),function e(t,n,s,r,o,a){for(var c=[],u=0;u<r.length;u++){var h=r[u];if(!(h.at<0)){n<h.at&&(c.push(o.call(a,null,void 0,t.slice(n,h.at),c.length)),n=h.at);for(var l=[],d=u+1;d<r.length&&r[d].at<h.at+h.len;d++)l.push(r[d]),u=d;var f=i[h.tp]||{};c.push(o.call(a,h.tp,h.data,f.isVoid?null:e(t,n,h.at+h.len,l,o,a),c.length)),n=h.at+h.len}}return n<s&&c.push(o.call(a,null,void 0,t.slice(n,s),c.length)),c}(s,0,s.length,a,t,n)},o.toPlainText=function(e){return"string"==typeof e?e:e.txt},o.isPlainText=function(e){return"string"==typeof e||!(e.fmt||e.ent)},o.hasAttachments=function(e){if(e.ent&&e.ent.length>0)for(var t in e.ent)if(e.ent[t]&&"EX"==e.ent[t].tp)return!0;return!1},o.attachments=function(e,t,n){if(e.ent&&e.ent.length>0)for(var i in e.ent)e.ent[i]&&"EX"==e.ent[i].tp&&t.call(n,e.ent[i].data,i)},o.getDownloadUrl=function(e){var t=null;return"application/json"!=e.mime&&e.val?t=s(e.val,e.mime):"string"==typeof e.ref&&(t=e.ref),t},o.isUploading=function(e){return e.ref instanceof Promise},o.getPreviewUrl=function(e){return e.val?s(e.val,e.mime):null},o.getEntitySize=function(e){return e.size?e.size:e.val?.75*e.val.length|0:0},o.getEntityMimeType=function(e){return e.mime||"text/plain"},o.tagName=function(e){return i[e]?i[e].name:void 0},o.attrValue=function(e,t){if(t&&r[e])return r[e].props(t)},o.getContentType=function(){return"text/x-drafty"},e.exports=o,e=e.exports;var a="0.15.14",c={exports:{}};return function(t){"use strict";function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}if(true)var i=a;var s;"undefined"!=typeof WebSocket&&(s=WebSocket),"undefined"==typeof btoa&&(t.btoa=function(){for(var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n="",i=0,s=0,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";t.charAt(0|s)||(r="=",s%1);n+=r.charAt(63&i>>8-s%1*8)){if((e=t.charCodeAt(s+=.75))>255)throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");i=i<<8|e}return n}),"undefined"==typeof atob&&(t.atob=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/=+$/,""),t="";if(e.length%4==1)throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,i=0,s=0,r=0;n=e.charAt(r++);~n&&(s=i%4?64*s+n:n,i++%4)?t+=String.fromCharCode(255&s>>(-2*i&6)):0)n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(n);return t}),"undefined"==typeof window&&(t.window={WebSocket:s,URL:{createObjectURL:function(){throw new Error("Unable to use window.URL in a non browser application")}}});var r="0",o=i||"0.15",u="tinodejs/"+o,h=503,l="Connection failed",d=418,f="Disconnected by client";function p(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))}function g(e,t,i){if("object"!=n(t)){if(t===S.DEL_CHAR)return;return void 0===t?e:t}if(null===t)return t;if(t instanceof Date)return e&&e instanceof Date&&!(e<t)?e:t;if(t instanceof T)return new T(t);if(t instanceof Array)return t;for(var s in e&&e!==S.DEL_CHAR||(e=t.constructor()),t)!t.hasOwnProperty(s)||i&&i[s]||"_noForwarding"==s||(e[s]=g(e[s],t[s]));return e}function v(e,t,n,i){return e[t]=g(e[t],n,i),e[t]}function _(){var e=null;if("withCredentials"in new XMLHttpRequest)e=new XMLHttpRequest;else{if("undefined"==typeof XDomainRequest)throw new Error("Browser not supported");e=new XDomainRequest}return e}function m(e,t){if("ts"===e&&"string"==typeof t&&t.length>=20&&t.length<=24){var i=new Date(t);if(i)return i}else if("acs"===e&&"object"===n(t))return new T(t);return t}function b(e,t){return"string"==typeof t&&t.length>128?"<"+t.length+", bytes: "+t.substring(0,12)+"..."+t.substring(t.length-12)+">":function(e,t){if(t instanceof Date)t=function(e){if(e&&0!=e.getTime()){var t=e.getUTCMilliseconds();return e.getUTCFullYear()+"-"+n(e.getUTCMonth()+1)+"-"+n(e.getUTCDate())+"T"+n(e.getUTCHours())+":"+n(e.getUTCMinutes())+":"+n(e.getUTCSeconds())+(t?"."+n(t,3):"")+"Z"}function n(e,t){return"0".repeat((t=t||2)-(""+e).length)+e}}(t);else if(null==t||!1===t||Array.isArray(t)&&0==t.length||"object"==n(t)&&0==Object.keys(t).length)return;return t}(0,t)}function w(e,t,n){var i=null;return"http"!==t&&"https"!==t&&"ws"!==t&&"wss"!==t||(i=t+"://","/"!==(i+=e).charAt(i.length-1)&&(i+="/"),i+="v"+r+"/channels","http"!==t&&"https"!==t||(i+="/lp"),i+="?apikey="+n),i}var M=function(e,t,i,r,o){var a=this,c=e,u=r,p=t,g=o,v=2e3,b=10,M=.3,S=null,y=0,T=!1,D=function(e){a.logger&&a.logger(e)};function x(){var e=this;clearTimeout(S);var t=v*(Math.pow(2,y)*(1+M*Math.random()));y=y>=b?y:y+1,this.onAutoreconnectIteration&&this.onAutoreconnectIteration(t),S=setTimeout(function(){if(D("Reconnecting, iter="+y+", timeout="+t),T)e.onAutoreconnectIteration&&e.onAutoreconnectIteration(-1);else{var n=e.connect();e.onAutoreconnectIteration?e.onAutoreconnectIteration(0,n):n.catch(function(){})}},t)}function E(){clearTimeout(S),S=null,y=0}function A(e){var t=null;e.connect=function(n){return T=!1,t&&t.readyState==t.OPEN?Promise.resolve():(n&&(c=n),new Promise(function(n,i){var r=w(c,u?"wss":"ws",p);D("Connecting to: "+r);var o=new s(r);o.onopen=function(t){e.onOpen&&e.onOpen(),n(),g&&E()},o.onclose=function(n){if(t=null,e.onDisconnect){var i=T?d:h;e.onDisconnect(new Error(T?f:l+" ("+i+")"),i)}!T&&g&&x.call(e)},o.onerror=function(e){i(e)},o.onmessage=function(t){e.onMessage&&e.onMessage(t.data)},t=o}))},e.reconnect=function(){E(),e.connect()},e.disconnect=function(){T=!0,t&&(E(),t.close(),t=null)},e.sendText=function(e){if(!t||t.readyState!=t.OPEN)throw new Error("Websocket is not connected");t.send(e)},e.isConnected=function(){return t&&t.readyState==t.OPEN},e.transport=function(){return"ws"},e.probe=function(){e.sendText("1")}}function R(e){var t=null,n=null,i=null;e.connect=function(i){return T=!1,n?Promise.resolve():(i&&(c=i),new Promise(function(i,s){var r=w(c,u?"https":"http",p);D("Connecting to: "+r),(n=function n(i,s,r){var o=_(),a=!1;return o.onreadystatechange=function(c){if(4==o.readyState)if(201==o.status){var u=JSON.parse(o.responseText,m);t=i+"&sid="+u.ctrl.params.sid,(o=n(t)).send(null),e.onOpen&&e.onOpen(),s&&(a=!0,s()),g&&E()}else if(o.status<400)e.onMessage&&e.onMessage(o.responseText),(o=n(t)).send(null);else{if(r&&!a&&(a=!0,r(o.responseText)),e.onMessage&&o.responseText&&e.onMessage(o.responseText),e.onDisconnect){var p=o.status||(T?d:h),v=o.responseText||(T?f:l);e.onDisconnect(new Error(v+" ("+p+")"),p)}o=null,!T&&g&&x.call(e)}},o.open("GET",i,!0),o}(r,i,s)).send(null)}).catch(function(){}))},e.reconnect=function(){E(),e.connect()},e.disconnect=function(){T=!0,E(),i&&(i.onreadystatechange=void 0,i.abort(),i=null),n&&(n.onreadystatechange=void 0,n.abort(),n=null),e.onDisconnect&&e.onDisconnect(new Error(f+" ("+d+")"),d),t=null},e.sendText=function(e){var n,s;if(n=t,(s=_()).onreadystatechange=function(e){if(4==s.readyState&&s.status>=400)throw new Error("LP sender failed, "+s.status)},s.open("POST",n,!0),!(i=s)||1!=i.readyState)throw new Error("Long poller failed to connect");i.send(e)},e.isConnected=function(){return n&&!0},e.transport=function(){return"lp"},e.probe=function(){e.sendText("1")}}"lp"===i?R(this):"ws"===i?A(this):"object"==("undefined"==typeof window?"undefined":n(window))&&window.WebSocket?A(this):R(this),this.onMessage=void 0,this.onDisconnect=void 0,this.onOpen=void 0,this.onAutoreconnectIteration=void 0,this.logger=void 0},S=function(e,t,i,s,r,a){var c=this;this._appName=e||"Undefined",this._apiKey=i,this._browser="",this._platform=a,this._hwos="undefined",this._humanLanguage="xx","undefined"!=typeof navigator&&(this._browser=function(e,t){e=e||"";var n="";/reactnative/i.test(t)&&(n="ReactNative; ");var i,s=(e=e.replace(" (KHTML, like Gecko)","")).match(/(AppleWebKit\/[.\d]+)/i);if(s){for(var r=["chrome","safari","mobile","version"],o=e.substr(s.index+s[0].length).split(" "),a=[],c=function(e){var t=/([\w.]+)[\/]([\.\d]+)/.exec(o[e]);t&&a.push([t[1],t[2],r.findIndex(function(e){return e==t[1].toLowerCase()})])},u=0;u<o.length;u++)c(u);a.sort(function(e,t){var n=e[2]-t[2];return 0!=n?n:t[0].length-e[0].length}),i=a.length>0?a[0][0]+"/"+a[0][1]:s[1]}else i=/trident/i.test(e)?(s=/(?:\brv[ :]+([.\d]+))|(?:\bMSIE ([.\d]+))/g.exec(e))?"MSIE/"+(s[1]||s[2]):"MSIE/?":/firefox/i.test(e)?(s=/Firefox\/([.\d]+)/g.exec(e))?"Firefox/"+s[1]:"Firefox/?":/presto/i.test(e)?(s=/Opera\/([.\d]+)/g.exec(e))?"Opera/"+s[1]:"Opera/?":(s=/([\w.]+)\/([.\d]+)/.exec(e))?s[1]+"/"+s[2]:(s=e.split(" "))[0];if((s=i.split("/")).length>1){var h=s[1].split(".");i=s[0]+"/"+h[0]+(h[1]?"."+h[1]:"")}return n+i}(navigator.userAgent,navigator.product),this._hwos=navigator.platform,this._humanLanguage=navigator.language||"en-US"),this._loggingEnabled=!1,this._trimLongStrings=!1,this._myUID=null,this._authenticated=!1,this._login=null,this._authToken=null,this._inPacketCount=0,this._messageId=Math.floor(65535*Math.random()+65535),this._serverInfo=null,this._deviceToken=null,this._pendingPromises={},this._connection=new M(t,i,s,r,!0),this.logger=function(e){if(c._loggingEnabled){var t=new Date,n=("0"+t.getUTCHours()).slice(-2)+":"+("0"+t.getUTCMinutes()).slice(-2)+":"+("0"+t.getUTCSeconds()).slice(-2)+":"+("0"+t.getUTCMilliseconds()).slice(-3);console.log("["+n+"] "+e)}},this._connection.logger=this.logger,this._cache={};var l=this.cachePut=function(e,t,n){c._cache[e+":"+t]=n},d=this.cacheGet=function(e,t){return c._cache[e+":"+t]},f=this.cacheDel=function(e,t){delete c._cache[e+":"+t]},p=this.cacheMap=function(e,t){for(var n in c._cache)if(e(c._cache[n],n,t))break};this.attachCacheToTopic=function(e){e._tinode=c,e._cacheGetUser=function(e){var t=d("user",e);if(t)return{user:e,public:g({},t)}},e._cachePutUser=function(e,t){return l("user",e,g({},t.public))},e._cacheDelUser=function(e){return f("user",e)},e._cachePutSelf=function(){return l("topic",e.name,e)},e._cacheDelSelf=function(){return f("topic",e.name)}};var v=function(e,t,n,i){var s=c._pendingPromises[e];s&&(delete c._pendingPromises[e],t>=200&&t<400?s.resolve&&s.resolve(n):s.reject&&s.reject(new Error("Error: "+i+" ("+t+")")))},_=this.getNextUniqueId=function(){return 0!=c._messageId?""+c._messageId++:void 0};this.initPacket=function(e,t){switch(e){case"hi":return{hi:{id:_(),ver:o,ua:c._appName+" ("+(c._browser?c._browser+"; ":"")+c._hwos+"); "+u,dev:c._deviceToken,lang:c._humanLanguage,platf:c._platform}};case"acc":return{acc:{id:_(),user:null,scheme:null,secret:null,login:!1,tags:null,desc:{},cred:{}}};case"login":return{login:{id:_(),scheme:null,secret:null}};case"sub":return{sub:{id:_(),topic:t,set:{},get:{}}};case"leave":return{leave:{id:_(),topic:t,unsub:!1}};case"pub":return{pub:{id:_(),topic:t,noecho:!1,head:null,content:{}}};case"get":return{get:{id:_(),topic:t,what:null,desc:{},sub:{},data:{}}};case"set":return{set:{id:_(),topic:t,desc:{},sub:{},tags:[]}};case"del":return{del:{id:_(),topic:t,what:null,delseq:null,user:null,hard:!1}};case"note":return{note:{topic:t,what:null,seq:void 0}};default:throw new Error("Unknown packet type requested: "+e)}},this.send=function(e,t){var i;t&&(i=function(e){var t=null;return e&&(t=new Promise(function(t,n){c._pendingPromises[e]={resolve:t,reject:n}})),t}(t)),e=function e(t){return Object.keys(t).forEach(function(i){"_"==i[0]?delete t[i]:t[i]?Array.isArray(t[i])&&0==t[i].length?delete t[i]:t[i]?"object"!=n(t[i])||t[i]instanceof Date||(e(t[i]),0==Object.getOwnPropertyNames(t[i]).length&&delete t[i]):delete t[i]:delete t[i]}),t}(e);var s=JSON.stringify(e);c.logger("out: "+(c._trimLongStrings?JSON.stringify(e,b):s));try{c._connection.sendText(s)}catch(r){if(!t)throw r;v(t,h,null,r.message)}return i},this.loginSuccessful=function(e){e.params&&e.params.user&&(c._myUID=e.params.user,c._authenticated=e&&e.code>=200&&e.code<300,e.params&&e.params.token&&e.params.expires?c._authToken={token:e.params.token,expires:new Date(e.params.expires)}:c._authToken=null,c.onLogin&&c.onLogin(e.code,e.text))},this._connection.onMessage=function(e){if(e)if(c._inPacketCount++,c.onRawMessage&&c.onRawMessage(e),"0"!==e){var t=JSON.parse(e,m);t?(c.logger("in: "+(c._trimLongStrings?JSON.stringify(t,b):e)),c.onMessage&&c.onMessage(t),t.ctrl?(c.onCtrlMessage&&c.onCtrlMessage(t.ctrl),t.ctrl.id&&v(t.ctrl.id,t.ctrl.code,t.ctrl,t.ctrl.text),setTimeout(function(){if(205==t.ctrl.code&&"evicted"==t.ctrl.text){var e=d("topic",t.ctrl.topic);e&&e._resetSub()}else if(t.ctrl.params&&"data"==t.ctrl.params.what){var n=d("topic",t.ctrl.topic);n&&n._allMessagesReceived(t.ctrl.params.count)}},0)):setTimeout(function(){if(t.meta){var e=d("topic",t.meta.topic);e&&e._routeMeta(t.meta),c.onMetaMessage&&c.onMetaMessage(t.meta)}else if(t.data){var n=d("topic",t.data.topic);n&&n._routeData(t.data),c.onDataMessage&&c.onDataMessage(t.data)}else if(t.pres){var i=d("topic",t.pres.topic);i&&i._routePres(t.pres),c.onPresMessage&&c.onPresMessage(t.pres)}else if(t.info){var s=d("topic",t.info.topic);s&&s._routeInfo(t.info),c.onInfoMessage&&c.onInfoMessage(t.info)}else c.logger("ERROR: Unknown packet received.")},0)):(c.logger("in: "+e),c.logger("ERROR: failed to parse data"))}else c.onNetworkProbe&&c.onNetworkProbe()},this._connection.onOpen=function(){c.hello()},this._connection.onAutoreconnectIteration=function(e,t){c.onAutoreconnectIteration&&c.onAutoreconnectIteration(e,t)},this._connection.onDisconnect=function(e,t){for(var n in c._inPacketCount=0,c._serverInfo=null,c._authenticated=!1,p(function(e,t){0===t.lastIndexOf("topic:",0)&&e._resetSub()}),c._pendingPromises){var i=c._pendingPromises[n];i&&i.reject&&i.reject(e)}c._pendingPromises={},c.onDisconnect&&c.onDisconnect(e)}};S.credential=function(e,t,i,s){if("object"==n(e)){var r=e;t=r.val,i=r.params,s=r.resp,e=r.meth}return e&&(t||s)?[{meth:e,val:t,resp:s,params:i}]:null},S.topicType=function(e){return{me:"me",fnd:"fnd",grp:"grp",new:"grp",usr:"p2p"}["string"==typeof e?e.substring(0,3):"xxx"]},S.isNewGroupTopicName=function(e){return"string"==typeof e&&"new"==e.substring(0,3)},S.getVersion=function(){return o},S.setWebSocketProvider=function(e){s=e},S.getLibrary=function(){return u},S.MESSAGE_STATUS_NONE=0,S.MESSAGE_STATUS_QUEUED=1,S.MESSAGE_STATUS_SENDING=2,S.MESSAGE_STATUS_FAILED=3,S.MESSAGE_STATUS_SENT=4,S.MESSAGE_STATUS_RECEIVED=5,S.MESSAGE_STATUS_READ=6,S.MESSAGE_STATUS_TO_ME=7,S.DEL_CHAR="\u2421",S.prototype={connect:function(e){return this._connection.connect(e)},reconnect:function(){this._connection.reconnect()},disconnect:function(){this._connection.disconnect()},networkProbe:function(){this._connection.probe()},isConnected:function(){return this._connection.isConnected()},isAuthenticated:function(){return this._authenticated},account:function(e,t,n,i,s){var r=this.initPacket("acc");return r.acc.user=e,r.acc.scheme=t,r.acc.secret=n,r.acc.login=i,s&&(r.acc.desc.defacs=s.defacs,r.acc.desc.public=s.public,r.acc.desc.private=s.private,r.acc.tags=s.tags,r.acc.cred=s.cred,r.acc.token=s.token),this.send(r,r.acc.id)},createAccount:function(e,t,n,i){var s=this,r=this.account("new",e,t,n,i);return n&&(r=r.then(function(e){return s.loginSuccessful(e),e})),r},createAccountBasic:function(e,t,n){return e=e||"",t=t||"",this.createAccount("basic",p(e+":"+t),!0,n)},updateAccountBasic:function(e,t,n,i){return t=t||"",n=n||"",this.account(e,"basic",p(t+":"+n),!1,i)},hello:function(){var e=this,t=this.initPacket("hi");return this.send(t,t.hi.id).then(function(t){return t.params&&(e._serverInfo=t.params),e.onConnect&&e.onConnect(),t}).catch(function(t){e.onDisconnect&&e.onDisconnect(t)})},setDeviceToken:function(e,t){var n=!1;return e&&e!=this._deviceToken&&(this._deviceToken=e,t&&this.isConnected()&&this.isAuthenticated()&&(this.send({hi:{dev:e}}),n=!0)),n},login:function(e,t,n){var i=this,s=this.initPacket("login");return s.login.scheme=e,s.login.secret=t,s.login.cred=n,this.send(s,s.login.id).then(function(e){return i.loginSuccessful(e),e})},loginBasic:function(e,t,n){var i=this;return this.login("basic",p(e+":"+t),n).then(function(t){return i._login=e,t})},loginToken:function(e,t){return this.login("token",e,t)},requestResetAuthSecret:function(e,t,n){return this.login("reset",p(e+":"+t+":"+n))},getAuthToken:function(){return this._authToken&&this._authToken.expires.getTime()>Date.now()?this._authToken:(this._authToken=null,null)},setAuthToken:function(e){this._authToken=e},subscribe:function(e,t,n){var i=this.initPacket("sub",e);return e||(e="new"),i.sub.get=t,n&&(n.sub&&(i.sub.set.sub=n.sub),n.desc&&(S.isNewGroupTopicName(e)?i.sub.set.desc=n.desc:"p2p"==S.topicType(e)&&n.desc.defacs&&(i.sub.set.desc={defacs:n.desc.defacs})),n.tags&&(i.sub.set.tags=n.tags)),this.send(i,i.sub.id)},leave:function(e,t){var n=this.initPacket("leave",e);return n.leave.unsub=t,this.send(n,n.leave.id)},createMessage:function(t,n,i){var s=this.initPacket("pub",t),r="string"==typeof n?e.parse(n):n;return r&&!e.isPlainText(r)&&(s.pub.head={mime:e.getContentType()},n=r),s.pub.noecho=i,s.pub.content=n,s.pub},publish:function(e,t,n){return this.publishMessage(this.createMessage(e,t,n))},publishMessage:function(e){return(e=Object.assign({},e)).seq=void 0,e.from=void 0,e.ts=void 0,this.send({pub:e},e.id)},getMeta:function(e,t){var n=this.initPacket("get",e);return n.get=g(n.get,t),this.send(n,n.get.id)},setMeta:function(e,t){var n=this.initPacket("set",e),i=[];return t&&["desc","sub","tags"].map(function(e){t.hasOwnProperty(e)&&(i.push(e),n.set[e]=t[e])}),0==i.length?Promise.reject(new Error("Invalid {set} parameters")):this.send(n,n.set.id)},delMessages:function(e,t,n){var i=this.initPacket("del",e);return i.del.what="msg",i.del.delseq=t,i.del.hard=n,this.send(i,i.del.id)},delTopic:function(e){var t=this,n=this.initPacket("del",e);return n.del.what="topic",this.send(n,n.del.id).then(function(n){return t.cacheDel("topic",e),t.ctrl})},delSubscription:function(e,t){var n=this.initPacket("del",e);return n.del.what="sub",n.del.user=t,this.send(n,n.del.id)},note:function(e,t,n){if(n<=0||n>=268435455)throw new Error("Invalid message id "+n);var i=this.initPacket("note",e);i.note.what=t,i.note.seq=n,this.send(i)},noteKeyPress:function(e){var t=this.initPacket("note",e);t.note.what="kp",this.send(t)},getTopic:function(e){var t=this.cacheGet("topic",e);return!t&&e&&(t="me"==e?new x:"fnd"==e?new E:new D(e),this.cachePut("topic",e,t),this.attachCacheToTopic(t)),t},newTopic:function(e){var t=new D("new",e);return this.attachCacheToTopic(t),t},newGroupTopicName:function(){return"new"+this.getNextUniqueId()},newTopicWith:function(e,t){var n=new D(e,t);return this.attachCacheToTopic(n),n},getMeTopic:function(){return this.getTopic("me")},getFndTopic:function(){return this.getTopic("fnd")},getLargeFileHelper:function(){return new A(this)},getCurrentUserID:function(){return this._myUID},isMe:function(e){return this._myUID===e},getCurrentLogin:function(){return this._login},getServerInfo:function(){return this._serverInfo},enableLogging:function(e,t){this._loggingEnabled=e,this._trimLongStrings=e&&t},isTopicOnline:function(e){var t=this.getMeTopic(),n=t&&t.getContact(e);return n&&n.online},wantAkn:function(e){this._messageId=e?Math.floor(16777215*Math.random()+16777215):0},onWebsocketOpen:void 0,onConnect:void 0,onDisconnect:void 0,onLogin:void 0,onCtrlMessage:void 0,onDataMessage:void 0,onPresMessage:void 0,onMessage:void 0,onRawMessage:void 0,onNetworkProbe:void 0,onAutoreconnectIteration:void 0};var y=function(e){this.topic=e;var t=e._tinode.getMeTopic();this.contact=t&&t.getContact(e.name),this.what={}};y.prototype={_get_ims:function(){var e=this.contact&&this.contact.updated,t=this.topic._lastDescUpdate||0;return e>t?e:t},withData:function(e,t,n){return this.what.data={since:e,before:t,limit:n},this},withLaterData:function(e){return this.withData(this.topic._maxSeq>0?this.topic._maxSeq+1:void 0,void 0,e)},withEarlierData:function(e){return this.withData(void 0,this.topic._minSeq>0?this.topic._minSeq:void 0,e)},withDesc:function(e){return this.what.desc={ims:e},this},withLaterDesc:function(){return this.withDesc(this._get_ims())},withSub:function(e,t,n){var i={ims:e,limit:t};return"me"==this.topic.getType()?i.topic=n:i.user=n,this.what.sub=i,this},withOneSub:function(e,t){return this.withSub(e,void 0,t)},withLaterOneSub:function(e){return this.withOneSub(this.topic._lastSubsUpdate,e)},withLaterSub:function(e){return this.withSub("p2p"==this.topic.getType()?this._get_ims():this.topic._lastSubsUpdate,e)},withTags:function(){return this.what.tags=!0,this},withDel:function(e,t){return(e||t)&&(this.what.del={since:e,limit:t}),this},withLaterDel:function(e){return this.withDel(this.topic._maxSeq>0?this.topic._maxDel+1:void 0,e)},build:function(){var e=[],t=this,n={};return["data","sub","desc","tags","del"].map(function(i){t.what.hasOwnProperty(i)&&(e.push(i),Object.getOwnPropertyNames(t.what[i]).length>0&&(n[i]=t.what[i]))}),e.length>0?n.what=e.join(" "):n=void 0,n}};var T=function e(t){t&&(this.given="number"==typeof t.given?t.given:e.decode(t.given),this.want="number"==typeof t.want?t.want:e.decode(t.want),this.mode=t.mode?"number"==typeof t.mode?t.mode:e.decode(t.mode):this.given&this.want)};T._NONE=0,T._JOIN=1,T._READ=2,T._WRITE=4,T._PRES=8,T._APPROVE=16,T._SHARE=32,T._DELETE=64,T._OWNER=128,T._BITMASK=T._JOIN|T._READ|T._WRITE|T._PRES|T._APPROVE|T._SHARE|T._DELETE|T._OWNER,T._INVALID=1048576,T._checkFlag=function(e,t,n){if(["given","want","mode"].includes(t=t||"mode"))return 0!=(e[t]&n);throw new Error("Invalid AccessMode component '"+t+"'")},T.decode=function(e){if(!e)return null;if("number"==typeof e)return e&T._BITMASK;if("N"===e||"n"===e)return T._NONE;for(var t={J:T._JOIN,R:T._READ,W:T._WRITE,P:T._PRES,A:T._APPROVE,S:T._SHARE,D:T._DELETE,O:T._OWNER},n=T._NONE,i=0;i<e.length;i++){var s=t[e.charAt(i).toUpperCase()];s&&(n|=s)}return n},T.encode=function(e){if(null===e||e===T._INVALID)return null;if(e===T._NONE)return"N";for(var t=["J","R","W","P","A","S","D","O"],n="",i=0;i<t.length;i++)0!=(e&1<<i)&&(n+=t[i]);return n},T.update=function(e,t){if(!t||"string"!=typeof t)return e;var n=t.charAt(0);if("+"==n||"-"==n){for(var i=e,s=t.split(/([-+])/),r=1;r<s.length-1;r+=2){n=s[r];var o=T.decode(s[r+1]);if(o==T._INVALID)return e;null!=o&&("+"===n?i|=o:"-"===n&&(i&=~o))}e=i}else{var a=T.decode(t);a!=T._INVALID&&(e=a)}return e},T.prototype={toString:function(){return'{mode: "'+T.encode(this.mode)+'", given: "'+T.encode(this.given)+'", want: "'+T.encode(this.want)+'"}'},setMode:function(e){return this.mode=T.decode(e),this},updateMode:function(e){return this.mode=T.update(this.mode,e),this},getMode:function(){return T.encode(this.mode)},setGiven:function(e){return this.given=T.decode(e),this},updateGiven:function(e){return this.given=T.update(this.given,e),this},getGiven:function(){return T.encode(this.given)},setWant:function(e){return this.want=T.decode(e),this},updateWant:function(e){return this.want=T.update(this.want,e),this},getWant:function(){return T.encode(this.want)},getMissing:function(){return T.encode(this.want&~this.given)},getExcessive:function(){return T.encode(this.given&~this.want)},updateAll:function(e){return e&&(this.updateGiven(e.given),this.updateWant(e.want),this.mode=this.given&this.want),this},isOwner:function(e){return T._checkFlag(this,e,T._OWNER)},isPresencer:function(e){return T._checkFlag(this,e,T._PRES)},isMuted:function(e){return!this.isPresencer(e)},isJoiner:function(e){return T._checkFlag(this,e,T._JOIN)},isReader:function(e){return T._checkFlag(this,e,T._READ)},isWriter:function(e){return T._checkFlag(this,e,T._WRITE)},isApprover:function(e){return T._checkFlag(this,e,T._APPROVE)},isAdmin:function(e){return this.isOwner(e)||this.isApprover(e)},isSharer:function(e){return this.isAdmin(e)||T._checkFlag(this,e,T._SHARE)},isDeleter:function(e){return T._checkFlag(this,e,T._DELETE)}};var D=function(e,t){this._tinode=null,this.name=e,this.created=null,this.updated=null,this.touched=null,this.acs=new T(null),this.private=null,this.public=null,this._users={},this._queuedSeqId=268435455,this._maxSeq=0,this._minSeq=0,this._noEarlierMsgs=!1,this._maxDel=0,this._tags=[],this._messages=function(e){var t=[];function n(t,n,i){for(var s=0,r=n.length-1,o=0,a=0,c=!1;s<=r;)if((a=e(n[o=(s+r)/2|0],t))<0)s=o+1;else{if(!(a>0)){c=!0;break}r=o-1}return c?o:i?-1:a<0?o+1:o}return e=e||function(e,t){return e===t?0:e<t?-1:1},{getAt:function(e){return t[e]},put:function(){var e,i,s;for(var r in e=1==arguments.length&&Array.isArray(arguments[0])?arguments[0]:arguments)i=e[r],(s=t).splice(n(i,s,!1),0,i)},delAt:function(e){var n=t.splice(e,1);if(n&&n.length>0)return n[0]},delRange:function(e,n){return t.splice(e,n-e)},size:function(){return t.length},reset:function(e){t=[]},forEach:function(e,n,i,s){n|=0,i=i||t.length;for(var r=n;r<i;r++)e.call(s,t[r],r)},find:function(e,i){return n(e,t,!i)}}}(function(e,t){return e.seq-t.seq}),this._subscribed=!1,this._lastDescUpdate=null,this._lastSubsUpdate=null,this._new=!0,t&&(this.onData=t.onData,this.onMeta=t.onMeta,this.onPres=t.onPres,this.onInfo=t.onInfo,this.onMetaDesc=t.onMetaDesc,this.onMetaSub=t.onMetaSub,this.onSubsUpdated=t.onSubsUpdated,this.onTagsUpdated=t.onTagsUpdated,this.onDeleteTopic=t.onDeleteTopic,this.onAllMessagesReceived=t.onAllMessagesReceived)};D.prototype={isSubscribed:function(){return this._subscribed},subscribe:function(e,t){var n=this;return this._subscribed?Promise.resolve(this):this._tinode.subscribe(this.name||"new",e,t).then(function(e){if(e.code>=300)return e;if(n._subscribed=!0,n.acs=e.params&&e.params.acs?e.params.acs:n.acs,n._new){n._new=!1,n.name=e.topic,n.created=e.ts,n.updated=e.ts,n._cachePutSelf();var i=n._tinode.getMeTopic();i&&i._processMetaSub([{_noForwarding:!0,topic:n.name,created:e.ts,updated:e.ts,acs:n.acs}]),t&&t.desc&&(t.desc._noForwarding=!0,n._processMetaDesc(t.desc))}return e})},createMessage:function(e,t){return this._tinode.createMessage(this.name,e,t)},publish:function(e,t){return this.publishMessage(this.createMessage(e,t))},publishMessage:function(t){var n=this;if(!this._subscribed)return Promise.reject(new Error("Cannot publish on inactive topic"));if(e.hasAttachments(t.content)&&!t.head.attachments){var i=[];e.attachments(t.content,function(e){i.push(e.ref)}),t.head.attachments=i}return t._sending=!0,t._failed=!1,this._tinode.publishMessage(t).then(function(e){return t._sending=!1,t.seq=e.params.seq,t.ts=e.ts,n._routeData(t),e}).catch(function(e){console.log("Message rejected by the server",e),t._sending=!1,t._failed=!0,n.onData&&n.onData()})},publishDraft:function(e,t){var n=this;if(!t&&!this._subscribed)return Promise.reject(new Error("Cannot publish on inactive topic"));var i=e.seq||this._getQueuedSeqId();return e._noForwarding||(e._noForwarding=!0,e.seq=i,e.ts=new Date,e.from=this._tinode.getCurrentUserID(),e.noecho=!0,this._messages.put(e),this.onData&&this.onData(e)),(t||Promise.resolve()).then(function(){return e._cancelled?{code:300,text:"cancelled"}:n.publishMessage(e)},function(t){console.log("Message draft rejected by the server",t),e._sending=!1,e._failed=!0,n._messages.delAt(n._messages.find(e)),n.onData&&n.onData()})},leave:function(e){var t=this;return this._subscribed||e?this._tinode.leave(this.name,e).then(function(n){return t._resetSub(),e&&t._gone(),n}):Promise.reject(new Error("Cannot leave inactive topic"))},getMeta:function(e){return this._tinode.getMeta(this.name,e)},getMessagesPage:function(e,t){var n=this,i=this.startMetaQuery();t?i.withLaterData(e):i.withEarlierData(e);var s=this.getMeta(i.build());return t||(s=s.then(function(e){e&&e.params&&!e.params.count&&(n._noEarlierMsgs=!0)})),s},setMeta:function(e){var t=this;return e.tags&&(e.tags=function(e){var t=[];if(Array.isArray(e)){for(var n=0,i=e.length;n<i;n++){var s=e[n];s&&(s=s.trim().toLowerCase()).length>1&&t.push(s)}t.sort().filter(function(e,t,n){return!t||e!=n[t-1]})}return 0==t.length&&t.push(S.DEL_CHAR),t}(e.tags)),this._tinode.setMeta(this.name,e).then(function(n){return n&&n.code>=300?n:(e.sub&&(n.params&&n.params.acs&&(e.sub.acs=n.params.acs,e.sub.updated=n.ts),e.sub.user||(e.sub.user=t._tinode.getCurrentUserID(),e.desc||(e.desc={})),e.sub._noForwarding=!0,t._processMetaSub([e.sub])),e.desc&&(n.params&&n.params.acs&&(e.desc.acs=n.params.acs,e.desc.updated=n.ts),t._processMetaDesc(e.desc)),e.tags&&t._processMetaTags(e.tags),n)})},invite:function(e,t){return this.setMeta({sub:{user:e,mode:t}})},archive:function(e){return this.private&&this.private.arch==e?Promise.resolve(e):this.setMeta({desc:{private:{arch:!!e||S.DEL_CHAR}}})},delMessages:function(e,t){var n=this;if(!this._subscribed)return Promise.reject(new Error("Cannot delete messages in inactive topic"));e.sort(function(e,t){return e.low<t.low||e.low==t.low&&(!t.hi||e.hi>=t.hi)});var i=e.reduce(function(e,t){return t.low<268435455&&(!t.hi||t.hi<268435455?e.push(t):e.push({low:t.low,hi:n._maxSeq+1})),e},[]);return(i.length>0?this._tinode.delMessages(this.name,i,t):Promise.resolve({params:{del:0}})).then(function(t){return t.params.del>n._maxDel&&(n._maxDel=t.params.del),e.map(function(e){e.hi?n.flushMessageRange(e.low,e.hi):n.flushMessage(e.low)}),n.onData&&n.onData(),t})},delMessagesAll:function(e){return this.delMessages([{low:1,hi:this._maxSeq+1,_all:!0}],e)},delMessagesList:function(e,t){e.sort(function(e,t){return e-t});var n=e.reduce(function(e,t){if(0==e.length)e.push({low:t});else{var n=e[e.length-1];!n.hi&&t!=n.low+1||t>n.hi?e.push({low:t}):n.hi=n.hi?Math.max(n.hi,t+1):t+1}return e},[]);return this.delMessages(n,t)},delTopic:function(){var e=this;return this._tinode.delTopic(this.name).then(function(t){return e._resetSub(),e._gone(),t})},delSubscription:function(e){var t=this;return this._subscribed?this._tinode.delSubscription(this.name,e).then(function(n){return delete t._users[e],t.onSubsUpdated&&t.onSubsUpdated(Object.keys(t._users)),n}):Promise.reject(new Error("Cannot delete subscription in inactive topic"))},note:function(e,t){var n=this._users[this._tinode.getCurrentUserID()];n?(!n[e]||n[e]<t)&&(this._subscribed?this._tinode.note(this.name,e,t):this._tinode.logger("Not sending {note} on inactive topic"),n[e]=t):this._tinode.logger("note(): user not found "+this._tinode.getCurrentUserID());var i=this._tinode.getMeTopic();i&&i.setMsgReadRecv(this.name,e,t)},noteRecv:function(e){this.note("recv",e)},noteRead:function(e){this.note("read",e)},noteKeyPress:function(){this._subscribed?this._tinode.noteKeyPress(this.name):this._tinode.logger("Cannot send notification in inactive topic")},userDesc:function(e){var t=this._cacheGetUser(e);if(t)return t},p2pPeerDesc:function(){if("p2p"==this.getType())return this._users[this.name]},subscribers:function(e,t){var n=e||this.onMetaSub;if(n)for(var i in this._users)n.call(t,this._users[i],i,this._users)},tags:function(){return this._tags.slice(0)},subscriber:function(e){return this._users[e]},messages:function(e,t,n,i){var s=e||this.onData;if(s){var r="number"==typeof t?this._messages.find({seq:t}):void 0,o="number"==typeof n?this._messages.find({seq:n},!0):void 0;-1!=r&&-1!=o&&this._messages.forEach(s,r,o,i)}},queuedMessages:function(e,t){if(!e)throw new Error("Callback must be provided");this.messages(e,268435455,void 0,t)},msgReceiptCount:function(e,t){var n=0;if(t>0){var i=this._tinode.getCurrentUserID();for(var s in this._users){var r=this._users[s];r.user!==i&&r[e]>=t&&n++}}return n},msgReadCount:function(e){return this.msgReceiptCount("read",e)},msgRecvCount:function(e){return this.msgReceiptCount("recv",e)},msgHasMoreMessages:function(e){return e?this.seq>this._maxSeq:this._minSeq>1&&!this._noEarlierMsgs},isNewMessage:function(e){return this._maxSeq<=e},flushMessage:function(e){var t=this._messages.find({seq:e});return t>=0?this._messages.delAt(t):void 0},flushMessageRange:function(e,t){var n=this._messages.find({seq:e});return n>=0?this._messages.delRange(n,this._messages.find({seq:t},!0)):[]},cancelSend:function(e){var t=this._messages.find({seq:e});if(t>=0){var n=this._messages.getAt(t),i=this.msgStatus(n);if(1==i||3==i)return n._cancelled=!0,this._messages.delAt(t),this.onData&&this.onData(),!0}return!1},getType:function(){return S.topicType(this.name)},getAccessMode:function(){return this.acs},getDefaultAccess:function(){return this.defacs},startMetaQuery:function(){return new y(this)},isArchived:function(){return!(!this.private||!this.private.arch)},msgStatus:function(e){var t=0;return this._tinode.isMe(e.from)?e._sending?t=2:e._failed?t=3:e.seq>=268435455?t=1:this.msgReadCount(e.seq)>0?t=6:this.msgRecvCount(e.seq)>0?t=5:e.seq>0&&(t=4):t=7,t},_routeData:function(e){e.content&&((!this.touched||this.touched<e.ts)&&(this.touched=e.ts),e._noForwarding||this._messages.put(e)),e.seq>this._maxSeq&&(this._maxSeq=e.seq),(e.seq<this._minSeq||0==this._minSeq)&&(this._minSeq=e.seq),this.onData&&this.onData(e);var t=this._tinode.getMeTopic();t&&t.setMsgReadRecv(this.name,this._tinode.isMe(e.from)?"read":"msg",e.seq,e.ts)},_routeMeta:function(e){e.desc&&(this._lastDescUpdate=e.ts,this._processMetaDesc(e.desc)),e.sub&&e.sub.length>0&&(this._lastSubsUpdate=e.ts,this._processMetaSub(e.sub)),e.del&&this._processDelMessages(e.del.clear,e.del.delseq),e.tags&&this._processMetaTags(e.tags),this.onMeta&&this.onMeta(e)},_routePres:function(e){var t;switch(e.what){case"del":this._processDelMessages(e.clear,e.delseq);break;case"on":case"off":(t=this._users[e.src])?t.online="on"==e.what:this._tinode.logger("Presence update for an unknown user",this.name,e.src);break;case"acs":if(t=this._users[e.src])t.acs.updateAll(e.dacs),this._processMetaSub([{user:e.src,updated:new Date,acs:t.acs}]);else{var n=(new T).updateAll(e.dacs);n&&n.mode!=T._NONE&&((t=this._cacheGetUser(e.src))?t.acs=n:(t={user:e.src,acs:n},this.getMeta(this.startMetaQuery().withOneSub(void 0,e.src).build())),t.updated=new Date,this._processMetaSub([t]))}break;default:this._tinode.logger("Ignored presence update",e.what)}this.onPres&&this.onPres(e)},_routeInfo:function(e){if("kp"!==e.what){var t=this._users[e.from];if(t&&(t[e.what]=e.seq,t.recv<t.read&&(t.recv=t.read)),this._tinode.isMe(e.from)){var n=this._tinode.getMeTopic();n&&n.setMsgReadRecv(e.topic,e.what,e.seq)}}this.onInfo&&this.onInfo(e)},_processMetaDesc:function(e){if("p2p"==this.getType()&&delete e.defacs,g(this,e),"string"==typeof this.created&&(this.created=new Date(this.created)),"string"==typeof this.updated&&(this.updated=new Date(this.updated)),"string"==typeof this.touched&&(this.touched=new Date(this.touched)),"me"!==this.name&&!e._noForwarding){var t=this._tinode.getMeTopic();t&&t._processMetaSub([{_noForwarding:!0,topic:this.name,updated:this.updated,touched:this.touched,acs:e.acs,public:e.public,private:e.private}])}this.onMetaDesc&&this.onMetaDesc(this)},_processMetaSub:function(e){for(var t in e){var n=e[t];n.updated=new Date(n.updated),n.deleted=n.deleted?new Date(n.deleted):null;var i=null;n.deleted?(delete this._users[n.user],i=n):(this._tinode.isMe(n.user)&&n.acs&&this._processMetaDesc({updated:n.updated||new Date,touched:n.updated,acs:n.acs}),i=this._updateCachedUser(n.user,n)),this.onMetaSub&&this.onMetaSub(i)}this.onSubsUpdated&&this.onSubsUpdated(Object.keys(this._users))},_processMetaTags:function(e){1==e.length&&e[0]==S.DEL_CHAR&&(e=[]),this._tags=e,this.onTagsUpdated&&this.onTagsUpdated(e)},_processDelMessages:function(e,t){this._maxDel=Math.max(e,this._maxDel),this.clear=Math.max(e,this.clear);var n=this,i=0;Array.isArray(t)&&t.map(function(e){if(e.hi)for(var t=e.low;t<e.hi;t++)i++,n.flushMessage(t);else i++,n.flushMessage(e.low)}),i>0&&this.onData&&this.onData()},_allMessagesReceived:function(e){this.onAllMessagesReceived&&this.onAllMessagesReceived(e)},_resetSub:function(){this._subscribed=!1},_gone:function(){this._messages.reset(),this._users={},this.acs=new T(null),this.private=null,this.public=null,this._maxSeq=0,this._minSeq=0,this._subscribed=!1;var e=this._tinode.getMeTopic();e&&e._routePres({_noForwarding:!0,what:"gone",topic:"me",src:this.name}),this.onDeleteTopic&&this.onDeleteTopic()},_updateCachedUser:function(e,t){var n=this._cacheGetUser(e);return n=g(n||{},t),this._cachePutUser(e,n),v(this._users,e,n)},_getQueuedSeqId:function(){return this._queuedSeqId++}};var x=function(e){D.call(this,"me",e),this._contacts={},e&&(this.onContactUpdate=e.onContactUpdate)};x.prototype=Object.create(D.prototype,{_processMetaSub:{value:function(e){var t=0;for(var n in e){var i=e[n],s=i.topic;if("fnd"!=s&&"me"!=s){i.updated=new Date(i.updated),i.touched=i.touched?new Date(i.touched):void 0,i.deleted=i.deleted?new Date(i.deleted):null;var r=null;if(i.deleted)r=i,delete this._contacts[s];else if(i.acs&&!i.acs.isJoiner())(r=i).deleted=new Date,delete this._contacts[s];else if(void 0!==i.seq&&(i.seq=0|i.seq,i.recv=0|i.recv,i.read=0|i.read,i.unread=i.seq-i.read),i.seen&&i.seen.when&&(i.seen.when=new Date(i.seen.when)),r=v(this._contacts,s,i),"p2p"==S.topicType(s)&&this._cachePutUser(s,r),!i._noForwarding){var o=this._tinode.getTopic(s);o&&(i._noForwarding=!0,o._processMetaDesc(i))}t++,this.onMetaSub&&this.onMetaSub(r)}}t>0&&this.onSubsUpdated&&this.onSubsUpdated(Object.keys(this._contacts))},enumerable:!0,configurable:!0,writable:!1},_routePres:{value:function(e){var t=this._contacts[e.src];if(t){switch(e.what){case"on":t.online=!0;break;case"off":t.online&&(t.online=!1,t.seen?t.seen.when=new Date:t.seen={when:new Date});break;case"msg":t.touched=new Date,t.seq=0|e.seq,t.unread=t.seq-t.read;break;case"upd":this.getMeta(this.startMetaQuery().withLaterOneSub(e.src).build());break;case"acs":t.acs?t.acs.updateAll(e.dacs):t.acs=(new T).updateAll(e.dacs),t.touched=new Date;break;case"ua":t.seen={when:new Date,ua:e.ua};break;case"recv":t.recv=t.recv?Math.max(t.recv,e.seq):0|e.seq;break;case"read":t.read=t.read?Math.max(t.read,e.seq):0|e.seq,t.unread=t.seq-t.read;break;case"gone":delete this._contacts[e.src]}this.onContactUpdate&&this.onContactUpdate(e.what,t)}else if("acs"==e.what){var n=new T(e.dacs);if(!n||n.mode==T._INVALID)return void this._tinode.logger("Invalid access mode update",e.src,e.dacs);if(n.mode==T._NONE)return void this._tinode.logger("Removing non-existent subscription",e.src,e.dacs);this.getMeta(this.startMetaQuery().withOneSub(void 0,e.src).build()),this._contacts[e.src]={touched:new Date,topic:e.src,online:!1,acs:n}}this.onPres&&this.onPres(e)},enumerable:!0,configurable:!0,writable:!1},publish:{value:function(){return Promise.reject(new Error("Publishing to 'me' is not supported"))},enumerable:!0,configurable:!0,writable:!1},contacts:{value:function(e,t,n){var i=e||this.onMetaSub;if(i)for(var s in this._contacts)(t||this._contacts[s]&&this._contacts[s].acs&&this._contacts[s].acs.isJoiner())&&i.call(n,this._contacts[s],s,this._contacts)},enumerable:!0,configurable:!0,writable:!0},setMsgReadRecv:{value:function(e,t,n,i){var s,r=this._contacts[e],o=!1;if(r){switch(n|=0,r.seq=0|r.seq,r.read=0|r.read,r.recv=0|r.recv,t){case"recv":s=r.recv,r.recv=Math.max(r.recv,n),o=s!=r.recv;break;case"read":s=r.read,r.read=Math.max(r.read,n),o=s!=r.read;break;case"msg":s=r.seq,r.seq=Math.max(r.seq,n),(!r.touched||r.touched<i)&&(r.touched=i),o=s!=r.seq}r.recv<r.read&&(r.recv=r.read,o=!0),r.seq<r.recv&&(r.seq=r.recv,o=!0),r.unread=r.seq-r.read,!o||r.acs&&r.acs.isMuted()||!this.onContactUpdate||this.onContactUpdate(t,r)}},enumerable:!0,configurable:!0,writable:!0},getContact:{value:function(e){return this._contacts[e]},enumerable:!0,configurable:!0,writable:!0},getAccessMode:{value:function(e){var t=this._contacts[e];return t?t.acs:null},enumerable:!0,configurable:!0,writable:!0},isArchived:{value:function(e){var t=this._contacts[e];return t?!(!t.private||!t.private.arch):null},enumerable:!0,configurable:!0,writable:!0}}),x.prototype.constructor=x;var E=function(e){D.call(this,"fnd",e),this._contacts={}};E.prototype=Object.create(D.prototype,{_processMetaSub:{value:function(e){var t=Object.getOwnPropertyNames(this._contacts).length;for(var n in this._contacts={},e){var i=e[n],s=i.topic?i.topic:i.user;i.updated=new Date(i.updated),i.seen&&i.seen.when&&(i.seen.when=new Date(i.seen.when)),i=v(this._contacts,s,i),t++,this.onMetaSub&&this.onMetaSub(i)}t>0&&this.onSubsUpdated&&this.onSubsUpdated(Object.keys(this._contacts))},enumerable:!0,configurable:!0,writable:!1},publish:{value:function(){return Promise.reject(new Error("Publishing to 'fnd' is not supported"))},enumerable:!0,configurable:!0,writable:!1},setMeta:{value:function(e){var t=this;return Object.getPrototypeOf(E.prototype).setMeta.call(this,e).then(function(){Object.keys(t._contacts).length>0&&(t._contacts={},t.onSubsUpdated&&t.onSubsUpdated([]))})},enumerable:!0,configurable:!0,writable:!1},contacts:{value:function(e,t){var n=e||this.onMetaSub;if(n)for(var i in this._contacts)n.call(t,this._contacts[i],i,this._contacts)},enumerable:!0,configurable:!0,writable:!0}}),E.prototype.constructor=E;var A=function(e){this._tinode=e,this._apiKey=e._apiKey,this._authToken=e.getAuthToken(),this._msgId=e.getNextUniqueId(),this.xhr=_(),this.toResolve=null,this.toReject=null,this.onProgress=null,this.onSuccess=null,this.onFailure=null};A.prototype={uploadWithBaseUrl:function(e,t,n,i,s){var o=this;if(!this._authToken)throw new Error("Must authenticate first");var a=this,c="/v"+r+"/file/u/";if(e){if(0!=e.indexOf("http://")&&0!=e.indexOf("https://"))throw new Error("Invalid base URL '"+e+"'");c=e+c}this.xhr.open("POST",c,!0),this.xhr.setRequestHeader("X-Tinode-APIKey",this._apiKey),this.xhr.setRequestHeader("X-Tinode-Auth","Token "+this._authToken.token);var u=new Promise(function(e,t){o.toResolve=e,o.toReject=t});this.onProgress=n,this.onSuccess=i,this.onFailure=s,this.xhr.upload.onprogress=function(e){e.lengthComputable&&a.onProgress&&a.onProgress(e.loaded/e.total)},this.xhr.onload=function(){var e;try{e=JSON.parse(this.response,m)}catch(t){a._tinode.logger("Invalid server response in LargeFileHelper",this.response)}this.status>=200&&this.status<300?(a.toResolve&&a.toResolve(e.ctrl.params.url),a.onSuccess&&a.onSuccess(e.ctrl)):this.status>=400?(a.toReject&&a.toReject(new Error(e.ctrl.text+" ("+e.ctrl.code+")")),a.onFailure&&a.onFailure(e.ctrl)):a._tinode.logger("Unexpected server response status",this.status,this.response)},this.xhr.onerror=function(e){a.toReject&&a.toReject(new Error("failed")),a.onFailure&&a.onFailure(null)},this.xhr.onabort=function(e){a.toReject&&a.toReject(new Error("upload cancelled by user")),a.onFailure&&a.onFailure(null)};try{var h=new FormData;h.append("file",t),h.set("id",this._msgId),this.xhr.send(h)}catch(l){this.toReject&&this.toReject(l),this.onFailure&&this.onFailure(null)}return u},upload:function(e,t,n,i){return this.uploadWithBaseUrl(void 0,e,t,n,i)},download:function(e,t,n,i){var s=this;if(/^(?:(?:[a-z]+:)?\/\/)/i.test(e))throw new Error("The URL '"+e+"' must be relative, not absolute");if(!this._authToken)throw new Error("Must authenticate first");var r=this;this.xhr.open("GET",e,!0),this.xhr.setRequestHeader("X-Tinode-APIKey",this._apiKey),this.xhr.setRequestHeader("X-Tinode-Auth","Token "+this._authToken.token),this.xhr.responseType="blob",this.onProgress=i,this.xhr.onprogress=function(e){r.onProgress&&r.onProgress(e.loaded)};var o=new Promise(function(e,t){s.toResolve=e,s.toReject=t});this.xhr.onload=function(){if(200==this.status){var e=document.createElement("a");e.href=window.URL.createObjectURL(new Blob([this.response],{type:n})),e.style.display="none",e.setAttribute("download",t),document.body.appendChild(e),e.click(),document.body.removeChild(e),window.URL.revokeObjectURL(e.href),r.toResolve&&r.toResolve()}else if(this.status>=400&&r.toReject){var i=new FileReader;i.onload=function(){try{var e=JSON.parse(this.result,m);r.toReject(new Error(e.ctrl.text+" ("+e.ctrl.code+")"))}catch(t){r._tinode.logger("Invalid server response in LargeFileHelper",this.result),r.toReject(t)}},i.readAsText(this.response)}},this.xhr.onerror=function(e){r.toReject&&r.toReject(new Error("failed"))},this.xhr.onabort=function(){r.toReject&&r.toReject(null)};try{this.xhr.send()}catch(a){this.toReject&&this.toReject(a)}return o},cancel:function(){this.xhr&&this.xhr.readyState<4&&this.xhr.abort()},getId:function(){return this._msgId}};var R=function e(t,n){this.status=e.STATUS_NONE,this.topic=t,this.content=n};R.STATUS_NONE=0,R.STATUS_QUEUED=1,R.STATUS_SENDING=2,R.STATUS_FAILED=3,R.STATUS_SENT=4,R.STATUS_RECEIVED=5,R.STATUS_READ=6,R.STATUS_TO_ME=7,(R.prototype={toJSON:function(){},fromJSON:function(e){}}).constructor=R,c.exports=S,c.exports.Drafty=e}.call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{}),c=c.exports});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webapp/node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/react-intl/locale-data/ru.js":
/*!***************************************************!*\
  !*** ./node_modules/react-intl/locale-data/ru.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,a){ true?module.exports=a():undefined}(this,function(){"use strict";return[{locale:"ru",pluralRuleFunction:function(e,a){var t=String(e).split("."),r=t[0],o=!t[1],n=r.slice(-1),l=r.slice(-2);return a?"other":o&&1==n&&11!=l?"one":o&&n>=2&&n<=4&&(l<12||l>14)?"few":o&&0==n||o&&n>=5&&n<=9||o&&l>=11&&l<=14?"many":"other"},fields:{year:{displayName:"год",relative:{0:"в этом году",1:"в следующем году","-1":"в прошлом году"},relativeTime:{future:{one:"через {0} год",few:"через {0} года",many:"через {0} лет",other:"через {0} года"},past:{one:"{0} год назад",few:"{0} года назад",many:"{0} лет назад",other:"{0} года назад"}}},"year-short":{displayName:"г.",relative:{0:"в этом г.",1:"в след. г.","-1":"в прошлом г."},relativeTime:{future:{one:"через {0} г.",few:"через {0} г.",many:"через {0} л.",other:"через {0} г."},past:{one:"{0} г. назад",few:"{0} г. назад",many:"{0} л. назад",other:"{0} г. назад"}}},month:{displayName:"месяц",relative:{0:"в этом месяце",1:"в следующем месяце","-1":"в прошлом месяце"},relativeTime:{future:{one:"через {0} месяц",few:"через {0} месяца",many:"через {0} месяцев",other:"через {0} месяца"},past:{one:"{0} месяц назад",few:"{0} месяца назад",many:"{0} месяцев назад",other:"{0} месяца назад"}}},"month-short":{displayName:"мес.",relative:{0:"в этом мес.",1:"в следующем мес.","-1":"в прошлом мес."},relativeTime:{future:{one:"через {0} мес.",few:"через {0} мес.",many:"через {0} мес.",other:"через {0} мес."},past:{one:"{0} мес. назад",few:"{0} мес. назад",many:"{0} мес. назад",other:"{0} мес. назад"}}},day:{displayName:"день",relative:{0:"сегодня",1:"завтра",2:"послезавтра","-2":"позавчера","-1":"вчера"},relativeTime:{future:{one:"через {0} день",few:"через {0} дня",many:"через {0} дней",other:"через {0} дня"},past:{one:"{0} день назад",few:"{0} дня назад",many:"{0} дней назад",other:"{0} дня назад"}}},"day-short":{displayName:"дн.",relative:{0:"сегодня",1:"завтра",2:"послезавтра","-2":"позавчера","-1":"вчера"},relativeTime:{future:{one:"через {0} дн.",few:"через {0} дн.",many:"через {0} дн.",other:"через {0} дн."},past:{one:"{0} дн. назад",few:"{0} дн. назад",many:"{0} дн. назад",other:"{0} дн. назад"}}},hour:{displayName:"час",relative:{0:"в этот час"},relativeTime:{future:{one:"через {0} час",few:"через {0} часа",many:"через {0} часов",other:"через {0} часа"},past:{one:"{0} час назад",few:"{0} часа назад",many:"{0} часов назад",other:"{0} часа назад"}}},"hour-short":{displayName:"ч",relative:{0:"в этот час"},relativeTime:{future:{one:"через {0} ч.",few:"через {0} ч.",many:"через {0} ч.",other:"через {0} ч."},past:{one:"{0} ч. назад",few:"{0} ч. назад",many:"{0} ч. назад",other:"{0} ч. назад"}}},minute:{displayName:"минута",relative:{0:"в эту минуту"},relativeTime:{future:{one:"через {0} минуту",few:"через {0} минуты",many:"через {0} минут",other:"через {0} минуты"},past:{one:"{0} минуту назад",few:"{0} минуты назад",many:"{0} минут назад",other:"{0} минуты назад"}}},"minute-short":{displayName:"мин.",relative:{0:"в эту минуту"},relativeTime:{future:{one:"через {0} мин.",few:"через {0} мин.",many:"через {0} мин.",other:"через {0} мин."},past:{one:"{0} мин. назад",few:"{0} мин. назад",many:"{0} мин. назад",other:"{0} мин. назад"}}},second:{displayName:"секунда",relative:{0:"сейчас"},relativeTime:{future:{one:"через {0} секунду",few:"через {0} секунды",many:"через {0} секунд",other:"через {0} секунды"},past:{one:"{0} секунду назад",few:"{0} секунды назад",many:"{0} секунд назад",other:"{0} секунды назад"}}},"second-short":{displayName:"сек.",relative:{0:"сейчас"},relativeTime:{future:{one:"через {0} сек.",few:"через {0} сек.",many:"через {0} сек.",other:"через {0} сек."},past:{one:"{0} сек. назад",few:"{0} сек. назад",many:"{0} сек. назад",other:"{0} сек. назад"}}}}},{locale:"ru-BY",parentLocale:"ru"},{locale:"ru-KG",parentLocale:"ru"},{locale:"ru-KZ",parentLocale:"ru"},{locale:"ru-MD",parentLocale:"ru"},{locale:"ru-UA",parentLocale:"ru"}]});


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! exports provided: APP_NAME, API_KEY, KNOWN_HOSTS, DEFAULT_HOST, KEYPRESS_DELAY, RECEIVED_DELAY, READ_DELAY, MIN_TAG_LENGTH, DEFAULT_ACCESS_MODE, NO_ACCESS_MODE, MEDIA_BREAKPOINT, REM_SIZE, AVATAR_SIZE, BROKEN_IMAGE_SIZE, MESSAGES_PAGE, MAX_INBAND_ATTACHMENT_SIZE, MAX_EXTERN_ATTACHMENT_SIZE, MAX_IMAGE_DIM */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APP_NAME", function() { return APP_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API_KEY", function() { return API_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KNOWN_HOSTS", function() { return KNOWN_HOSTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_HOST", function() { return DEFAULT_HOST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEYPRESS_DELAY", function() { return KEYPRESS_DELAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVED_DELAY", function() { return RECEIVED_DELAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "READ_DELAY", function() { return READ_DELAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIN_TAG_LENGTH", function() { return MIN_TAG_LENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_ACCESS_MODE", function() { return DEFAULT_ACCESS_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NO_ACCESS_MODE", function() { return NO_ACCESS_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MEDIA_BREAKPOINT", function() { return MEDIA_BREAKPOINT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REM_SIZE", function() { return REM_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AVATAR_SIZE", function() { return AVATAR_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BROKEN_IMAGE_SIZE", function() { return BROKEN_IMAGE_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MESSAGES_PAGE", function() { return MESSAGES_PAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_INBAND_ATTACHMENT_SIZE", function() { return MAX_INBAND_ATTACHMENT_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_EXTERN_ATTACHMENT_SIZE", function() { return MAX_EXTERN_ATTACHMENT_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_IMAGE_DIM", function() { return MAX_IMAGE_DIM; });
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./version.js */ "./src/version.js");

var APP_NAME = 'TinodeWeb/' + (_version_js__WEBPACK_IMPORTED_MODULE_0__["PACKAGE_VERSION"] || '0.15');
var API_KEY = 'AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K';
var KNOWN_HOSTS = {
  hosted: 'api.tinode.co',
  local: 'localhost:6060'
};
var DEFAULT_HOST = KNOWN_HOSTS.hosted;
var KEYPRESS_DELAY = 3 * 1000;
var RECEIVED_DELAY = 500;
var READ_DELAY = 1000;
var MIN_TAG_LENGTH = 4;
var DEFAULT_ACCESS_MODE = 'JRWPS';
var NO_ACCESS_MODE = 'N';
var MEDIA_BREAKPOINT = 640;
var REM_SIZE = 13;
var AVATAR_SIZE = 128;
var BROKEN_IMAGE_SIZE = 32;
var MESSAGES_PAGE = 24;
var MAX_INBAND_ATTACHMENT_SIZE = 195840;
var MAX_EXTERN_ATTACHMENT_SIZE = 1 << 23;
var MAX_IMAGE_DIM = 768;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_intl_locale_data_ru__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl/locale-data/ru */ "./node_modules/react-intl/locale-data/ru.js");
/* harmony import */ var react_intl_locale_data_ru__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_intl_locale_data_ru__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _messages_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./messages.json */ "./src/messages.json");
var _messages_json__WEBPACK_IMPORTED_MODULE_4___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./messages.json */ "./src/messages.json", 1);
/* harmony import */ var _views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/tinode-web.jsx */ "./src/views/tinode-web.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/navigation.js */ "./src/lib/navigation.js");




Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["addLocaleData"])(react_intl_locale_data_ru__WEBPACK_IMPORTED_MODULE_3___default.a);




var _HashNavigation$parse = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].parseUrlHash(window.location.hash),
    params = _HashNavigation$parse.params;

var language = params && params.hl || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
var baseLanguage = language.toLowerCase().split(/[-_]+/)[0];
var messages = _messages_json__WEBPACK_IMPORTED_MODULE_4__[language] || _messages_json__WEBPACK_IMPORTED_MODULE_4__[baseLanguage] || _messages_json__WEBPACK_IMPORTED_MODULE_4__.en;
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["IntlProvider"], {
  locale: language,
  messages: messages,
  textComponent: react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views_tinode_web_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], null)), document.getElementById('mountPoint'));

/***/ }),

/***/ "./src/lib/blob-helpers.js":
/*!*********************************!*\
  !*** ./src/lib/blob-helpers.js ***!
  \*********************************/
/*! exports provided: SUPPORTED_IMAGE_FORMATS, MIME_EXTENSIONS, makeImageUrl, fitImageSize, fileNameForMime, imageFileScaledToBase64, imageFileToBase64, fileToBase64, filePasted, getMimeType, base64EncodedLen, base64DecodedLen, base64ReEncode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUPPORTED_IMAGE_FORMATS", function() { return SUPPORTED_IMAGE_FORMATS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIME_EXTENSIONS", function() { return MIME_EXTENSIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeImageUrl", function() { return makeImageUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fitImageSize", function() { return fitImageSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fileNameForMime", function() { return fileNameForMime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imageFileScaledToBase64", function() { return imageFileScaledToBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imageFileToBase64", function() { return imageFileToBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fileToBase64", function() { return fileToBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filePasted", function() { return filePasted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMimeType", function() { return getMimeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "base64EncodedLen", function() { return base64EncodedLen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "base64DecodedLen", function() { return base64DecodedLen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "base64ReEncode", function() { return base64ReEncode; });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");

var SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/gif', 'image/png', 'image/svg', 'image/svg+xml'];
var MIME_EXTENSIONS = ['jpg', 'gif', 'png', 'svg', 'svg'];
function makeImageUrl(photo) {
  return photo && photo.type && photo.data ? 'data:image/' + photo.type + ';base64,' + photo.data : null;
}
function fitImageSize(width, height, maxWidth, maxHeight, forceSquare) {
  width = width | 0;
  height = height | 0;
  maxWidth = maxWidth | 0;
  maxHeight = maxHeight | 0;

  if (width <= 0 || height <= 0 || maxWidth <= 0 || maxHeight <= 0) {
    return null;
  }

  if (forceSquare) {
    maxWidth = maxHeight = Math.min(maxWidth, maxHeight);
  }

  var scale = Math.min(Math.min(width, maxWidth) / width, Math.min(height, maxHeight) / height);
  var size = {
    dstWidth: width * scale | 0,
    dstHeight: height * scale | 0
  };

  if (forceSquare) {
    size.dstWidth = size.dstHeight = Math.min(size.dstWidth, size.dstHeight);
    size.srcWidth = size.srcHeight = Math.min(width, height);
    size.xoffset = (width - size.srcWidth) / 2 | 0;
    size.yoffset = (height - size.srcWidth) / 2 | 0;
  } else {
    size.xoffset = size.yoffset = 0;
    size.srcWidth = width;
    size.srcHeight = height;
  }

  return size;
}
function fileNameForMime(fname, mime) {
  var idx = SUPPORTED_IMAGE_FORMATS.indexOf(mime);
  var ext = MIME_EXTENSIONS[idx];
  var at = fname.lastIndexOf('.');

  if (at >= 0) {
    fname = fname.substring(0, at);
  }

  return fname + '.' + ext;
}
function imageFileScaledToBase64(file, width, height, forceSquare, onSuccess, onError) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';

  img.onerror = function (err) {
    onError("Image format unrecognized");
  };

  img.onload = function () {
    var dim = fitImageSize(this.width, this.height, width, height, forceSquare);

    if (!dim) {
      onError("Invalid image");
      return;
    }

    var canvas = document.createElement('canvas');
    canvas.width = dim.dstWidth;
    canvas.height = dim.dstHeight;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this, dim.xoffset, dim.yoffset, dim.srcWidth, dim.srcHeight, 0, 0, dim.dstWidth, dim.dstHeight);
    var mime = this.width != dim.dstWidth || this.height != dim.dstHeight || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0 ? 'image/jpeg' : file.type;
    var imageBits = canvas.toDataURL(mime);
    var parts = imageBits.split(',');
    mime = getMimeType(parts[0]);

    if (!mime) {
      onError("Unsupported image format");
      return;
    }

    var quality = 0.78;

    if (base64DecodedLen(imageBits.length) > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"]) {
      mime = 'image/jpeg';
    }

    if (mime == 'image/jpeg') {
      while (base64DecodedLen(imageBits.length) > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"] && quality > 0.45) {
        imageBits = canvas.toDataURL(mime, quality);
        quality *= 0.84;
      }
    }

    if (base64DecodedLen(imageBits.length) > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"]) {
      onError("The image size " + bytesToHumanSize(base64DecodedLen(imageBits.length)) + " exceeds the " + bytesToHumanSize(_config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"]) + " limit.", "err");
      return;
    }

    canvas = null;
    onSuccess(imageBits.split(',')[1], mime, dim.dstWidth, dim.dstHeight, fileNameForMime(file.name, mime));
  };

  img.src = URL.createObjectURL(file);
}
function imageFileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function () {
    var parts = reader.result.split(',');
    var mime = getMimeType(parts[0]);

    if (!mime) {
      onError("Failed to process image file");
      return;
    }

    var img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
      onSuccess(parts[1], mime, this.width, this.height, fileNameForMime(file.name, mime));
    };

    img.onerror = function (err) {
      onError("Image format not recognized");
    };

    img.src = URL.createObjectURL(file);
  }, false);
  reader.readAsDataURL(file);
}
function fileToBase64(file, onSuccess, onError) {
  var reader = new FileReader();
  reader.addEventListener('load', function () {
    onSuccess(file.type, reader.result.split(',')[1], file.name);
  });
  reader.readAsDataURL(file);
}
function filePasted(event, onImageSuccess, onAttachmentSuccess, onError) {
  var items = (event.clipboardData || event.originalEvent.clipboardData || {}).items;

  for (var i in items) {
    var item = items[i];

    if (item.kind === 'file') {
      var file = item.getAsFile();

      if (!file) {
        console.log("Failed to get file object from pasted file item", item.kind, item.type);
        continue;
      }

      if (file.type && file.type.split('/')[0] == 'image') {
        if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_INBAND_ATTACHMENT_SIZE"] || SUPPORTED_IMAGE_FORMATS.indexOf(file.type) < 0) {
          imageFileScaledToBase64(file, _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_IMAGE_DIM"], _config_js__WEBPACK_IMPORTED_MODULE_0__["MAX_IMAGE_DIM"], false, onImageSuccess, onError);
        } else {
          imageFileToBase64(file, onImageSuccess, onError);
        }
      } else {
        fileToBase64(file, onAttachmentSuccess, onError);
      }

      return true;
    }
  }

  return false;
}
function getMimeType(header) {
  var mime = /^data:(image\/[-+a-z0-9.]+);base64/.exec(header);
  return mime && mime.length > 1 ? mime[1] : null;
}
function base64EncodedLen(n) {
  return Math.floor((n + 2) / 3) * 4;
}
function base64DecodedLen(n) {
  return Math.floor(n / 4) * 3;
}
function base64ReEncode(str) {
  if (str) {
    str = str.replace('-', '+').replace('_', '/');

    try {
      str = btoa(atob(str));
    } catch (err) {
      console.log("Failed to base64 re-encode string");
      str = null;
    }
  }

  return str;
}

/***/ }),

/***/ "./src/lib/host-name.js":
/*!******************************!*\
  !*** ./src/lib/host-name.js ***!
  \******************************/
/*! exports provided: detectServerAddress, isSecureConnection, isLocalHost */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectServerAddress", function() { return detectServerAddress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSecureConnection", function() { return isSecureConnection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLocalHost", function() { return isLocalHost; });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


function detectServerAddress() {
  var host = _config_js__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_HOST"];

  if (_typeof(window.location) == 'object') {
    if (window.location.protocol == 'file:' || window.location.hostname == 'localhost') {
      host = _config_js__WEBPACK_IMPORTED_MODULE_0__["KNOWN_HOSTS"].local;
    } else if (window.location.hostname) {
      host = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
  }

  return host;
}
function isSecureConnection() {
  if (_typeof(window.location) == 'object') {
    return window.location.protocol == 'https:';
  }

  return false;
}
function isLocalHost() {
  if (_typeof(window.location) == 'object') {
    return window.location.hostname == 'localhost';
  }

  return false;
}

/***/ }),

/***/ "./src/lib/local-storage.js":
/*!**********************************!*\
  !*** ./src/lib/local-storage.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LocalStorageUtil; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LocalStorageUtil = function () {
  function LocalStorageUtil() {
    _classCallCheck(this, LocalStorageUtil);
  }

  _createClass(LocalStorageUtil, null, [{
    key: "setObject",
    value: function setObject(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, {
    key: "getObject",
    value: function getObject(key) {
      var value = localStorage.getItem(key);
      return value && JSON.parse(value);
    }
  }, {
    key: "updateObject",
    value: function updateObject(key, value) {
      var oldVal = this.getObject(key);
      this.setObject(key, Object.assign(oldVal || {}, value));
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      localStorage.removeItem(key);
    }
  }]);

  return LocalStorageUtil;
}();



/***/ }),

/***/ "./src/lib/navigation.js":
/*!*******************************!*\
  !*** ./src/lib/navigation.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HashNavigation; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HashNavigation = function () {
  function HashNavigation() {
    _classCallCheck(this, HashNavigation);
  }

  _createClass(HashNavigation, null, [{
    key: "parseUrlHash",
    value: function parseUrlHash(hash) {
      var parts = hash.split('?', 2);
      var params = {};
      var path = [];

      if (parts[0]) {
        path = parts[0].substr(1).split('/');
      }

      if (parts[1]) {
        parts[1].split('&').forEach(function (part) {
          var item = part.split('=');

          if (item[0]) {
            params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
          }
        });
      }

      return {
        path: path,
        params: params
      };
    }
  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      window.location.hash = url;
    }
  }, {
    key: "composeUrlHash",
    value: function composeUrlHash(path, params) {
      var url = path.join('/');
      var args = [];

      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          args.push(key + '=' + params[key]);
        }
      }

      if (args.length > 0) {
        url += '?' + args.join('&');
      }

      return url;
    }
  }, {
    key: "addUrlParam",
    value: function addUrlParam(hash, key, value) {
      var parsed = this.parseUrlHash(hash);
      parsed.params[key] = value;
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }, {
    key: "removeUrlParam",
    value: function removeUrlParam(hash, key) {
      var parsed = this.parseUrlHash(hash);
      delete parsed.params[key];
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }, {
    key: "setUrlSidePanel",
    value: function setUrlSidePanel(hash, sidepanel) {
      var parsed = this.parseUrlHash(hash);
      parsed.path[0] = sidepanel;
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }, {
    key: "setUrlTopic",
    value: function setUrlTopic(hash, topic) {
      var parsed = this.parseUrlHash(hash);
      parsed.path[1] = topic;
      delete parsed.params.info;
      return this.composeUrlHash(parsed.path, parsed.params);
    }
  }]);

  return HashNavigation;
}();



/***/ }),

/***/ "./src/lib/strformat.js":
/*!******************************!*\
  !*** ./src/lib/strformat.js ***!
  \******************************/
/*! exports provided: shortDateFormat, secondsToTime, bytesToHumanSize, stringHash */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shortDateFormat", function() { return shortDateFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "secondsToTime", function() { return secondsToTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bytesToHumanSize", function() { return bytesToHumanSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringHash", function() { return stringHash; });
function shortDateFormat(then, locale) {
  locale = locale || window.navigator.userLanguage || window.navigator.language;
  var now = new Date();

  if (then.getFullYear() == now.getFullYear()) {
    if (then.getMonth() == now.getMonth() && then.getDate() == now.getDate()) {
      return then.toLocaleTimeString(locale, {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return then.toLocaleDateString(locale, {
        hour12: false,
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  return then.toLocaleDateString(locale, {
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
function secondsToTime(seconds) {
  var min = Math.floor(seconds % 3600 / 60);
  var sec = seconds % 60;
  sec = sec < 10 ? "0".concat(sec) : sec;
  return "".concat(min, ":").concat(sec);
}
function bytesToHumanSize(bytes) {
  if (!bytes || bytes == 0) {
    return '0 Bytes';
  }

  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var bucket = Math.min(Math.floor(Math.log2(bytes) / 10) | 0, sizes.length - 1);
  var count = bytes / Math.pow(1024, bucket);
  var round = bucket > 0 ? count < 3 ? 2 : count < 30 ? 1 : 0 : 0;
  return count.toFixed(round) + ' ' + sizes[bucket];
}
function stringHash(value) {
  var hash = 0;
  value = '' + value;

  for (var i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash = hash & hash;
  }

  return hash;
}

/***/ }),

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/*! exports provided: updateFavicon, vcard, arrayEqual */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateFavicon", function() { return updateFavicon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vcard", function() { return vcard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayEqual", function() { return arrayEqual; });
function updateFavicon(count) {
  var oldIcon = document.getElementById('shortcut-icon');
  var head = document.head || document.getElementsByTagName('head')[0];
  var newIcon = document.createElement('link');
  newIcon.type = 'image/png';
  newIcon.id = 'shortcut-icon';
  newIcon.rel = 'shortcut icon';
  newIcon.href = 'img/logo32x32' + (count > 0 ? 'a' : '') + '.png';

  if (oldIcon) {
    head.removeChild(oldIcon);
  }

  head.appendChild(newIcon);
  document.title = (count > 0 ? '(' + count + ') ' : '') + 'Tinode';
}
function vcard(fn, imageDataUrl) {
  var card = null;

  if (fn && fn.trim() || imageDataUrl) {
    card = {};

    if (fn) {
      card.fn = fn.trim();
    }

    if (imageDataUrl) {
      var dataStart = imageDataUrl.indexOf(',');
      card.photo = {
        data: imageDataUrl.substring(dataStart + 1),
        type: 'jpg'
      };
    }
  }

  return card;
}
function arrayEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length != b.length) {
    return false;
  }

  a.sort();
  b.sort();

  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

/***/ }),

/***/ "./src/messages.json":
/*!***************************!*\
  !*** ./src/messages.json ***!
  \***************************/
/*! exports provided: en, ru, default */
/***/ (function(module) {

module.exports = {"en":{"archived_contacts":"Archived contacts ({count})","contacts_not_found":"You have no chats<br />¯∖_(ツ)_/¯","full_name_prompt":"Full name, e.g. John Doe","email_prompt":"Email, e.g. jdoe@example.com","button_sign_up":"Sign up","label_your_name":"Your name","label_password":"Password","password_unchanged_prompt":"Unchanged","label_user_id":"Address:","label_default_access_mode":"Default access mode:","label_message_sound":"Message sound:","label_push_notifications":"Notification alerts:","label_push_notifications_disabled":"Notification alerts (requires HTTPS):","title_tag_manager":"Tags (user discovery)","button_logout":"Logout","requested_permissions":"Requested","granted_permissions":"Granted","menu_item_edit_permissions":"Edit permissions","label_other_user":"Other","title_info":"Info","label_topic_name":"Name","label_private":"Private comment","private_editing_placeholder":"Visible to you only","label_muting_topic":"Muted:","action_more":"More","label_your_permissions":"Your permissions:","label_permissions":"Permissions:","label_you":"You:","label_default_access":"Default access mode:","label_group_members":"Group members:","button_add_members":"Add members","button_leave":"Leave","group_has_no_members":"No members","action_leave_chat":"Leave","login_prompt":"Login","password_prompt":"Password","stay_logged_in":"Stay logged in","forgot_password_link":"Forgot password?","button_sign_in":"Sign in","label_client":"Client:","label_server":"Server:","online_now":"online now","last_seen_timestamp":"Last seen","title_not_found":"Not found","unnamed_topic":"Unnamed","messages_not_readable":"no access to messages","peers_messaging_disabled":"Peer's messaging is disabled.","enable_peers_messaging":"Enable","tabtitle_find_user":"find","tabtitle_new_group":"new group","tabtitle_group_by_id":"by id","search_for_contacts":"Use search to find contacts","new_password_placeholder":"Enter new password","label_reset_password":"Send a password reset email:","credential_email_prompt":"Your registration email","button_reset":"Reset","button_send_request":"Send request","label_server_to_use":"Server to use:","label_wire_transport":"Wire transport:","button_update":"Update","sidepanel_title_login":"Sign In","sidepanel_title_register":"Create Account","sidepanel_title_settings":"Settings","sidepanel_title_edit_account":"Edit Account","sidepanel_title_newtpk":"Start New Chat","sidepanel_title_cred":"Confirm Credentials","sidepanel_title_reset":"Reset Password","sidepanel_title_archive":"Archived Chats","update_available":"Update available. <a href=\"\">Reload</a>.","reconnect_countdown":"Disconnected. Reconnecting in {seconds}…","reconnect_now":"Try now","phone_dative":"phone","email_dative":"email","enter_confirmation_code_prompt":"Enter confirmation code sent to you by {method}:","numeric_confirmation_code_prompt":"Numbers only","button_confirm":"Confirm","save_attachment":"save","invalid_content":"invalid content","user_not_found":"Not found","badge_you":"you","badge_owner":"owner","menu_item_info":"Info","menu_item_clear_messages":"Clear messages","menu_item_clear_messages_for_all":"Clear for All","menu_item_delete":"Delete","menu_item_delete_for_all":"Delete for All","menu_item_mute":"Mute","menu_item_unmute":"Unmute","menu_item_delete_topic":"Delete","menu_item_unblock":"Unblock","menu_item_block":"Block","menu_item_member_delete":"Remove","menu_item_archive_topic":"Archive","action_cancel":"cancel","upload_finishing":"finishing...","no_contacts":"You have no contacts :-(","contacts_not_found_short":"No contacts match '{query}'","title_group_members":"Group Members","title_all_contacts":"All Contacts","button_ok":"OK","button_cancel":"Cancel","download_action":"download","label_file_name":"File name:","label_content_type":"Content type:","label_size":"Size:","chat_invitation":"You are invited to start a new chat. What would you like to do?","chat_invitation_accept":"Accept","chat_invitation_ignore":"Ignore","chat_invitation_block":"Block","error_invalid_id":"Invalid ID","group_user_id_prompt":"Group or User ID","button_subscribe":"Subscribe","topic_name_editing_placeholder":"Freeform name of the group","button_create":"Create","permission_join":"Join ({val})","permission_read":"Read ({val})","permission_write":"Write ({val})","permission_pres":"Get notified ({val})","permission_admin":"Approve ({val})","permission_share":"Share ({val})","permission_delete":"Delete ({val})","permission_owner":"Owner ({val})","title_permissions":"Permissions","message_sending":"sending...","message_sending_failed":"failed","search_placeholder":"List like email:alice@example.com, tel:17025550003...","messaging_disabled_prompt":"Messaging disabled","new_message_prompt":"New message","file_attachment_too_large":"The file size {size} exceeds the {limit} limit.","cannot_initiate_file_upload":"Cannot initiate file upload.","tags_not_found":"No tags defined. Add some.","tags_editor_no_tags":"Add some tags","title_manage_tags":"Manage tags"},"ru":{"contacts_not_found":"Чатов нет<br />¯∖_(ツ)_/¯","full_name_prompt":"Полное имя, напр. Иван Петров","email_prompt":"Email, напр. ivan@example.com","button_sign_up":"Создать счет","label_your_name":"Ваше имя","label_password":"Пароль","password_unchanged_prompt":"Не изменен","label_user_id":"Адрес:","label_default_access_mode":"Доступ по умолчанию:","label_message_sound":"Звук нового сообщения:","label_push_notifications":"Уведомления:","label_push_notifications_disabled":"Уведомления (требуют HTTPS):","title_tag_manager":"Таги для поиска","button_logout":"Выйти","login_prompt":"Логин","password_prompt":"Пароль","stay_logged_in":"Запомнить","forgot_password_link":"Напомнить пароль","button_sign_in":"Войти","label_client":"Клиент:","label_server":"Сервер:","online_now":"онлайн","last_seen_timestamp":"Был активен","title_not_found":"Не найден","unnamed_topic":"Без названия","messages_not_readable":"нет доступа к сообщениям","tabtitle_find_user":"найти","tabtitle_new_group":"создать","tabtitle_group_by_id":"по id","label_server_to_use":"Использовать сервер:","label_wire_transport":"Соединение:","button_update":"Применить","sidepanel_title_login":"Авторизация","sidepanel_title_register":"Зарегистрироваться","sidepanel_title_settings":"Настройки","sidepanel_title_edit_account":"Редактировать счет","sidepanel_title_newtpk":"Новый чат","sidepanel_title_cred":"Подтвердить","sidepanel_title_reset":"Сменить пароль","tags_not_found":"Тагов нет. Добавьте","tags_editor_no_tags":"Добавьте таги","title_manage_tags":"Редактор тагов","message_sending":"в пути...","message_sending_failed":"ошибка","search_placeholder":"Список, напр. email:alice@example.com, tel:17025550003...","messaging_disabled_prompt":"Отправка недоступна","new_message_prompt":"Новое сообщение","file_attachment_too_large":"Размер файла {size} превышает {limit} лимит.","cannot_initiate_file_upload":"Ошибка загрузки файла.","search_for_contacts":"Поиск контактов","enter_confirmation_code_prompt":"Код подтверждения, полученный по {method}:","numeric_confirmation_code_prompt":"Только цифры","button_confirm":"Подтвердить","button_ok":"OK","button_cancel":"Отменить","invalid_content":"сообщение не читается","label_file_name":"Имя файла:","label_content_type":"Тип:","label_size":"Размер:","phone_dative":"телефону","email_dative":"емейлу","title_group_members":"Участники","download_action":"скачать","permission_join":"Подписываться ({val})","permission_read":"Читать ({val})","permission_write":"Писать ({val})","permission_pres":"Уведомлять ({val})","permission_admin":"Подтверждать ({val})","permission_share":"Приглашать ({val})","permission_delete":"Удалять ({val})","permission_owner":"Владелец ({val})","title_permissions":"Права доступа","requested_permissions":"Требуются","granted_permissions":"Получены","menu_item_edit_permissions":"Права доступа","label_other_user":"Второй","label_topic_name":"Название","label_private":"Комментарий","private_editing_placeholder":"Виден только вам","label_muting_topic":"Без уведомлений","action_more":"Ещё","label_your_permissions":"Ваши права доступа:","label_permissions":"Права доступа:","label_you":"Вы:","label_default_access":"Права по умолчанию:","label_group_members":"Участники чата:","button_add_members":"Добавить","button_leave":"Отписаться","group_has_no_members":"Нет участников","action_leave_chat":"Уйти из чата","menu_item_info":"Информация","menu_item_clear_messages":"Удалить сообщения","menu_item_clear_messages_for_all":"Удалить для всех","menu_item_delete":"Удалить","menu_item_delete_for_all":"Удалить для всех","menu_item_mute":"Не уведомлять","menu_item_unmute":"Уведомлять","menu_item_delete_topic":"Удалить чат","menu_item_unblock":"Разблокировать","menu_item_block":"Заблокировать","menu_item_member_delete":"Отписать","title_info":"Подробности","new_password_placeholder":"Введите новый пароль","label_reset_password":"Отправить емейл для смены пароля:","credential_email_prompt":"Регистрационный емейл","button_reset":"Изменить","button_send_request":"Отправить","action_cancel":"отменить","upload_finishing":"завершение...","no_contacts":"Ничего нет :-(","contacts_not_found_short":"Нет контактов для запроса '{query}'","title_all_contacts":"Все контакты","error_invalid_id":"Неверный ID","group_user_id_prompt":"ID чата или пользователя","button_subscribe":"Подписаться","topic_name_editing_placeholder":"Название чата","button_create":"Создать","badge_you":"вы","badge_owner":"влад.","update_available":"Есть новая версия приложения. <a href=\"\">Обновить</a>.","user_not_found":"Не найден","reconnect_countdown":"Нет связи. Подключение через {seconds}…","reconnect_now":"Подключить сейчас.","save_attachment":"сохранить","menu_item_archive_topic":"В архив","archived_contacts":"Чаты в архиве ({count})","sidepanel_title_archive":"Архив чатов","chat_invitation":"Вас пригласили начать новый чат. Как вы хотите поступить?","chat_invitation_accept":"Принять","chat_invitation_ignore":"Игнорировать","chat_invitation_block":"Заблокировать","peers_messaging_disabled":"Чат заблокирован у корреспондента.","enable_peers_messaging":"Разблокировать."}};

/***/ }),

/***/ "./src/version.js":
/*!************************!*\
  !*** ./src/version.js ***!
  \************************/
/*! exports provided: PACKAGE_VERSION */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PACKAGE_VERSION", function() { return PACKAGE_VERSION; });
var PACKAGE_VERSION = "0.15.14";

/***/ }),

/***/ "./src/views/contacts-view.jsx":
/*!*************************************!*\
  !*** ./src/views/contacts-view.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ContactsView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  archived_contacts_title: {
    "id": "archived_contacts",
    "defaultMessage": "Archived contacts ({count})"
  }
});

var ContactsView = function (_React$Component) {
  _inherits(ContactsView, _React$Component);

  function ContactsView(props) {
    var _this;

    _classCallCheck(this, ContactsView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactsView).call(this, props));
    _this.handleAction = _this.handleAction.bind(_assertThisInitialized(_this));
    _this.state = ContactsView.getDerivedStateFromProps(props, {});
    return _this;
  }

  _createClass(ContactsView, [{
    key: "handleAction",
    value: function handleAction(action_ignored) {
      this.props.onShowArchive();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedHTMLMessage"], {
        id: "contacts_not_found",
        defaultMessage: "You have no chats<br />\xAF\u2216_(\u30C4)_/\xAF"
      }, function (no_contacts) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          connected: _this2.props.connected,
          contacts: _this2.state.contactList,
          emptyListMessage: no_contacts,
          topicSelected: _this2.props.topicSelected,
          myUserId: _this2.props.myUserId,
          showOnline: true,
          showUnread: true,
          onTopicSelected: _this2.props.onTopicSelected,
          showContextMenu: _this2.props.showContextMenu,
          onAction: _this2.handleAction
        });
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var contacts = [];
      var unreadThreads = 0;
      var archivedCount = 0;
      nextProps.chatList.map(function (c) {
        if (c.private && c.private.arch) {
          if (nextProps.archive) {
            contacts.push(c);
          } else {
            archivedCount++;
          }
        } else if (!nextProps.archive) {
          contacts.push(c);
          unreadThreads += c.unread > 0 ? 1 : 0;
        }
      });
      contacts.sort(function (a, b) {
        return (b.touched || 0) - (a.touched || 0);
      });

      if (archivedCount > 0) {
        contacts.push({
          action: 'archive',
          title: messages.archived_contacts_title,
          values: {
            count: archivedCount
          }
        });
      }

      Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_3__["updateFavicon"])(unreadThreads);
      return {
        contactList: contacts,
        archivedCount: archivedCount
      };
    }
  }]);

  return ContactsView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/views/create-account-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/create-account-view.jsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CreateAccountView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }









var CreateAccountView = function (_React$PureComponent) {
  _inherits(CreateAccountView, _React$PureComponent);

  function CreateAccountView(props) {
    var _this;

    _classCallCheck(this, CreateAccountView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateAccountView).call(this, props));
    _this.state = {
      login: '',
      password: '',
      email: '',
      fn: '',
      imageDataUrl: null,
      errorCleared: false,
      saveToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__["default"].getObject('keep-logged-in')
    };
    _this.handleLoginChange = _this.handleLoginChange.bind(_assertThisInitialized(_this));
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_assertThisInitialized(_this));
    _this.handleEmailChange = _this.handleEmailChange.bind(_assertThisInitialized(_this));
    _this.handleFnChange = _this.handleFnChange.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleToggleSaveToken = _this.handleToggleSaveToken.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CreateAccountView, [{
    key: "handleLoginChange",
    value: function handleLoginChange(e) {
      this.setState({
        login: e.target.value
      });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(password) {
      this.setState({
        password: password
      });
    }
  }, {
    key: "handleEmailChange",
    value: function handleEmailChange(e) {
      this.setState({
        email: e.target.value
      });
    }
  }, {
    key: "handleFnChange",
    value: function handleFnChange(e) {
      this.setState({
        fn: e.target.value
      });
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        imageDataUrl: img
      });
    }
  }, {
    key: "handleToggleSaveToken",
    value: function handleToggleSaveToken() {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_5__["default"].setObject('keep-logged-in', !this.state.saveToken);
      this.setState({
        saveToken: !this.state.saveToken
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      this.setState({
        errorCleared: false
      });
      this.props.onCreateAccount(this.state.login.trim(), this.state.password.trim(), Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_6__["vcard"])(this.state.fn, this.state.imageDataUrl), {
        'meth': 'email',
        'val': this.state.email
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var submitClasses = 'blue';

      if (this.props.disabled) {
        submitClasses += ' disabled';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "panel-form-column",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "login_prompt"
      }, function (login_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          placeholder: login_prompt,
          autoComplete: "user-name",
          value: _this2.state.login,
          onChange: _this2.handleLoginChange,
          required: true,
          autoFocus: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "password_prompt"
      }, function (password_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          placeholder: password_prompt,
          autoComplete: "new-password",
          value: _this2.state.password,
          onFinished: _this2.handlePasswordChange,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onImageChanged: this.handleImageChanged,
        onError: this.props.onError
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "full_name_prompt",
        defaultMessage: "Full name, e.g. John Doe"
      }, function (full_name_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          placeholder: full_name_prompt,
          autoComplete: "name",
          value: _this2.state.fn,
          onChange: _this2.handleFnChange,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "email_prompt",
        defaultMessage: "Email, e.g. jdoe@example.com"
      }, function (email_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "email",
          placeholder: email_prompt,
          autoComplete: "email",
          value: _this2.state.email,
          onChange: _this2.handleEmailChange,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "save-token",
        name: "save-token",
        checked: this.state.saveToken,
        onChange: this.handleToggleSaveToken
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "stay_logged_in"
      }, function (stay_logged_in) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          htmlFor: "save-token"
        }, "\xA0", stay_logged_in);
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: submitClasses,
        type: "submit"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_sign_up",
        defaultMessage: "Sign up"
      }))));
    }
  }]);

  return CreateAccountView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/views/edit-account-view.jsx":
/*!*****************************************!*\
  !*** ./src/views/edit-account-view.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditAccountView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");
/* harmony import */ var _widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }











var EditAccountView = function (_React$Component) {
  _inherits(EditAccountView, _React$Component);

  function EditAccountView(props) {
    var _this;

    _classCallCheck(this, EditAccountView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditAccountView).call(this, props));

    var me = _this.props.tinode.getMeTopic();

    var defacs = me ? me.getDefaultAccess() : null;

    var fnd = _this.props.tinode.getFndTopic();

    _this.state = {
      fullName: me.public ? me.public.fn : undefined,
      avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__["makeImageUrl"])(me.public ? me.public.photo : null),
      auth: defacs ? defacs.auth : null,
      anon: defacs ? defacs.anon : null,
      fndSubscribed: false,
      tags: fnd.tags(),
      showPermissionEditorFor: undefined,
      previousOnTags: fnd.onTagsUpdated
    };
    _this.tnNewTags = _this.tnNewTags.bind(_assertThisInitialized(_this));
    _this.handleFullNameUpdate = _this.handleFullNameUpdate.bind(_assertThisInitialized(_this));
    _this.handlePasswordUpdate = _this.handlePasswordUpdate.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleCheckboxClick = _this.handleCheckboxClick.bind(_assertThisInitialized(_this));
    _this.handleLaunchPermissionsEditor = _this.handleLaunchPermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handleHidePermissionsEditor = _this.handleHidePermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handlePermissionsChanged = _this.handlePermissionsChanged.bind(_assertThisInitialized(_this));
    _this.handleTagsUpdated = _this.handleTagsUpdated.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EditAccountView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var fnd = this.props.tinode.getFndTopic();
      fnd.onTagsUpdated = this.tnNewTags;

      if (!fnd.isSubscribed()) {
        fnd.subscribe(fnd.startMetaQuery().withTags().build()).then(function (ctrl) {
          _this2.setState({
            fndSubscribed: true
          });
        }).catch(function (err) {
          _this2.props.onError(err.message, 'err');
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var fnd = this.props.tinode.getFndTopic();
      fnd.onTagsUpdated = this.state.previousOnTags;

      if (fnd.isSubscribed() && this.state.fndSubscribed) {
        fnd.leave();
      }
    }
  }, {
    key: "tnNewTags",
    value: function tnNewTags(tags) {
      this.setState({
        tags: tags
      });
    }
  }, {
    key: "handleFullNameUpdate",
    value: function handleFullNameUpdate(fn) {
      this.setState({
        fullName: fn
      });
      this.props.onUpdateAccount(undefined, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__["vcard"])(fn, null));
    }
  }, {
    key: "handlePasswordUpdate",
    value: function handlePasswordUpdate(pwd) {
      this.setState({
        password: pwd
      });
      this.props.onUpdateAccount(pwd);
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        avatar: img
      });
      this.props.onUpdateAccount(undefined, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_8__["vcard"])(null, img));
    }
  }, {
    key: "handleCheckboxClick",
    value: function handleCheckboxClick(what, checked) {
      if (what == 'sound') {
        this.props.onToggleMessageSounds(checked);
      } else if (what == 'alert') {
        this.props.onTogglePushNotifications(checked);
      }
    }
  }, {
    key: "handleLaunchPermissionsEditor",
    value: function handleLaunchPermissionsEditor(which) {
      this.setState({
        showPermissionEditorFor: which,
        editedPermissions: this.state[which]
      });
    }
  }, {
    key: "handleHidePermissionsEditor",
    value: function handleHidePermissionsEditor() {
      this.setState({
        showPermissionEditorFor: undefined
      });
    }
  }, {
    key: "handlePermissionsChanged",
    value: function handlePermissionsChanged(perm) {
      var defacs = {};
      defacs[this.state.showPermissionEditorFor] = perm;
      this.props.onUpdateAccount(undefined, undefined, defacs);
      var newState = {
        showPermissionEditorFor: undefined
      };
      newState[this.state.showPermissionEditorFor] = perm;
      this.setState(newState);
    }
  }, {
    key: "handleTagsUpdated",
    value: function handleTagsUpdated(tags) {
      if (arrayEqual(this.state.tags.slice(0), tags.slice(0))) {
        return;
      }

      this.props.onUpdateTags(tags);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var tags = [];
      this.state.tags.map(function (tag) {
        tags.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "badge",
          key: tags.length
        }, tag));
      });

      if (tags.length == 0) {
        tags = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "tags_not_found"
        }));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        mode: this.state.editedPermissions,
        skip: "O",
        onSubmit: this.handlePermissionsChanged,
        onCancel: this.handleHidePermissionsEditor
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "edit-account",
        className: "scrollable-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_your_name",
        defaultMessage: "Your name"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "full_name_prompt"
      }, function (full_name_placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          placeholder: full_name_placeholder,
          value: _this3.state.fullName,
          onFinished: _this3.handleFullNameUpdate
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_password",
        defaultMessage: "Password"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "password_unchanged_prompt",
        defaultMessage: "Unchanged"
      }, function (password_unchanged) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          placeholder: password_unchanged,
          type: "password",
          onFinished: _this3.handlePasswordUpdate
        });
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        avatar: this.state.avatar,
        uid: this.props.myUserId,
        title: this.state.fullName,
        onImageChanged: this.handleImageChanged,
        onError: this.props.onError
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_user_id",
        defaultMessage: "Address:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.props.myUserId)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_default_access_mode",
        defaultMessage: "Default access mode:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Auth: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth')
      }, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Anon: ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon')
      }, this.state.anon)))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "message-sound"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_message_sound",
        defaultMessage: "Message sound:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        name: "sound",
        id: "message-sound",
        checked: this.props.messageSounds,
        onChange: this.handleCheckboxClick
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "desktop-alerts"
      }, this.props.desktopAlertsEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_push_notifications",
        defaultMessage: "Notification alerts:"
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_push_notifications_disabled",
        defaultMessage: "Notification alerts (requires HTTPS):"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        name: "alert",
        id: "desktop-alerts",
        checked: this.props.desktopAlerts,
        onChange: this.props.desktopAlertsEnabled ? this.handleCheckboxClick : null
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_tag_manager",
        defaultMessage: "Tags (user discovery)"
      }, function (title_tag_manager) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
          title: title_tag_manager,
          activated: false,
          tags: _this3.state.tags,
          onSubmit: _this3.handleTagsUpdated
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "red flat-button",
        onClick: this.props.onLogout
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "exit_to_app"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_logout",
        defaultMessage: "Logout"
      })))));
    }
  }]);

  return EditAccountView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/views/info-view.jsx":
/*!*********************************!*\
  !*** ./src/views/info-view.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/group-manager.jsx */ "./src/widgets/group-manager.jsx");
/* harmony import */ var _widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/in-place-edit.jsx */ "./src/widgets/in-place-edit.jsx");
/* harmony import */ var _widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var _widgets_more_button_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../widgets/more-button.jsx */ "./src/widgets/more-button.jsx");
/* harmony import */ var _widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/permissions-editor.jsx */ "./src/widgets/permissions-editor.jsx");
/* harmony import */ var _widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../widgets/tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

















var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  requested: {
    "id": "requested_permissions",
    "defaultMessage": "Requested"
  },
  granted: {
    "id": "granted_permissions",
    "defaultMessage": "Granted"
  },
  edit_permissions: {
    "id": "menu_item_edit_permissions",
    "defaultMessage": "Edit permissions"
  },
  other_user: {
    "id": "label_other_user",
    "defaultMessage": "Other"
  }
});

var InfoView = function (_React$Component) {
  _inherits(InfoView, _React$Component);

  function InfoView(props) {
    var _this;

    _classCallCheck(this, InfoView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InfoView).call(this, props));
    _this.state = {
      topic: null,
      owner: false,
      admin: false,
      sharer: false,
      muted: false,
      address: null,
      groupTopic: undefined,
      fullName: undefined,
      avatar: null,
      private: null,
      selectedContact: null,
      access: null,
      modeGiven: null,
      modeWant: null,
      modeGiven2: null,
      modeWant2: null,
      auth: null,
      anon: null,
      contactList: [],
      tags: [],
      showMemberPanel: false,
      showPermissionEditorFor: undefined,
      moreInfoExpanded: false,
      previousMetaDesc: undefined,
      previousSubsUpdated: undefined,
      previousTagsUpdated: undefined
    };
    _this.resetSubs = _this.resetSubs.bind(_assertThisInitialized(_this));
    _this.resetDesc = _this.resetDesc.bind(_assertThisInitialized(_this));
    _this.onMetaDesc = _this.onMetaDesc.bind(_assertThisInitialized(_this));
    _this.onSubsUpdated = _this.onSubsUpdated.bind(_assertThisInitialized(_this));
    _this.onTagsUpdated = _this.onTagsUpdated.bind(_assertThisInitialized(_this));
    _this.handleFullNameUpdate = _this.handleFullNameUpdate.bind(_assertThisInitialized(_this));
    _this.handlePrivateUpdate = _this.handlePrivateUpdate.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleMuted = _this.handleMuted.bind(_assertThisInitialized(_this));
    _this.handlePermissionsChanged = _this.handlePermissionsChanged.bind(_assertThisInitialized(_this));
    _this.handleLaunchPermissionsEditor = _this.handleLaunchPermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handleHidePermissionsEditor = _this.handleHidePermissionsEditor.bind(_assertThisInitialized(_this));
    _this.handleShowAddMembers = _this.handleShowAddMembers.bind(_assertThisInitialized(_this));
    _this.handleHideAddMembers = _this.handleHideAddMembers.bind(_assertThisInitialized(_this));
    _this.handleMemberUpdateRequest = _this.handleMemberUpdateRequest.bind(_assertThisInitialized(_this));
    _this.handleLeave = _this.handleLeave.bind(_assertThisInitialized(_this));
    _this.handleMemberSelected = _this.handleMemberSelected.bind(_assertThisInitialized(_this));
    _this.handleMoreInfo = _this.handleMoreInfo.bind(_assertThisInitialized(_this));
    _this.handleTagsUpdated = _this.handleTagsUpdated.bind(_assertThisInitialized(_this));
    _this.handleContextMenu = _this.handleContextMenu.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InfoView, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(props) {
      var topic = this.props.tinode.getTopic(props.topic);

      if (!topic) {
        return;
      }

      if (this.onMetaDesc != topic.onMetaDesc) {
        this.previousMetaDesc = topic.onMetaDesc;
        topic.onMetaDesc = this.onMetaDesc;
        this.previousSubsUpdated = topic.onSubsUpdated;
        topic.onSubsUpdated = this.onSubsUpdated;

        if (topic.getType() == 'grp') {
          this.previousTagsUpdated = topic.onTagsUpdated;
          topic.onTagsUpdated = this.onTagsUpdated;
        } else {
          this.previousTagsUpdated = undefined;
        }
      }

      if (this.state.topic != props.topic) {
        this.setState({
          topic: props.topic
        });
        this.resetDesc(topic, props);
        this.resetSubs(topic, props);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      this.setState({
        topic: null
      });
      topic.onMetaDesc = this.previousMetaDesc;
      topic.onSubsUpdated = this.previousSubsUpdated;
      topic.onTagsUpdated = this.previousTagsUpdated;
    }
  }, {
    key: "resetSubs",
    value: function resetSubs(topic, props) {
      var newState = {
        contactList: []
      };

      if (topic.getType() == 'p2p') {
        var user2 = topic.subscriber(props.topic);

        if (user2) {
          newState.modeGiven2 = user2.acs.getGiven();
          newState.modeWant2 = user2.acs.getWant();
        } else {
          newState.modeGiven2 = _config_js__WEBPACK_IMPORTED_MODULE_13__["NO_ACCESS_MODE"];
          newState.modeWant2 = _config_js__WEBPACK_IMPORTED_MODULE_13__["NO_ACCESS_MODE"];
        }
      } else {
        topic.subscribers(function (sub) {
          newState.contactList.push(sub);
        }, this);
      }

      this.setState(newState);
    }
  }, {
    key: "resetDesc",
    value: function resetDesc(topic, props) {
      var defacs = topic.getDefaultAccess() || {};
      var acs = topic.getAccessMode();
      this.setState({
        owner: acs && acs.isOwner(),
        admin: acs && acs.isAdmin(),
        sharer: acs && acs.isSharer(),
        muted: acs && acs.isMuted(),
        fullName: topic.public ? topic.public.fn : undefined,
        avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_14__["makeImageUrl"])(topic.public ? topic.public.photo : null),
        private: topic.private ? topic.private.comment : null,
        address: topic.name,
        groupTopic: topic.getType() == 'grp',
        showMemberPanel: false,
        access: acs ? acs.getMode() : undefined,
        modeGiven: acs ? acs.getGiven() : undefined,
        modeWant: acs ? acs.getWant() : undefined,
        auth: defacs.auth,
        anon: defacs.anon
      });

      if (topic.getType() == 'grp' && acs && acs.isOwner()) {
        topic.getMeta(topic.startMetaQuery().withTags().build());
      }
    }
  }, {
    key: "onMetaDesc",
    value: function onMetaDesc(desc) {
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      this.resetDesc(topic, this.props);

      if (this.previousMetaDesc && this.previousMetaDesc != this.onMetaDesc) {
        this.previousMetaDesc(desc);
      }
    }
  }, {
    key: "onSubsUpdated",
    value: function onSubsUpdated(subs) {
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      this.resetSubs(topic, this.props);

      if (this.previousSubsUpdated && this.previousSubsUpdated != this.onSubsUpdated) {
        this.previousSubsUpdated(subs);
      }
    }
  }, {
    key: "onTagsUpdated",
    value: function onTagsUpdated(tags) {
      this.setState({
        tags: tags
      });

      if (this.previousTagsUpdated && this.previousTagsUpdated != this.onTagsUpdated) {
        this.previousTagsUpdated();
      }
    }
  }, {
    key: "handleFullNameUpdate",
    value: function handleFullNameUpdate(fn) {
      fn = fn.trim();

      if (this.state.fullName !== fn) {
        this.setState({
          fullName: fn
        });
        this.props.onTopicDescUpdate(this.props.topic, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__["vcard"])(fn, null), null);
      }
    }
  }, {
    key: "handlePrivateUpdate",
    value: function handlePrivateUpdate(priv) {
      if (this.state.priv !== priv) {
        this.setState({
          private: priv
        });
        this.props.onTopicDescUpdate(this.props.topic, null, priv || tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
      }
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        avatar: img
      });
      this.props.onTopicDescUpdate(this.props.topic, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__["vcard"])(null, img), null);
    }
  }, {
    key: "handleMuted",
    value: function handleMuted(ignored, checked) {
      this.setState({
        muted: checked
      });
      this.props.onChangePermissions(this.props.topic, checked ? '-P' : '+P');
    }
  }, {
    key: "handlePermissionsChanged",
    value: function handlePermissionsChanged(perm) {
      switch (this.state.showPermissionEditorFor) {
        case 'auth':
          this.props.onTopicDescUpdate(this.props.topic, null, null, {
            auth: perm
          });
          break;

        case 'anon':
          this.props.onTopicDescUpdate(this.props.topic, null, null, {
            anon: perm
          });
          break;

        case 'mode':
        case 'want':
          this.props.onChangePermissions(this.props.topic, perm);
          break;

        case 'given':
          this.props.onChangePermissions(this.props.topic, perm, this.props.topic);
          break;

        case 'user':
          this.props.onChangePermissions(this.props.topic, perm, this.state.userPermissionsEdited);
          break;
      }

      this.setState({
        showPermissionEditorFor: undefined
      });
    }
  }, {
    key: "handleLaunchPermissionsEditor",
    value: function handleLaunchPermissionsEditor(which, uid) {
      var formatMessage = this.props.intl.formatMessage;
      var toEdit, toCompare, toSkip, titleEdit, titleCompare, userTitle, userAvatar;

      switch (which) {
        case 'mode':
          toEdit = this.state.access;
          break;

        case 'want':
          toEdit = this.state.modeWant;
          toCompare = this.state.modeGiven;
          toSkip = this.state.groupTopic ? 'O' : 'ASDO';
          titleEdit = formatMessage(messages.requested);
          titleCompare = formatMessage(messages.granted);
          break;

        case 'given':
          toEdit = this.state.modeGiven2;
          toCompare = this.state.modeWant2;
          toSkip = this.state.groupTopic ? this.state.owner ? '' : 'O' : 'ASDO';
          titleEdit = formatMessage(messages.granted);
          titleCompare = formatMessage(messages.requested);
          break;

        case 'auth':
          toEdit = this.state.auth;
          toSkip = 'O';
          break;

        case 'anon':
          toEdit = this.state.anon;
          toSkip = 'O';
          break;

        case 'user':
          {
            var topic = this.props.tinode.getTopic(this.props.topic);

            if (!topic) {
              return;
            }

            var user = topic.subscriber(uid);

            if (!user || !user.acs) {
              return;
            }

            toEdit = user.acs.getGiven();
            toCompare = user.acs.getWant();
            toSkip = this.state.owner ? '' : 'O';
            titleEdit = formatMessage(messages.granted);
            titleCompare = formatMessage(messages.requested);

            if (user.public) {
              userTitle = user.public.fn;
              userAvatar = user.public.photo;
            }

            break;
          }

        default:
          console.log("Unknown permission editing mode '" + which + "'");
          break;
      }

      this.setState({
        showPermissionEditorFor: which,
        userPermissionsEdited: uid,
        userPermissionsTitle: userTitle,
        userPermissionsAvatar: userAvatar,
        editedPermissions: toEdit,
        immutablePermissions: toCompare,
        editedPermissionsTitle: titleEdit,
        immutablePermissionsTitle: titleCompare,
        editedPermissionsSkipped: toSkip
      });
    }
  }, {
    key: "handleHidePermissionsEditor",
    value: function handleHidePermissionsEditor() {
      this.setState({
        showPermissionEditorFor: undefined
      });
    }
  }, {
    key: "handleShowAddMembers",
    value: function handleShowAddMembers() {
      this.props.onInitFind();
      this.setState({
        showMemberPanel: true
      });
    }
  }, {
    key: "handleHideAddMembers",
    value: function handleHideAddMembers() {
      this.setState({
        showMemberPanel: false
      });
    }
  }, {
    key: "handleMemberUpdateRequest",
    value: function handleMemberUpdateRequest(members, added, removed) {
      this.props.onMemberUpdateRequest(this.props.topic, added, removed);
      this.setState({
        showMemberPanel: false
      });
    }
  }, {
    key: "handleLeave",
    value: function handleLeave() {
      this.props.onLeaveTopic(this.props.topic);
    }
  }, {
    key: "handleMemberSelected",
    value: function handleMemberSelected(uid) {
      this.setState({
        selectedContact: uid
      });
    }
  }, {
    key: "handleMoreInfo",
    value: function handleMoreInfo(open) {
      this.setState({
        moreInfoExpanded: open
      });
    }
  }, {
    key: "handleTagsUpdated",
    value: function handleTagsUpdated(tags) {
      if (!Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_15__["arrayEqual"])(this.state.tags.slice(0), tags.slice(0))) {
        this.props.onTopicTagsUpdate(this.props.topic, tags);
      }
    }
  }, {
    key: "handleContextMenu",
    value: function handleContextMenu(params) {
      var formatMessage = this.props.intl.formatMessage;
      var instance = this;
      var topic = this.props.tinode.getTopic(this.props.topic);

      if (!topic) {
        return;
      }

      var user = topic.subscriber(params.topicName);

      if (!user || !user.acs) {
        return;
      }

      var menuItems = [{
        title: formatMessage(messages.edit_permissions),
        handler: function handler() {
          instance.handleLaunchPermissionsEditor('user', params.topicName);
        }
      }, 'member_delete', user.acs.isMuted() ? 'member_unmute' : 'member_mute', user.acs.isJoiner() ? 'member_block' : 'member_unblock'];
      this.props.showContextMenu({
        topicName: this.props.topic,
        x: params.x,
        y: params.y,
        user: params.topicName
      }, menuItems);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var formatMessage = this.props.intl.formatMessage;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "info-view"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "caption-panel",
        id: "info-caption-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-title",
        id: "info-title"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_info",
        defaultMessage: "Info"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        onCancel: this.props.onCancel
      }))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        level: this.props.errorLevel,
        text: this.props.errorText,
        onClearError: this.props.onError
      }) : null, this.state.showMemberPanel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_group_manager_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        members: this.state.contactList,
        requiredMember: this.props.myUserId,
        myUserId: this.props.myUserId,
        contacts: this.props.searchableContacts,
        onCancel: this.handleHideAddMembers,
        onSubmit: this.handleMemberUpdateRequest
      }) : this.state.showPermissionEditorFor ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_permissions_editor_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
        mode: this.state.editedPermissions,
        compare: this.state.immutablePermissions,
        skip: this.state.editedPermissionsSkipped,
        modeTitle: this.state.editedPermissionsTitle,
        compareTitle: this.state.immutablePermissionsTitle,
        userTitle: this.state.userPermissionsTitle,
        item: this.state.userPermissionsEdited,
        userAvatar: this.state.userPermissionsAvatar,
        onSubmit: this.handlePermissionsChanged,
        onCancel: this.handleHidePermissionsEditor
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "info-view-content",
        className: "scrollable-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_topic_name",
        defaultMessage: "Name"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        placeholder: this.state.groupTopic ? "Group name" : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, "Unknown"),
        readOnly: !this.state.owner,
        value: this.state.fullName,
        required: true,
        onFinished: this.handleFullNameUpdate
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_private",
        defaultMessage: "Private comment"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "private_editing_placeholder",
        defaultMessage: "Visible to you only"
      }, function (private_placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_in_place_edit_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
          placeholder: private_placeholder,
          value: _this2.state.private,
          onFinished: _this2.handlePrivateUpdate
        });
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        avatar: this.state.avatar,
        readOnly: !this.state.owner,
        uid: this.props.topic,
        title: this.state.fullName,
        onImageChanged: this.handleImageChanged,
        onError: this.props.onError
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_muting_topic",
        defaultMessage: "Muted:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: "P",
        checked: this.state.muted,
        onChange: this.handleMuted
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "action_more",
        defaultMessage: "More"
      }, function (more) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_more_button_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
          title: more,
          open: _this2.state.moreInfoExpanded,
          onToggle: _this2.handleMoreInfo
        });
      }), this.state.moreInfoExpanded ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_user_id"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.state.address)), this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_your_permissions",
        defaultMessage: "Your permissions:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'want')
      }, this.state.access)) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_permissions",
        defaultMessage: "Permissions:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_you",
        defaultMessage: "You:"
      }), " \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'want')
      }, this.state.access)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, this.state.fullName ? this.state.fullName : formatMessage(messages.other_user), ": \xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'given')
      }, this.state.modeGiven2)))), this.state.sharer && (this.state.auth || this.state.anon) ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_default_access",
        defaultMessage: "Default access mode:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "quoted"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Auth: ", this.state.admin ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'auth')
      }, this.state.auth) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.state.auth)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Anon: ", this.state.admin ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", {
        className: "clickable",
        onClick: this.handleLaunchPermissionsEditor.bind(this, 'anon')
      }, this.state.anon) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tt", null, this.state.anon)))) : null) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }), this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_tag_manager"
      }, function (tags) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_12__["default"], {
          title: tags,
          tags: _this2.state.tags,
          activated: false,
          onSubmit: _this2.handleTagsUpdated
        });
      }) : null, this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "hr"
      }) : null, this.state.groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_group_members",
        defaultMessage: "Group members:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, this.state.sharer ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "flat-button",
        onClick: this.handleShowAddMembers
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "person_add"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_add_members",
        defaultMessage: "Add members"
      })) : null, !this.state.owner ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "red flat-button",
        onClick: this.handleLeave
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "exit_to_app"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_leave",
        defaultMessage: "Leave"
      })) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "group_has_no_members",
        defaultMessage: "No members"
      }, function (no_members) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          contacts: _this2.state.contactList,
          myUserId: _this2.props.myUserId,
          emptyListMessage: no_members,
          topicSelected: _this2.state.selectedContact,
          showOnline: false,
          showUnread: false,
          showMode: true,
          noScroll: true,
          onTopicSelected: _this2.handleMemberSelected,
          showContextMenu: _this2.state.admin ? _this2.handleContextMenu : false
        });
      })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "red flat-button",
        onClick: this.handleLeave
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "exit_to_app"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "action_leave_chat",
        defaultMessage: "Leave"
      })))));
    }
  }]);

  return InfoView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(InfoView));

/***/ }),

/***/ "./src/views/login-view.jsx":
/*!**********************************!*\
  !*** ./src/views/login-view.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LoginView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var LoginView = function (_React$Component) {
  _inherits(LoginView, _React$Component);

  function LoginView(props) {
    var _this;

    _classCallCheck(this, LoginView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoginView).call(this, props));
    _this.state = {
      login: props.login,
      password: '',
      hostName: props.serverAddress,
      saveToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__["default"].getObject('keep-logged-in')
    };
    _this.handleLoginChange = _this.handleLoginChange.bind(_assertThisInitialized(_this));
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_assertThisInitialized(_this));
    _this.handleToggleSaveToken = _this.handleToggleSaveToken.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(LoginView, [{
    key: "handleLoginChange",
    value: function handleLoginChange(e) {
      this.setState({
        login: e.target.value
      });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(e) {
      this.setState({
        password: e.target.value
      });
    }
  }, {
    key: "handleToggleSaveToken",
    value: function handleToggleSaveToken() {
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_4__["default"].setObject('keep-logged-in', !this.state.saveToken);
      this.setState({
        saveToken: !this.state.saveToken
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      this.props.onLogin(this.state.login.trim(), this.state.password.trim());
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var submitClasses = 'blue';

      if (this.props.disabled) {
        submitClasses += ' disabled';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        id: "login-form",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "login_prompt",
        defaultMessage: "Login"
      }, function (login_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "inputLogin",
          placeholder: login_prompt,
          autoComplete: "username",
          value: _this2.state.login,
          onChange: _this2.handleLoginChange,
          required: true,
          autoFocus: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "password_prompt",
        defaultMessage: "Password"
      }, function (password_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          type: "password",
          id: "inputPassword",
          placeholder: password_prompt,
          autoComplete: "current-password",
          value: _this2.state.password,
          onChange: _this2.handlePasswordChange,
          required: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "save-token",
        name: "save-token",
        checked: this.state.saveToken,
        onChange: this.handleToggleSaveToken
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "save-token"
      }, "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "stay_logged_in",
        defaultMessage: "Stay logged in"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#reset"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "forgot_password_link",
        defaultMessage: "Forgot password?"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: submitClasses,
        type: "submit"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_sign_in",
        defaultMessage: "Sign in"
      }))));
    }
  }]);

  return LoginView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/views/logo-view.jsx":
/*!*********************************!*\
  !*** ./src/views/logo-view.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LogoView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var LogoView = function (_React$PureComponent) {
  _inherits(LogoView, _React$PureComponent);

  function LogoView() {
    _classCallCheck(this, LogoView);

    return _possibleConstructorReturn(this, _getPrototypeOf(LogoView).apply(this, arguments));
  }

  _createClass(LogoView, [{
    key: "render",
    value: function render() {
      var version = _config_js__WEBPACK_IMPORTED_MODULE_3__["APP_NAME"] + ' (' + tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.getLibrary() + ')';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "dummy-view",
        className: this.props.hideSelf ? 'nodisplay' : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "https://github.com/tinode/chat/"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        id: "logo",
        alt: "logo",
        src: "img/logo.svg"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Tinode Web")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_client",
        defaultMessage: "Client:"
      }), " ", version), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_server",
        defaultMessage: "Server:"
      }), " ", this.props.serverVersion, " (", this.props.serverAddress, ")")));
    }
  }]);

  return LogoView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/views/messages-view.jsx":
/*!*************************************!*\
  !*** ./src/views/messages-view.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/chat-message.jsx */ "./src/widgets/chat-message.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/group-subs.jsx */ "./src/widgets/group-subs.jsx");
/* harmony import */ var _widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/image-preview.jsx */ "./src/widgets/image-preview.jsx");
/* harmony import */ var _widgets_Invitation_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../widgets/Invitation.jsx */ "./src/widgets/Invitation.jsx");
/* harmony import */ var _widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../widgets/letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../widgets/load-spinner.jsx */ "./src/widgets/load-spinner.jsx");
/* harmony import */ var _logo_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./logo-view.jsx */ "./src/views/logo-view.jsx");
/* harmony import */ var _widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../widgets/send-message.jsx */ "./src/widgets/send-message.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Drafty = tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.Drafty;












var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  online_now: {
    "id": "online_now",
    "defaultMessage": "online now"
  },
  last_seen: {
    "id": "last_seen_timestamp",
    "defaultMessage": "Last seen"
  },
  'not_found': {
    "id": "title_not_found",
    "defaultMessage": "Not found"
  }
});

function isUnconfirmed(acs) {
  if (acs) {
    var ex = acs.getExcessive() || '';
    return acs.isJoiner('given') && (ex.includes('R') || ex.includes('W'));
  }

  return false;
}

function isPeerRestricted(acs) {
  if (acs) {
    var ms = acs.getMissing() || '';
    return acs.isJoiner('want') && (ms.includes('R') || ms.includes('W'));
  }

  return false;
}

var MessagesView = function (_React$Component) {
  _inherits(MessagesView, _React$Component);

  function MessagesView(props) {
    var _this;

    _classCallCheck(this, MessagesView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MessagesView).call(this, props));
    _this.state = MessagesView.getDerivedStateFromProps(props, {});
    _this.leave = _this.leave.bind(_assertThisInitialized(_this));
    _this.handleScrollReference = _this.handleScrollReference.bind(_assertThisInitialized(_this));
    _this.handleScrollEvent = _this.handleScrollEvent.bind(_assertThisInitialized(_this));
    _this.handleDescChange = _this.handleDescChange.bind(_assertThisInitialized(_this));
    _this.handleSubsUpdated = _this.handleSubsUpdated.bind(_assertThisInitialized(_this));
    _this.handleNewMessage = _this.handleNewMessage.bind(_assertThisInitialized(_this));
    _this.handleAllMessagesReceived = _this.handleAllMessagesReceived.bind(_assertThisInitialized(_this));
    _this.handleInfoReceipt = _this.handleInfoReceipt.bind(_assertThisInitialized(_this));
    _this.handleImagePreview = _this.handleImagePreview.bind(_assertThisInitialized(_this));
    _this.handleCloseImagePreview = _this.handleCloseImagePreview.bind(_assertThisInitialized(_this));
    _this.handleFormResponse = _this.handleFormResponse.bind(_assertThisInitialized(_this));
    _this.handleContextClick = _this.handleContextClick.bind(_assertThisInitialized(_this));
    _this.handleShowContextMenuMessage = _this.handleShowContextMenuMessage.bind(_assertThisInitialized(_this));
    _this.handleBackNavigation = _this.handleBackNavigation.bind(_assertThisInitialized(_this));
    _this.handleNewChatAcceptance = _this.handleNewChatAcceptance.bind(_assertThisInitialized(_this));
    _this.handleEnablePeer = _this.handleEnablePeer.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MessagesView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.messagesScroller) {
        this.messagesScroller.addEventListener('scroll', this.handleScrollEvent);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.leave(this.state.topic);

      if (this.messagesScroller) {
        this.messagesScroller.removeEventListener('scroll', this.handleScrollEvent);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      if (this.messagesScroller) {
        if (prevState.topic != this.state.topic || prevState.messages.length != this.state.messages.length) {
          this.messagesScroller.scrollTop = this.messagesScroller.scrollHeight - this.state.scrollPosition;
        } else if (prevProps.viewportHeight > this.props.viewportHeight) {
          this.messagesScroller.scrollTop += prevProps.viewportHeight - this.props.viewportHeight;
        }
      }

      var topic = this.props.tinode.getTopic(this.state.topic);

      if (this.state.topic != prevState.topic) {
        if (prevState.topic) {
          this.leave(prevState.topic);
          this.props.readTimerHandler(null);
        }

        if (topic) {
          topic.onData = this.handleNewMessage;
          topic.onAllMessagesReceived = this.handleAllMessagesReceived;
          topic.onInfo = this.handleInfoReceipt;
          topic.onMetaDesc = this.handleDescChange;
          topic.onSubsUpdated = this.handleSubsUpdated;
          topic.onPres = this.handleSubsUpdated;
        }
      }

      if (topic && !topic.isSubscribed() && this.props.ready && (this.state.topic != prevState.topic || !prevProps.ready)) {
        var newTopic = this.props.newTopicParams && this.props.newTopicParams._topicName == this.props.topic;
        var getQuery = topic.startMetaQuery().withLaterDesc().withLaterSub();

        if (this.state.isReader || newTopic) {
          getQuery = getQuery.withLaterData(_config_js__WEBPACK_IMPORTED_MODULE_12__["MESSAGES_PAGE"]);

          if (this.state.isReader) {
            getQuery = getQuery.withLaterDel();
          }

          this.setState({
            fetchingMessages: true
          });
        }

        var setQuery = newTopic ? this.props.newTopicParams : undefined;
        topic.subscribe(getQuery.build(), setQuery).then(function (ctrl) {
          if (_this2.state.topic != ctrl.topic) {
            _this2.setState({
              topic: ctrl.topic
            });
          }

          _this2.props.onNewTopicCreated(_this2.props.topic, ctrl.topic);

          topic.queuedMessages(function (pub) {
            if (!pub._sending && topic.isSubscribed()) {
              topic.publishMessage(pub);
            }
          });
        }).catch(function (err) {
          console.log("Failed subscription to", _this2.state.topic);

          _this2.props.onError(err.message, 'err');

          var blankState = MessagesView.getDerivedStateFromProps({}, {});
          blankState.title = _this2.props.intl.formatMessage(messages.not_found);

          _this2.setState(blankState);
        });
      }
    }
  }, {
    key: "leave",
    value: function leave(oldTopicName) {
      var _this3 = this;

      if (!oldTopicName) {
        return;
      }

      var oldTopic = this.props.tinode.getTopic(oldTopicName);

      if (oldTopic && oldTopic.isSubscribed()) {
        oldTopic.leave(false).catch(function () {}).finally(function () {
          _this3.setState({
            fetchingMessages: false
          });

          oldTopic.onData = undefined;
          oldTopic.onAllMessagesReceived = undefined;
          oldTopic.onInfo = undefined;
          oldTopic.onMetaDesc = undefined;
          oldTopic.onSubsUpdated = undefined;
          oldTopic.onPres = undefined;
        });
      }
    }
  }, {
    key: "handleScrollReference",
    value: function handleScrollReference(node) {
      if (node) {
        node.addEventListener('scroll', this.handleScrollEvent);
        this.messagesScroller = node;
      }
    }
  }, {
    key: "handleScrollEvent",
    value: function handleScrollEvent(event) {
      var _this4 = this;

      this.setState({
        scrollPosition: event.target.scrollHeight - event.target.scrollTop
      });

      if (event.target.scrollTop <= 0) {
        this.setState(function (prevState, props) {
          var newState = {};

          if (!prevState.fetchingMessages) {
            var topic = _this4.props.tinode.getTopic(_this4.state.topic);

            if (topic && topic.isSubscribed() && topic.msgHasMoreMessages()) {
              newState.fetchingMessages = true;
              topic.getMessagesPage(_config_js__WEBPACK_IMPORTED_MODULE_12__["MESSAGES_PAGE"]).catch(function (err) {
                _this4.setState({
                  fetchingMessages: false
                });

                _this4.props.onError(err.message, 'err');
              });
            }
          }

          return newState;
        });
      }
    }
  }, {
    key: "handleDescChange",
    value: function handleDescChange(desc) {
      if (desc.public) {
        this.setState({
          title: desc.public.fn,
          avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__["makeImageUrl"])(desc.public.photo)
        });
      } else {
        this.setState({
          title: '',
          avatar: null
        });
      }

      if (desc.acs) {
        this.setState({
          isWriter: desc.acs.isWriter(),
          isReader: desc.acs.isReader(),
          readingBlocked: !desc.acs.isReader('given'),
          unconfirmed: isUnconfirmed(desc.acs)
        });
      }
    }
  }, {
    key: "handleSubsUpdated",
    value: function handleSubsUpdated() {
      var _this5 = this;

      if (this.state.topic) {
        var subs = [];
        var topic = this.props.tinode.getTopic(this.state.topic);
        topic.subscribers(function (sub) {
          if (sub.online && sub.user != _this5.props.myUserId) {
            subs.push(sub);
          }
        });
        var newState = {
          onlineSubs: subs
        };
        var peer = topic.p2pPeerDesc();

        if (peer) {
          Object.assign(newState, {
            peerMessagingDisabled: isPeerRestricted(peer.acs)
          });
        } else if (this.state.peerMessagingDisabled) {
          Object.assign(newState, {
            peerMessagingDisabled: false
          });
        }

        this.setState(newState);
      }
    }
  }, {
    key: "handleNewMessage",
    value: function handleNewMessage(msg) {
      var topic = this.props.tinode.getTopic(this.state.topic);
      var newState = {
        messages: []
      };
      topic.messages(function (m) {
        if (!m.deleted) {
          newState.messages = newState.messages.concat(m);
        }
      });

      if (msg && !msg.deleted) {
        if (topic.isNewMessage(msg.seq)) {
          newState.scrollPosition = 0;
        }

        var status = topic.msgStatus(msg);

        if (status >= tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENT && msg.from != this.props.myUserId) {
          this.props.readTimerHandler(function () {
            topic.noteRead(msg.seq);
          });
        }

        this.props.onData(msg);
      }

      this.setState(newState);
    }
  }, {
    key: "handleAllMessagesReceived",
    value: function handleAllMessagesReceived(count) {
      this.setState({
        fetchingMessages: false
      });
    }
  }, {
    key: "handleInfoReceipt",
    value: function handleInfoReceipt(info) {
      switch (info.what) {
        case 'kp':
          {
            clearTimeout(this.keyPressTimer);
            var instance = this;
            this.keyPressTimer = setTimeout(function () {
              instance.setState({
                typingIndicator: false
              });
            }, _config_js__WEBPACK_IMPORTED_MODULE_12__["KEYPRESS_DELAY"] + 1000);

            if (!this.state.typingIndicator) {
              this.setState({
                typingIndicator: true
              });
            }

            break;
          }

        case 'read':
        case 'recv':
          this.forceUpdate();
          break;

        default:
          console.log("Other change in topic: ", info.what);
      }
    }
  }, {
    key: "handleImagePreview",
    value: function handleImagePreview(content) {
      this.setState({
        imagePreview: content
      });
    }
  }, {
    key: "handleCloseImagePreview",
    value: function handleCloseImagePreview() {
      this.setState({
        imagePreview: null
      });
    }
  }, {
    key: "handleFormResponse",
    value: function handleFormResponse(action, text, data) {
      if (action == 'pub') {
        this.props.sendMessage(Drafty.attachJSON(Drafty.parse(text), data));
      } else if (action == 'url') {
        var url = new URL(data.ref);
        var params = url.searchParams;

        for (var key in data.resp) {
          if (data.resp.hasOwnProperty(key)) {
            params.set(key, data.resp[key]);
          }
        }

        ['name', 'seq'].map(function (key) {
          if (data[key]) {
            params.set(key, data[key]);
          }
        });
        params.set('uid', this.props.myUserId);
        url.search = params;
        window.open(url, '_blank');
      } else {
        console.log("Unknown action in form", action);
      }
    }
  }, {
    key: "handleContextClick",
    value: function handleContextClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.showContextMenu({
        topicName: this.state.topic,
        y: e.pageY,
        x: e.pageX
      });
    }
  }, {
    key: "handleShowContextMenuMessage",
    value: function handleShowContextMenuMessage(params) {
      params.topicName = this.state.topic;
      var menuItems = ['message_delete'];
      var topic = this.props.tinode.getTopic(params.topicName);

      if (topic) {
        var acs = topic.getAccessMode();

        if (acs && acs.isDeleter()) {
          menuItems.push('message_delete_hard');
        }
      }

      this.props.showContextMenu(params, menuItems);
    }
  }, {
    key: "handleBackNavigation",
    value: function handleBackNavigation() {
      this.props.onHideMessagesView();
    }
  }, {
    key: "handleNewChatAcceptance",
    value: function handleNewChatAcceptance(action) {
      this.props.onNewChat(this.state.topic, action);
    }
  }, {
    key: "handleEnablePeer",
    value: function handleEnablePeer() {
      this.props.onChangePermissions(this.state.topic, _config_js__WEBPACK_IMPORTED_MODULE_12__["DEFAULT_ACCESS_MODE"], this.state.topic);
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var component;

      if (this.state.topic) {
        var topic = this.props.tinode.getTopic(this.state.topic);
        var groupTopic = topic.getType() == 'grp';
        var messageNodes = [];
        var previousFrom = null;
        var chatBoxClass = null;

        for (var i = 0; i < this.state.messages.length; i++) {
          var msg = this.state.messages[i];
          var nextFrom = null;

          if (i + 1 < this.state.messages.length) {
            nextFrom = this.state.messages[i + 1].from;
          }

          var sequence = 'single';

          if (msg.from == previousFrom) {
            if (msg.from == nextFrom) {
              sequence = 'middle';
            } else {
              sequence = 'last';
            }
          } else if (msg.from == nextFrom) {
            sequence = 'first';
          }

          previousFrom = msg.from;
          var isReply = !(msg.from == this.props.myUserId);
          var deliveryStatus = topic.msgStatus(msg);
          var userName = void 0,
              userAvatar = void 0,
              userFrom = void 0;

          if (groupTopic) {
            var user = topic.userDesc(msg.from);

            if (user && user.public) {
              userName = user.public.fn;
              userAvatar = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__["makeImageUrl"])(user.public.photo);
            }

            userFrom = msg.from;
            chatBoxClass = 'chat-box group';
          } else {
            chatBoxClass = 'chat-box';
          }

          messageNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_chat_message_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            content: msg.content,
            mimeType: msg.head ? msg.head.mime : null,
            timestamp: msg.ts,
            response: isReply,
            seq: msg.seq,
            userFrom: userFrom,
            userName: userName,
            userAvatar: userAvatar,
            sequence: sequence,
            received: deliveryStatus,
            uploader: msg._uploader,
            viewportWidth: this.props.viewportWidth,
            showContextMenu: this.handleShowContextMenuMessage,
            onImagePreview: this.handleImagePreview,
            onFormResponse: this.handleFormResponse,
            onError: this.props.onError,
            key: msg.seq
          }));
        }

        var lastSeen = null;
        var cont = this.props.tinode.getMeTopic().getContact(this.state.topic);

        if (cont && tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.topicType(cont.topic) == 'p2p') {
          if (cont.online) {
            lastSeen = formatMessage(messages.online_now);
          } else if (cont.seen) {
            lastSeen = formatMessage(messages.last_seen) + ": " + Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_14__["shortDateFormat"])(cont.seen.when, this.props.intl.locale);
          }
        }

        var avatar = this.state.avatar || true;
        var online = this.props.online ? 'online' + (this.state.typingIndicator ? ' typing' : '') : 'offline';
        component = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-view",
          className: this.props.hideSelf ? 'nodisplay' : null
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-caption-panel",
          className: "caption-panel"
        }, this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "javascript:;",
          id: "hide-message-view",
          onClick: this.handleBackNavigation
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons"
        }, "arrow_back")) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "avatar-box"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
          avatar: avatar,
          topic: this.state.topic,
          title: this.state.title
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: online
        })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-title-group"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-title",
          className: "panel-title"
        }, this.state.title || react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "unnamed_topic",
          defaultMessage: "Unnamed"
        }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-last-seen"
        }, lastSeen)), groupTopic ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_group_subs_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
          subscribers: this.state.onlineSubs
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "topic-users"
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "javascript:;",
          onClick: this.handleContextClick
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons"
        }, "more_vert")))), this.props.displayMobile ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
          level: this.props.errorLevel,
          text: this.props.errorText,
          onClearError: this.props.onError
        }) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_load_spinner_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
          show: this.state.fetchingMessages
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "messages-container"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "messages-panel",
          ref: this.handleScrollReference
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
          id: "scroller",
          className: chatBoxClass
        }, messageNodes)), !this.state.isReader ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "write-only-background"
        }, this.state.readingBlocked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "write-only-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "messages_not_readable",
          defaultMessage: "no access to messages"
        })) : null) : null), this.state.peerMessagingDisabled && !this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "peer-messaging-disabled-note"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons secondary"
        }, "block"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "peers_messaging_disabled",
          defaultMessage: "Peer's messaging is disabled."
        }), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "javascript:;",
          onClick: this.handleEnablePeer
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "enable_peers_messaging",
          defaultMessage: "Enable"
        })), ".") : null, this.state.unconfirmed ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_Invitation_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
          onAction: this.handleNewChatAcceptance
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_send_message_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
          tinode: this.props.tinode,
          topic: this.props.topic,
          disabled: !this.state.isWriter,
          sendMessage: this.props.sendMessage,
          onError: this.props.onError
        }), this.state.imagePreview ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_image_preview_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
          content: this.state.imagePreview,
          onClose: this.handleCloseImagePreview
        }) : null);
      } else {
        component = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_logo_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
          hideSelf: this.props.hideSelf,
          serverVersion: this.props.serverVersion,
          serverAddress: this.props.serverAddress
        });
      }

      return component;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var nextState = {};

      if (!nextProps.topic) {
        nextState = {
          messages: [],
          onlineSubs: [],
          topic: null,
          title: '',
          avatar: null,
          imagePreview: null,
          typingIndicator: false,
          scrollPosition: 0,
          fetchingMessages: false,
          peerMessagingDisabled: false
        };
      } else if (nextProps.topic != prevState.topic) {
        var topic = nextProps.tinode.getTopic(nextProps.topic);
        nextState = {
          topic: nextProps.topic,
          imagePreview: null,
          typingIndicator: false,
          scrollPosition: 0,
          fetchingMessages: false
        };

        if (topic) {
          var msgs = [];
          var subs = [];

          if (nextProps.connected) {
            topic.subscribers(function (sub) {
              if (sub.online && sub.user != nextProps.myUserId) {
                subs.push(sub);
              }
            });
          }

          topic.messages(function (msg) {
            if (!msg.deleted) {
              msgs.push(msg);
            }
          });
          Object.assign(nextState, {
            messages: msgs,
            onlineSubs: subs
          });

          if (topic.public) {
            Object.assign(nextState, {
              title: topic.public.fn,
              avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_13__["makeImageUrl"])(topic.public.photo)
            });
          } else {
            Object.assign(nextState, {
              title: '',
              avatar: null
            });
          }

          var peer = topic.p2pPeerDesc();

          if (peer) {
            Object.assign(nextState, {
              peerMessagingDisabled: isPeerRestricted(peer.acs)
            });
          } else if (prevState.peerMessagingDisabled) {
            Object.assign(nextState, {
              peerMessagingDisabled: false
            });
          }
        } else {
          Object.assign(nextState, {
            messages: [],
            onlineSubs: [],
            title: '',
            avatar: null,
            peerMessagingDisabled: false
          });
        }
      }

      if (nextProps.acs) {
        if (nextProps.acs.isWriter() != prevState.isWriter) {
          nextState.isWriter = !prevState.isWriter;
        }

        if (nextProps.acs.isReader() != prevState.isReader) {
          nextState.isReader = !prevState.isReader;
        }

        if (!nextProps.acs.isReader('given') != prevState.readingBlocked) {
          nextState.readingBlocked = !prevState.readingBlocked;
        }
      } else {
        if (prevState.isWriter) {
          nextState.isWriter = false;
        }

        if (prevState.isReader) {
          nextState.isReader = false;
        }

        if (!prevState.readingBlocked) {
          prevState.readingBlocked = true;
        }
      }

      if (isUnconfirmed(nextProps.acs) == !prevState.unconformed) {
        nextState.unconfirmed = !prevState.unconformed;
      }

      if (!nextProps.connected && prevState.onlineSubs && prevState.onlineSubs.length > 0) {
        nextState.onlineSubs = [];
      }

      return nextState;
    }
  }]);

  return MessagesView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(MessagesView));

/***/ }),

/***/ "./src/views/new-topic-view.jsx":
/*!**************************************!*\
  !*** ./src/views/new-topic-view.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NewTopicView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/contact-list.jsx */ "./src/widgets/contact-list.jsx");
/* harmony import */ var _widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/new-topic-by-id.jsx */ "./src/widgets/new-topic-by-id.jsx");
/* harmony import */ var _widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../widgets/new-topic-group.jsx */ "./src/widgets/new-topic-group.jsx");
/* harmony import */ var _widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../widgets/search-contacts.jsx */ "./src/widgets/search-contacts.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










var NewTopicView = function (_React$Component) {
  _inherits(NewTopicView, _React$Component);

  function NewTopicView(props) {
    var _this;

    _classCallCheck(this, NewTopicView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewTopicView).call(this, props));
    _this.state = {
      tabSelected: 'p2p'
    };
    _this.handleTabClick = _this.handleTabClick.bind(_assertThisInitialized(_this));
    _this.handleContactSelected = _this.handleContactSelected.bind(_assertThisInitialized(_this));
    _this.handleNewGroupSubmit = _this.handleNewGroupSubmit.bind(_assertThisInitialized(_this));
    _this.handleGroupByID = _this.handleGroupByID.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewTopicView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onInitFind();
    }
  }, {
    key: "handleTabClick",
    value: function handleTabClick(e) {
      e.preventDefault();
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].addUrlParam(window.location.hash, 'tab', e.currentTarget.dataset.id));
      this.setState({
        tabSelected: e.currentTarget.dataset.id
      });
    }
  }, {
    key: "handleContactSelected",
    value: function handleContactSelected(sel) {
      if (this.state.tabSelected === 'p2p') {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].removeUrlParam(window.location.hash, 'tab'));
        this.props.onCreateTopic(sel, undefined);
      }
    }
  }, {
    key: "handleNewGroupSubmit",
    value: function handleNewGroupSubmit(name, dataUrl, priv, tags) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(undefined, Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_7__["vcard"])(name, dataUrl), priv, tags);
    }
  }, {
    key: "handleGroupByID",
    value: function handleGroupByID(topicName) {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_6__["default"].removeUrlParam(window.location.hash, 'tab'));
      this.props.onCreateTopic(topicName);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "flex-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "tabbar"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: this.state.tabSelected === "p2p" ? "active" : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        "data-id": "p2p",
        onClick: this.handleTabClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tabtitle_find_user",
        defaultMessage: "find"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: this.state.tabSelected === "grp" ? "active" : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        "data-id": "grp",
        onClick: this.handleTabClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tabtitle_new_group",
        defaultMessage: "new group"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: this.state.tabSelected === "byid" ? "active" : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        "data-id": "byid",
        onClick: this.handleTabClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tabtitle_group_by_id",
        defaultMessage: "by id"
      })))), this.state.tabSelected === 'grp' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_new_topic_group_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onSubmit: this.handleNewGroupSubmit
      }) : this.state.tabSelected === 'byid' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_new_topic_by_id_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        onSubmit: this.handleGroupByID,
        onError: this.props.onError
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "flex-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_search_contacts_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        type: "p2p",
        onSearchContacts: this.props.onSearchContacts
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "search_for_contacts",
        defaultMessage: "Use search to find contacts"
      }, function (search_for_contacts) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_contact_list_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          contacts: _this2.props.searchResults,
          myUserId: _this2.props.myUserId,
          emptyListMessage: search_for_contacts,
          showOnline: false,
          showUnread: false,
          showContextMenu: false,
          onTopicSelected: _this2.handleContactSelected
        });
      })));
    }
  }]);

  return NewTopicView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/views/password-reset-view.jsx":
/*!*******************************************!*\
  !*** ./src/views/password-reset-view.jsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PasswordResetView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/visible-password.jsx */ "./src/widgets/visible-password.jsx");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var PasswordResetView = function (_React$PureComponent) {
  _inherits(PasswordResetView, _React$PureComponent);

  function PasswordResetView(props) {
    var _this;

    _classCallCheck(this, PasswordResetView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PasswordResetView).call(this, props));
    _this.state = {
      email: '',
      password: ''
    };
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleEmailChange = _this.handleEmailChange.bind(_assertThisInitialized(_this));
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PasswordResetView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_3__["default"].parseUrlHash(window.location.hash);
      this.setState({
        token: parsed.params.token,
        scheme: parsed.params.scheme
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();

      if (this.state.token) {
        this.props.onReset(this.state.scheme, this.state.password.trim(), this.state.token);
      } else {
        this.props.onRequest('email', this.state.email.trim());
      }
    }
  }, {
    key: "handleEmailChange",
    value: function handleEmailChange(e) {
      this.setState({
        email: e.target.value
      });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(e) {
      this.setState({
        password: e.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var reset = this.state.token && this.state.scheme;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        id: "password-reset-form",
        onSubmit: this.handleSubmit
      }, reset ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "new_password_placeholder",
        defaultMessage: "Enter new password"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          placeholder: placeholder,
          autoComplete: "new-password",
          value: _this2.state.password,
          required: true,
          autoFocus: true,
          onChange: _this2.handlePasswordChange
        });
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "inputEmail"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_reset_password",
        defaultMessage: "Send a password reset email:"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "credential_email_prompt",
        defaultMessage: "Your registration email"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "email",
          id: "inputEmail",
          placeholder: placeholder,
          autoComplete: "email",
          value: _this2.state.email,
          onChange: _this2.handleEmailChange,
          required: true,
          autoFocus: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        type: "submit"
      }, reset ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_reset",
        defaultMessage: "Reset"
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_send_request",
        defaultMessage: "Send request"
      }))));
    }
  }]);

  return PasswordResetView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/views/settings-view.jsx":
/*!*************************************!*\
  !*** ./src/views/settings-view.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SettingsView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/host-selector.jsx */ "./src/widgets/host-selector.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var SettingsView = function (_React$PureComponent) {
  _inherits(SettingsView, _React$PureComponent);

  function SettingsView(props) {
    var _this;

    _classCallCheck(this, SettingsView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SettingsView).call(this, props));
    _this.state = {
      transport: props.transport || 'def',
      serverAddress: props.serverAddress
    };
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleTransportSelected = _this.handleTransportSelected.bind(_assertThisInitialized(_this));
    _this.handleServerAddressChange = _this.handleServerAddressChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SettingsView, [{
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      this.props.onUpdate({
        transport: this.state.transport,
        serverAddress: this.state.serverAddress
      });
    }
  }, {
    key: "handleTransportSelected",
    value: function handleTransportSelected(e) {
      this.setState({
        transport: e.currentTarget.value
      });
    }
  }, {
    key: "handleServerAddressChange",
    value: function handleServerAddressChange(name) {
      this.setState({
        serverAddress: name
      });
    }
  }, {
    key: "render",
    value: function render() {
      var names = {
        def: "default",
        ws: "websocket",
        lp: "long polling"
      };
      var transportOptions = [];
      var instance = this;
      ['def', 'ws', 'lp'].map(function (item) {
        var id = 'transport-' + item;
        var name = names[item];
        transportOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          key: item
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "radio",
          id: id,
          name: "transport-select",
          value: item,
          checked: instance.state.transport === item,
          onChange: instance.handleTransportSelected
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          htmlFor: id
        }, name)));
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        id: "settings-form",
        className: "panel-form",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_server_to_use",
        defaultMessage: "Server to use:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_host_selector_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        serverAddress: this.state.serverAddress,
        onServerAddressChange: this.handleServerAddressChange
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_wire_transport",
        defaultMessage: "Wire transport:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "quoted"
      }, transportOptions)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "submit",
        className: "blue"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_update",
        defaultMessage: "Update"
      }))));
    }
  }]);

  return SettingsView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/views/sidepanel-view.jsx":
/*!**************************************!*\
  !*** ./src/views/sidepanel-view.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../widgets/side-navbar.jsx */ "./src/widgets/side-navbar.jsx");
/* harmony import */ var _widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../widgets/error-panel.jsx */ "./src/widgets/error-panel.jsx");
/* harmony import */ var _contacts_view_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contacts-view.jsx */ "./src/views/contacts-view.jsx");
/* harmony import */ var _create_account_view_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./create-account-view.jsx */ "./src/views/create-account-view.jsx");
/* harmony import */ var _edit_account_view_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./edit-account-view.jsx */ "./src/views/edit-account-view.jsx");
/* harmony import */ var _login_view_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./login-view.jsx */ "./src/views/login-view.jsx");
/* harmony import */ var _new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./new-topic-view.jsx */ "./src/views/new-topic-view.jsx");
/* harmony import */ var _password_reset_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./password-reset-view.jsx */ "./src/views/password-reset-view.jsx");
/* harmony import */ var _settings_view_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./settings-view.jsx */ "./src/views/settings-view.jsx");
/* harmony import */ var _validation_view_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./validation-view.jsx */ "./src/views/validation-view.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }













var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'login': {
    "id": "sidepanel_title_login",
    "defaultMessage": "Sign In"
  },
  'register': {
    "id": "sidepanel_title_register",
    "defaultMessage": "Create Account"
  },
  'settings': {
    "id": "sidepanel_title_settings",
    "defaultMessage": "Settings"
  },
  'edit': {
    "id": "sidepanel_title_edit_account",
    "defaultMessage": "Edit Account"
  },
  'newtpk': {
    "id": "sidepanel_title_newtpk",
    "defaultMessage": "Start New Chat"
  },
  'cred': {
    "id": "sidepanel_title_cred",
    "defaultMessage": "Confirm Credentials"
  },
  'reset': {
    "id": "sidepanel_title_reset",
    "defaultMessage": "Reset Password"
  },
  'archive': {
    "id": "sidepanel_title_archive",
    "defaultMessage": "Archived Chats"
  }
});

var SidepanelView = function (_React$Component) {
  _inherits(SidepanelView, _React$Component);

  function SidepanelView(props) {
    var _this;

    _classCallCheck(this, SidepanelView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SidepanelView).call(this, props));
    _this.handleLoginRequested = _this.handleLoginRequested.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SidepanelView, [{
    key: "handleLoginRequested",
    value: function handleLoginRequested(login, password) {
      this.props.onLoginRequest(login, password);
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var view = this.props.state || (this.props.myUserId ? 'contacts' : 'login');
      var title, avatar;

      if (view == 'contacts') {
        title = this.props.title;
        avatar = this.props.avatar ? this.props.avatar : true;
      } else {
        title = formatMessage(messages[view]);
        avatar = false;
      }

      var onCancel;

      if (['login', 'contacts'].indexOf(view) == -1) {
        onCancel = this.props.onCancel;
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "sidepanel",
        className: this.props.hideSelf ? 'nodisplay' : null
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_side_navbar_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        state: view,
        title: title,
        avatar: avatar,
        myUserId: this.props.myUserId,
        onSignUp: this.props.onSignUp,
        onSettings: this.props.onSettings,
        onNewTopic: this.props.onNewTopic,
        onCancel: onCancel
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_error_panel_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        level: this.props.errorLevel,
        text: this.props.errorText,
        action: this.props.errorAction,
        actionText: this.props.errorActionText,
        onClearError: this.props.onError
      }), view === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_login_view_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        login: this.props.login,
        disabled: this.props.loginDisabled,
        onLogin: this.handleLoginRequested
      }) : view === 'register' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_create_account_view_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onCreateAccount: this.props.onCreateAccount,
        onCancel: this.props.onCancel,
        onError: this.props.onError
      }) : view === 'settings' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_settings_view_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
        transport: this.props.transport,
        serverAddress: this.props.serverAddress,
        onCancel: this.props.onCancel,
        onUpdate: this.props.onGlobalSettings
      }) : view === 'edit' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_edit_account_view_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        tinode: this.props.tinode,
        myUserId: this.props.myUserId,
        messageSounds: this.props.messageSounds,
        desktopAlerts: this.props.desktopAlerts,
        desktopAlertsEnabled: this.props.desktopAlertsEnabled,
        onUpdateAccount: this.props.onUpdateAccount,
        onUpdateTags: this.props.onUpdateAccountTags,
        onTogglePushNotifications: this.props.onTogglePushNotifications,
        onToggleMessageSounds: this.props.onToggleMessageSounds,
        onLogout: this.props.onLogout,
        onCancel: this.props.onCancel,
        onError: this.props.onError
      }) : view === 'contacts' || view == 'archive' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contacts_view_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        tinode: this.props.tinode,
        myUserId: this.props.myUserId,
        connected: this.props.connected,
        topicSelected: this.props.topicSelected,
        archive: view == 'archive',
        chatList: this.props.chatList,
        showContextMenu: this.props.showContextMenu,
        onTopicSelected: this.props.onTopicSelected,
        onShowArchive: this.props.onShowArchive
      }) : view === 'newtpk' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_new_topic_view_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        searchResults: this.props.searchResults,
        onInitFind: this.props.onInitFind,
        onSearchContacts: this.props.onSearchContacts,
        onCreateTopic: this.props.onCreateTopic,
        onError: this.props.onError
      }) : view === 'cred' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_validation_view_jsx__WEBPACK_IMPORTED_MODULE_11__["default"], {
        credCode: this.props.credCode,
        credMethod: this.props.credMethod,
        onSubmit: this.props.onValidateCredentials,
        onCancel: this.props.onCancel,
        onError: this.props.onError
      }) : view === 'reset' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_password_reset_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        onRequest: this.props.onPasswordResetRequest,
        onReset: this.props.onResetPassword
      }) : null);
    }
  }]);

  return SidepanelView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(SidepanelView));

/***/ }),

/***/ "./src/views/tinode-web.jsx":
/*!**********************************!*\
  !*** ./src/views/tinode-web.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/app */ "firebase/app");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var firebase_messaging__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/messaging */ "firebase/messaging");
/* harmony import */ var firebase_messaging__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(firebase_messaging__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../widgets/context-menu.jsx */ "./src/widgets/context-menu.jsx");
/* harmony import */ var _info_view_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./info-view.jsx */ "./src/views/info-view.jsx");
/* harmony import */ var _messages_view_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./messages-view.jsx */ "./src/views/messages-view.jsx");
/* harmony import */ var _sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sidepanel-view.jsx */ "./src/views/sidepanel-view.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_host_name_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../lib/host-name.js */ "./src/lib/host-name.js");
/* harmony import */ var _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../lib/local-storage.js */ "./src/lib/local-storage.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


















var POP_SOUND = new Audio('audio/msg.mp3');
var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["defineMessages"])({
  update_available: {
    "id": "update_available",
    "defaultMessage": "Update available. <a href=\"\">Reload</a>."
  },
  reconnect_countdown: {
    "id": "reconnect_countdown",
    "defaultMessage": "Disconnected. Reconnecting in {seconds}\u2026"
  },
  reconnect_now: {
    "id": "reconnect_now",
    "defaultMessage": "Try now"
  }
});

var TinodeWeb = function (_React$Component) {
  _inherits(TinodeWeb, _React$Component);

  function TinodeWeb(props) {
    var _this;

    _classCallCheck(this, TinodeWeb);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TinodeWeb).call(this, props));
    _this.state = _this.getBlankState();
    _this.handleResize = _this.handleResize.bind(_assertThisInitialized(_this));
    _this.handleHashRoute = _this.handleHashRoute.bind(_assertThisInitialized(_this));
    _this.handleOnline = _this.handleOnline.bind(_assertThisInitialized(_this));
    _this.checkForAppUpdate = _this.checkForAppUpdate.bind(_assertThisInitialized(_this));
    _this.handleAppVisibility = _this.handleAppVisibility.bind(_assertThisInitialized(_this));
    _this.handleReadTimer = _this.handleReadTimer.bind(_assertThisInitialized(_this));
    _this.handleVisibilityEvent = _this.handleVisibilityEvent.bind(_assertThisInitialized(_this));
    _this.handleError = _this.handleError.bind(_assertThisInitialized(_this));
    _this.handleLoginRequest = _this.handleLoginRequest.bind(_assertThisInitialized(_this));
    _this.handleConnected = _this.handleConnected.bind(_assertThisInitialized(_this));
    _this.handleAutoreconnectIteration = _this.handleAutoreconnectIteration.bind(_assertThisInitialized(_this));
    _this.doLogin = _this.doLogin.bind(_assertThisInitialized(_this));
    _this.handleCredentialsRequest = _this.handleCredentialsRequest.bind(_assertThisInitialized(_this));
    _this.handleLoginSuccessful = _this.handleLoginSuccessful.bind(_assertThisInitialized(_this));
    _this.handleDisconnect = _this.handleDisconnect.bind(_assertThisInitialized(_this));
    _this.tnMeMetaDesc = _this.tnMeMetaDesc.bind(_assertThisInitialized(_this));
    _this.tnMeContactUpdate = _this.tnMeContactUpdate.bind(_assertThisInitialized(_this));
    _this.tnMeSubsUpdated = _this.tnMeSubsUpdated.bind(_assertThisInitialized(_this));
    _this.resetContactList = _this.resetContactList.bind(_assertThisInitialized(_this));
    _this.tnData = _this.tnData.bind(_assertThisInitialized(_this));
    _this.tnInitFind = _this.tnInitFind.bind(_assertThisInitialized(_this));
    _this.tnFndSubsUpdated = _this.tnFndSubsUpdated.bind(_assertThisInitialized(_this));
    _this.handleSearchContacts = _this.handleSearchContacts.bind(_assertThisInitialized(_this));
    _this.handleTopicSelected = _this.handleTopicSelected.bind(_assertThisInitialized(_this));
    _this.handleHideMessagesView = _this.handleHideMessagesView.bind(_assertThisInitialized(_this));
    _this.handleSendMessage = _this.handleSendMessage.bind(_assertThisInitialized(_this));
    _this.handleNewChatInvitation = _this.handleNewChatInvitation.bind(_assertThisInitialized(_this));
    _this.handleNewAccount = _this.handleNewAccount.bind(_assertThisInitialized(_this));
    _this.handleNewAccountRequest = _this.handleNewAccountRequest.bind(_assertThisInitialized(_this));
    _this.handleUpdateAccountRequest = _this.handleUpdateAccountRequest.bind(_assertThisInitialized(_this));
    _this.handleUpdateAccountTagsRequest = _this.handleUpdateAccountTagsRequest.bind(_assertThisInitialized(_this));
    _this.handleSettings = _this.handleSettings.bind(_assertThisInitialized(_this));
    _this.handleGlobalSettings = _this.handleGlobalSettings.bind(_assertThisInitialized(_this));
    _this.handleShowArchive = _this.handleShowArchive.bind(_assertThisInitialized(_this));
    _this.handleToggleMessageSounds = _this.handleToggleMessageSounds.bind(_assertThisInitialized(_this));
    _this.initDesktopAlerts = _this.initDesktopAlerts.bind(_assertThisInitialized(_this));
    _this.togglePushToken = _this.togglePushToken.bind(_assertThisInitialized(_this));
    _this.requestPushToken = _this.requestPushToken.bind(_assertThisInitialized(_this));
    _this.handleSidepanelCancel = _this.handleSidepanelCancel.bind(_assertThisInitialized(_this));
    _this.handleNewTopic = _this.handleNewTopic.bind(_assertThisInitialized(_this));
    _this.handleNewTopicRequest = _this.handleNewTopicRequest.bind(_assertThisInitialized(_this));
    _this.handleNewTopicCreated = _this.handleNewTopicCreated.bind(_assertThisInitialized(_this));
    _this.handleTopicUpdateRequest = _this.handleTopicUpdateRequest.bind(_assertThisInitialized(_this));
    _this.handleChangePermissions = _this.handleChangePermissions.bind(_assertThisInitialized(_this));
    _this.handleTagsUpdated = _this.handleTagsUpdated.bind(_assertThisInitialized(_this));
    _this.handleLogout = _this.handleLogout.bind(_assertThisInitialized(_this));
    _this.handleLeaveUnsubRequest = _this.handleLeaveUnsubRequest.bind(_assertThisInitialized(_this));
    _this.handleDialogCancel = _this.handleDialogCancel.bind(_assertThisInitialized(_this));
    _this.handleShowContextMenu = _this.handleShowContextMenu.bind(_assertThisInitialized(_this));
    _this.defaultTopicContextMenu = _this.defaultTopicContextMenu.bind(_assertThisInitialized(_this));
    _this.handleHideContextMenu = _this.handleHideContextMenu.bind(_assertThisInitialized(_this));
    _this.handleShowInfoView = _this.handleShowInfoView.bind(_assertThisInitialized(_this));
    _this.handleHideInfoView = _this.handleHideInfoView.bind(_assertThisInitialized(_this));
    _this.handleMemberUpdateRequest = _this.handleMemberUpdateRequest.bind(_assertThisInitialized(_this));
    _this.handleValidateCredentialsRequest = _this.handleValidateCredentialsRequest.bind(_assertThisInitialized(_this));
    _this.handlePasswordResetRequest = _this.handlePasswordResetRequest.bind(_assertThisInitialized(_this));
    _this.handleResetPassword = _this.handleResetPassword.bind(_assertThisInitialized(_this));
    _this.handleContextMenuAction = _this.handleContextMenuAction.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TinodeWeb, [{
    key: "getBlankState",
    value: function getBlankState() {
      var _ref;

      var settings = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].getObject('settings') || {};
      return _ref = {
        connected: false,
        ready: false,
        transport: settings.transport || null,
        serverAddress: settings.serverAddress || Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_12__["detectServerAddress"])(),
        serverVersion: "no connection",
        messageSounds: !settings.messageSoundsOff,
        desktopAlerts: settings.desktopAlerts,
        desktopAlertsEnabled: (Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_12__["isSecureConnection"])() || Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_12__["isLocalHost"])()) && typeof firebase_app__WEBPACK_IMPORTED_MODULE_3__ != 'undefined' && typeof navigator != 'undefined' && typeof FIREBASE_INIT != 'undefined',
        firebaseToken: _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].getObject('firebase-token'),
        errorText: '',
        errorLevel: null,
        errorAction: undefined,
        errorActionText: null,
        sidePanelSelected: 'login',
        sidePanelTitle: null,
        sidePanelAvatar: null,
        dialogSelected: null,
        contextMenuVisible: false,
        login: '',
        password: '',
        myUserId: null,
        liveConnection: navigator.onLine,
        topicSelected: '',
        topicSelectedOnline: false,
        topicSelectedAcs: null,
        newTopicParams: null,
        loginDisabled: false,
        displayMobile: window.innerWidth <= _config_js__WEBPACK_IMPORTED_MODULE_10__["MEDIA_BREAKPOINT"],
        showInfoPanel: false,
        mobilePanel: 'sidepanel'
      }, _defineProperty(_ref, "contextMenuVisible", false), _defineProperty(_ref, "contextMenuBounds", null), _defineProperty(_ref, "contextMenuClickAt", null), _defineProperty(_ref, "contextMenuParams", null), _defineProperty(_ref, "contextMenuItems", []), _defineProperty(_ref, "chatList", []), _defineProperty(_ref, "searchResults", []), _defineProperty(_ref, "searchableContacts", []), _defineProperty(_ref, "credMethod", undefined), _defineProperty(_ref, "credCode", undefined), _ref;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.addEventListener('resize', this.handleResize);
      window.addEventListener('online', function (e) {
        _this2.handleOnline(true);
      });
      window.addEventListener('offline', function (e) {
        _this2.handleOnline(false);
      });
      window.addEventListener('hashchange', this.handleHashRoute);
      document.addEventListener('visibilitychange', this.handleVisibilityEvent);
      this.setState({
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight
      });
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      this.tinode.onAutoreconnectIteration = this.handleAutoreconnectIteration;

      if (this.state.desktopAlertsEnabled) {
        try {
          this.fbPush = firebase_app__WEBPACK_IMPORTED_MODULE_3__["initializeApp"](FIREBASE_INIT, _config_js__WEBPACK_IMPORTED_MODULE_10__["APP_NAME"]).messaging();
          this.fbPush.usePublicVapidKey(FIREBASE_INIT.messagingVapidKey);
          navigator.serviceWorker.register('/service-worker.js').then(function (reg) {
            _this2.checkForAppUpdate(reg);

            _this2.fbPush.useServiceWorker(reg);

            _this2.initDesktopAlerts();

            if (_this2.state.desktopAlerts) {
              if (!_this2.state.firebaseToken) {
                _this2.togglePushToken(true);
              } else {
                _this2.tinode.setDeviceToken(_this2.state.firebaseToken, true);
              }
            }
          }).catch(function (err) {
            console.log("Failed to register service worker:", err);
          });
        } catch (err) {
          this.handleError("Failed to initialize push notifications", 'err');
          console.log("Failed to initialize push notifications", err);
          this.setState({
            desktopAlertsEnabled: false
          });
        }
      }

      var token = _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].getObject('keep-logged-in') ? _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].getObject('auth-token') : undefined;
      var parsedNav = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].parseUrlHash(window.location.hash);

      if (token) {
        token.expires = new Date(token.expires);
        this.tinode.setAuthToken(token);
        this.tinode.connect().catch(function (err) {
          _this2.handleError(err.message, 'err');
        });
        delete parsedNav.params.info;
        delete parsedNav.params.tab;
        parsedNav.path[0] = '';
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].composeUrlHash(parsedNav.path, parsedNav.params));
      } else if (!parsedNav.params.token) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo('');
      }

      this.readTimer = null;
      this.readTimerCallback = null;
      this.handleHashRoute();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('hashchange', this.handleHashRoute);
      document.removeEventListener('visibilitychange', this.handleVisibilityEvent);
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      var mobile = document.documentElement.clientWidth <= _config_js__WEBPACK_IMPORTED_MODULE_10__["MEDIA_BREAKPOINT"];
      this.setState({
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight
      });

      if (this.state.displayMobile != mobile) {
        this.setState({
          displayMobile: mobile
        });
      }
    }
  }, {
    key: "checkForAppUpdate",
    value: function checkForAppUpdate(reg) {
      var _this3 = this;

      var formatHTMLMessage = this.props.intl.formatHTMLMessage;

      reg.onupdatefound = function () {
        var installingWorker = reg.installing;

        installingWorker.onstatechange = function () {
          if (installingWorker.state == 'installed' && navigator.serviceWorker.controller) {
            _this3.handleError(formatHTMLMessage(messages.update_available), 'info');
          }
        };
      };
    }
  }, {
    key: "handleHashRoute",
    value: function handleHashRoute() {
      var hash = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].parseUrlHash(window.location.hash);

      if (hash.path && hash.path.length > 0) {
        if (['register', 'settings', 'edit', 'cred', 'reset', 'newtpk', 'archive', 'contacts', ''].includes(hash.path[0])) {
          this.setState({
            sidePanelSelected: hash.path[0]
          });
        } else {
          console.log("Unknown sidepanel view", hash.path[0]);
        }

        if (hash.path.length > 1 && hash.path[1] != this.state.topicSelected) {
          this.setState({
            topicSelected: tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.topicType(hash.path[1]) ? hash.path[1] : null
          });
        }
      } else {
        this.setState({
          sidePanelSelected: ''
        });
      }

      if (hash.params.method) {
        this.setState({
          credMethod: hash.params.method
        });
      }

      if (hash.params.code) {
        this.setState({
          credCode: hash.params.code
        });
      }

      this.setState({
        showInfoPanel: hash.params.info,
        newTopicTabSelected: hash.params.tab
      });
    }
  }, {
    key: "handleOnline",
    value: function handleOnline(online) {
      var newState = {
        liveConnection: online
      };

      if (online) {
        this.handleError('', null);
      } else {
        this.handleError("No connection", 'warn');
      }

      this.setState({
        liveConnection: online
      });
    }
  }, {
    key: "handleAppVisibility",
    value: function handleAppVisibility(visible, callback) {
      clearTimeout(this.readTimer);
      this.readTimerCallback = callback;

      if (visible && callback) {
        this.readTimer = setTimeout(callback, _config_js__WEBPACK_IMPORTED_MODULE_10__["READ_DELAY"]);
      } else {
        this.readTimer = null;
      }
    }
  }, {
    key: "handleReadTimer",
    value: function handleReadTimer(callback) {
      this.handleAppVisibility(!document.hidden, callback);
    }
  }, {
    key: "handleVisibilityEvent",
    value: function handleVisibilityEvent() {
      this.handleAppVisibility(!document.hidden, this.readTimerCallback);
    }
  }, {
    key: "handleError",
    value: function handleError(err, level, action, actionText) {
      this.setState({
        errorText: err,
        errorLevel: level,
        errorAction: action,
        errorActionText: actionText
      });
    }
  }, {
    key: "handleLoginRequest",
    value: function handleLoginRequest(login, password) {
      var _this4 = this;

      this.setState({
        loginDisabled: true,
        login: login,
        password: password
      });
      this.handleError('', null);

      if (this.tinode.isConnected()) {
        this.doLogin(login, password, {
          meth: this.state.credMethod,
          resp: this.state.credCode
        });
      } else {
        this.tinode.connect().catch(function (err) {
          _this4.setState({
            loginDisabled: false
          });

          _this4.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleConnected",
    value: function handleConnected() {
      var params = this.tinode.getServerInfo();
      this.setState({
        serverVersion: params.ver + ' ' + (params.build ? params.build : 'none') + '; '
      });
      this.doLogin(this.state.login, this.state.password, {
        meth: this.state.credMethod,
        resp: this.state.credCode
      });
    }
  }, {
    key: "handleAutoreconnectIteration",
    value: function handleAutoreconnectIteration(sec, prom) {
      var _this5 = this;

      clearInterval(this.reconnectCountdown);

      if (sec < 0) {
        this.handleError();
        return;
      }

      if (prom) {
        prom.then(function () {
          _this5.handleError();
        }).catch(function (err) {
          _this5.handleError(err.message, 'err');
        });
        return;
      }

      var formatHTMLMessage = this.props.intl.formatHTMLMessage;
      var count = sec / 1000;
      count = count | count;
      this.reconnectCountdown = setInterval(function () {
        var timeLeft = count > 99 ? Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_15__["secondsToTime"])(count) : count;

        _this5.handleError(formatHTMLMessage(messages.reconnect_countdown, {
          seconds: timeLeft
        }), 'warn', function () {
          clearInterval(_this5.reconnectCountdown);

          _this5.tinode.reconnect();
        }, formatHTMLMessage(messages.reconnect_now));

        count -= 1;
      }, 1000);
    }
  }, {
    key: "handleDisconnect",
    value: function handleDisconnect(err) {
      this.setState({
        connected: false,
        ready: false,
        topicSelectedOnline: false,
        dialogSelected: null,
        errorText: err && err.message ? err.message : "Disconnected",
        errorLevel: err && err.message ? 'err' : 'warn',
        loginDisabled: false,
        contextMenuVisible: false,
        serverVersion: "no connection"
      });
    }
  }, {
    key: "doLogin",
    value: function doLogin(login, password, cred) {
      var _this6 = this;

      if (this.tinode.isAuthenticated()) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo('');
        return;
      }

      cred = tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.credential(cred);
      var promise = null;
      var token = this.tinode.getAuthToken();

      if (login && password) {
        this.setState({
          password: null
        });
        promise = this.tinode.loginBasic(login, password, cred);
      } else if (token) {
        promise = this.tinode.loginToken(token.token, cred);
      }

      if (promise) {
        promise.then(function (ctrl) {
          if (ctrl.code >= 300 && ctrl.text === 'validate credentials') {
            if (cred) {
              _this6.handleError("Code does not match", 'warn');
            }

            _this6.handleCredentialsRequest(ctrl.params);
          } else {
            _this6.handleLoginSuccessful();
          }
        }).catch(function (err) {
          _this6.setState({
            loginDisabled: false,
            credMethod: undefined,
            credCode: undefined
          });

          _this6.handleError(err.message, 'err');

          localStorage.removeItem('auth-token');
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo('');
        });
      } else {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo('');
        this.setState({
          loginDisabled: false
        });
      }
    }
  }, {
    key: "handleCredentialsRequest",
    value: function handleCredentialsRequest(params) {
      var parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].parseUrlHash(window.location.hash);
      parsed.path[0] = 'cred';
      parsed.params['method'] = params.cred[0];
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].composeUrlHash(parsed.path, parsed.params));
    }
  }, {
    key: "handleLoginSuccessful",
    value: function handleLoginSuccessful() {
      var _this7 = this;

      this.handleError('', null);

      if (_lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].getObject('keep-logged-in')) {
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].setObject('auth-token', this.tinode.getAuthToken());
      }

      var me = this.tinode.getMeTopic();
      me.onMetaDesc = this.tnMeMetaDesc;
      me.onContactUpdate = this.tnMeContactUpdate;
      me.onSubsUpdated = this.tnMeSubsUpdated;
      this.setState({
        connected: true,
        credMethod: undefined,
        credCode: undefined,
        myUserId: this.tinode.getCurrentUserID()
      });
      me.subscribe(me.startMetaQuery().withLaterSub().withDesc().build()).catch(function (err) {
        localStorage.removeItem('auth-token');

        _this7.handleError(err.message, 'err');

        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo('');
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlSidePanel(window.location.hash, 'contacts'));
    }
  }, {
    key: "tnMeMetaDesc",
    value: function tnMeMetaDesc(desc) {
      if (desc && desc.public) {
        this.setState({
          sidePanelTitle: desc.public.fn,
          sidePanelAvatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__["makeImageUrl"])(desc.public.photo)
        });
      }
    }
  }, {
    key: "tnMeContactUpdate",
    value: function tnMeContactUpdate(what, cont) {
      if (what == 'on' || what == 'off') {
        this.resetContactList();

        if (this.state.topicSelected == cont.topic) {
          this.setState({
            topicSelectedOnline: what == 'on'
          });
        }
      } else if (what == 'read') {
        this.resetContactList();
      } else if (what == 'msg') {
        if (this.state.topicSelected != cont.topic) {
          if (this.state.messageSounds) {
            POP_SOUND.play();
          }

          this.resetContactList();
        } else if (document.hidden && this.state.messageSounds) {
          POP_SOUND.play();
        }
      } else if (what == 'recv') {} else if (what == 'gone' || what == 'unsub') {
        if (this.state.topicSelected == cont.topic) {
          this.handleTopicSelected(null);
        }

        this.resetContactList();
      } else if (what == 'acs') {
        if (this.state.topicSelected == cont.topic) {
          this.setState({
            topicSelectedAcs: cont.acs
          });
        }
      } else if (what == 'del') {} else {
        console.log("Unsupported (yet) presence update:" + what + " in: " + cont.topic);
      }
    }
  }, {
    key: "tnMeSubsUpdated",
    value: function tnMeSubsUpdated(unused) {
      this.resetContactList();
    }
  }, {
    key: "resetContactList",
    value: function resetContactList() {
      var _this8 = this;

      var newState = {
        chatList: []
      };

      if (!this.state.ready) {
        newState.ready = true;
      }

      this.tinode.getMeTopic().contacts(function (c) {
        newState.chatList.push(c);

        if (_this8.state.topicSelected == c.topic) {
          newState.topicSelectedOnline = c.online;
          newState.topicSelectedAcs = c.acs;
        }
      });
      newState.searchableContacts = TinodeWeb.prepareSearchableContacts(newState.chatList, this.state.searchResults);
      this.setState(newState);
    }
  }, {
    key: "tnData",
    value: function tnData(data) {
      var _this9 = this;

      var topic = this.tinode.getTopic(data.topic);

      if (topic.msgStatus(data) >= tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.MESSAGE_STATUS_SENT && data.from != this.state.myUserId) {
        clearTimeout(this.receivedTimer);
        this.receivedTimer = setTimeout(function () {
          _this9.receivedTimer = undefined;
          topic.noteRecv(data.seq);
        }, _config_js__WEBPACK_IMPORTED_MODULE_10__["RECEIVED_DELAY"]);
      }
    }
  }, {
    key: "tnInitFind",
    value: function tnInitFind() {
      var _this10 = this;

      var fnd = this.tinode.getFndTopic();
      fnd.onSubsUpdated = this.tnFndSubsUpdated;

      if (fnd.isSubscribed()) {
        this.tnFndSubsUpdated();
      } else {
        fnd.subscribe(fnd.startMetaQuery().withSub().withTags().build()).catch(function (err) {
          _this10.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "tnFndSubsUpdated",
    value: function tnFndSubsUpdated() {
      var foundContacts = [];
      this.tinode.getFndTopic().contacts(function (s) {
        foundContacts.push(s);
      });
      this.setState({
        searchResults: foundContacts,
        searchableContacts: TinodeWeb.prepareSearchableContacts(this.state.chatList, foundContacts)
      });
    }
  }, {
    key: "handleSearchContacts",
    value: function handleSearchContacts(query) {
      var _this11 = this;

      var fnd = this.tinode.getFndTopic();
      fnd.setMeta({
        desc: {
          public: query
        }
      }).then(function (ctrl) {
        return fnd.getMeta(fnd.startMetaQuery().withSub().build());
      }).catch(function (err) {
        _this11.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleTopicSelected",
    value: function handleTopicSelected(topicName, unused_index, online, acs) {
      if (this.state.newTopicParams && this.state.newTopicParams._topicName != topicName) {
        this.setState({
          newTopicParams: null
        });
      }

      if (topicName) {
        this.setState({
          errorText: '',
          errorLevel: null,
          mobilePanel: 'topic-view',
          showInfoPanel: false
        });

        if (this.state.topicSelected != topicName) {
          this.setState({
            topicSelectedOnline: online,
            topicSelectedAcs: acs
          });
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlTopic('', topicName));
        }
      } else {
        this.setState({
          errorText: '',
          errorLevel: null,
          mobilePanel: 'sidepanel',
          topicSelectedOnline: false,
          topicSelectedAcs: null,
          showInfoPanel: false
        });
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlTopic('', null));
      }
    }
  }, {
    key: "handleHideMessagesView",
    value: function handleHideMessagesView() {
      this.setState({
        mobilePanel: 'sidepanel'
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlTopic(window.location.hash, null));
    }
  }, {
    key: "handleSendMessage",
    value: function handleSendMessage(msg, promise, uploader) {
      var _this12 = this;

      var topic = this.tinode.getTopic(this.state.topicSelected);
      msg = topic.createMessage(msg, false);
      msg._uploader = uploader;

      if (!topic.isSubscribed()) {
        if (!promise) {
          promise = Promise.resolve();
        }

        promise = promise.then(function () {
          return topic.subscribe();
        });
      }

      if (promise) {
        promise = promise.catch(function (err) {
          _this12.handleError(err.message, 'err');
        });
      }

      topic.publishDraft(msg, promise).then(function (ctrl) {
        if (topic.isArchived()) {
          return topic.archive(false);
        }
      }).catch(function (err) {
        _this12.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleNewChatInvitation",
    value: function handleNewChatInvitation(topicName, action) {
      var _this13 = this;

      var topic = this.tinode.getTopic(topicName);
      var response = null;

      switch (action) {
        case 'accept':
          var mode = topic.getAccessMode().getGiven();
          response = topic.setMeta({
            sub: {
              mode: mode
            }
          });

          if (topic.getType() == 'p2p') {
            response = response.then(function (ctrl) {
              topic.setMeta({
                sub: {
                  user: topicName,
                  mode: mode
                }
              });
            });
          }

          break;

        case 'delete':
          response = topic.delTopic();
          break;

        case 'block':
          var am = topic.getAccessMode().updateWant('-JP').getWant();
          response = topic.setMeta({
            sub: {
              mode: am
            }
          }).then(function (ctrl) {
            return _this13.handleTopicSelected(null);
          });
          break;

        default:
          console.log("Unknown invitation action", '"' + action + '""');
      }

      if (response != null) {
        response.catch(function (err) {
          _this13.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleNewAccount",
    value: function handleNewAccount() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlSidePanel(window.location.hash, 'register'));
    }
  }, {
    key: "handleNewAccountRequest",
    value: function handleNewAccountRequest(login_, password_, public_, cred_, tags_) {
      var _this14 = this;

      this.tinode.connect(this.state.serverAddress).then(function () {
        return _this14.tinode.createAccountBasic(login_, password_, {
          public: public_,
          tags: tags_,
          cred: tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.credential(cred_)
        });
      }).then(function (ctrl) {
        if (ctrl.code >= 300 && ctrl.text == 'validate credentials') {
          _this14.handleCredentialsRequest(ctrl.params);
        } else {
          _this14.handleLoginSuccessful(_this14);
        }
      }).catch(function (err) {
        _this14.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleUpdateAccountRequest",
    value: function handleUpdateAccountRequest(password, pub, defacs) {
      var _this15 = this;

      if (pub || defacs) {
        var params = {};

        if (pub) {
          params.public = pub;
        }

        if (defacs) {
          params.defacs = defacs;
        }

        this.tinode.getMeTopic().setMeta({
          desc: params
        }).catch(function (err) {
          _this15.handleError(err.message, 'err');
        });
      }

      if (password) {
        this.tinode.updateAccountBasic(null, this.tinode.getCurrentLogin(), password).catch(function (err) {
          _this15.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleUpdateAccountTagsRequest",
    value: function handleUpdateAccountTagsRequest(tags) {
      var _this16 = this;

      this.tinode.getFndTopic().setMeta({
        tags: tags
      }).catch(function (err) {
        _this16.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleSettings",
    value: function handleSettings() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'edit' : 'settings'));
    }
  }, {
    key: "handleGlobalSettings",
    value: function handleGlobalSettings(settings) {
      var serverAddress = settings.serverAddress || this.state.serverAddress;
      var transport = settings.transport || this.state.transport;

      if (this.tinode) {
        this.tinode.onDisconnect = undefined;
        this.tinode.disconnect();
      }

      this.tinode = TinodeWeb.tnSetup(serverAddress, transport);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      this.setState({
        serverAddress: serverAddress,
        transport: transport
      });
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].setObject('settings', {
        serverAddress: serverAddress,
        transport: transport
      });
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlSidePanel(window.location.hash, ''));
    }
  }, {
    key: "handleShowArchive",
    value: function handleShowArchive() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlSidePanel(window.location.hash, this.state.myUserId ? 'archive' : ''));
    }
  }, {
    key: "initDesktopAlerts",
    value: function initDesktopAlerts() {
      var _this17 = this;

      this.fbPush.onTokenRefresh(function () {
        _this17.requestPushToken();
      });
      this.fbPush.onMessage(function (payload) {});
    }
  }, {
    key: "togglePushToken",
    value: function togglePushToken(enabled) {
      var _this18 = this;

      if (enabled) {
        if (!this.state.firebaseToken) {
          this.fbPush.requestPermission().then(function () {
            _this18.requestPushToken();
          }).catch(function (err) {
            _this18.handleError(err.message, 'err');

            _this18.setState({
              desktopAlerts: false,
              firebaseToken: null
            });

            _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].updateObject('settings', {
              desktopAlerts: false
            });
            console.log("Failed to get permission to notify.", err);
          });
        } else {
          this.setState({
            desktopAlerts: true
          });
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].updateObject('settings', {
            desktopAlerts: true
          });
        }
      } else if (this.state.firebaseToken) {
        this.fbPush.deleteToken(this.state.firebaseToken).catch(function (err) {
          console.log("Unable to delete token.", err);
        }).finally(function () {
          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].updateObject('settings', {
            desktopAlerts: false
          });
          localStorage.removeItem('firebase-token');

          _this18.setState({
            desktopAlerts: false,
            firebaseToken: null
          });
        });
      } else {
        this.setState({
          desktopAlerts: false,
          firebaseToken: null
        });
        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].updateObject('settings', {
          desktopAlerts: false
        });
      }
    }
  }, {
    key: "requestPushToken",
    value: function requestPushToken() {
      var _this19 = this;

      this.fbPush.getToken().then(function (refreshedToken) {
        if (refreshedToken != _this19.state.firebaseToken) {
          _this19.tinode.setDeviceToken(refreshedToken, true);

          _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].setObject('firebase-token', refreshedToken);
        }

        _this19.setState({
          firebaseToken: refreshedToken,
          desktopAlerts: true
        });

        _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].updateObject('settings', {
          desktopAlerts: true
        });
      }).catch(function (err) {
        _this19.handleError(err.message, 'err');

        console.log("Failed to retrieve firebase token", err);
      });
    }
  }, {
    key: "handleToggleMessageSounds",
    value: function handleToggleMessageSounds(enabled) {
      this.setState({
        messageSounds: enabled
      });
      _lib_local_storage_js__WEBPACK_IMPORTED_MODULE_13__["default"].updateObject('settings', {
        messageSoundsOff: !enabled
      });
    }
  }, {
    key: "handleSidepanelCancel",
    value: function handleSidepanelCancel() {
      var parsed = _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].parseUrlHash(window.location.hash);
      parsed.path[0] = this.state.myUserId ? 'contacts' : '';

      if (parsed.params) {
        delete parsed.params.code;
        delete parsed.params.method;
        delete parsed.params.tab;
      }

      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].composeUrlHash(parsed.path, parsed.params));
      this.setState({
        errorText: '',
        errorLevel: null
      });
    }
  }, {
    key: "handleNewTopic",
    value: function handleNewTopic() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlSidePanel(window.location.hash, 'newtpk'));
    }
  }, {
    key: "handleNewTopicRequest",
    value: function handleNewTopicRequest(peerName, pub, priv, tags) {
      var _this20 = this;

      var topicName = peerName || this.tinode.newGroupTopicName();
      var params = {
        _topicName: topicName
      };

      if (peerName) {
        params.sub = {
          mode: _config_js__WEBPACK_IMPORTED_MODULE_10__["DEFAULT_ACCESS_MODE"]
        };
        params.desc = {
          defacs: {
            auth: _config_js__WEBPACK_IMPORTED_MODULE_10__["DEFAULT_ACCESS_MODE"]
          }
        };
      } else {
        params.desc = {
          public: pub,
          private: {
            comment: priv
          }
        };
        params.tags = tags;
      }

      this.setState({
        newTopicParams: params
      }, function () {
        _this20.handleTopicSelected(topicName);
      });
    }
  }, {
    key: "handleNewTopicCreated",
    value: function handleNewTopicCreated(oldName, newName) {
      if (this.state.topicSelected == oldName && oldName != newName) {
        this.setState({
          topicSelected: newName
        }, function () {
          _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlTopic('', newName));
        });
      }
    }
  }, {
    key: "handleTopicUpdateRequest",
    value: function handleTopicUpdateRequest(topicName, pub, priv, permissions) {
      var _this21 = this;

      var topic = this.tinode.getTopic(topicName);

      if (topic) {
        var params = {};

        if (pub) {
          params.public = pub;
        }

        if (priv) {
          params.private = priv === tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.DEL_CHAR ? tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.DEL_CHAR : {
            comment: priv
          };
        }

        if (permissions) {
          params.defacs = permissions;
        }

        topic.setMeta({
          desc: params
        }).catch(function (err) {
          _this21.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleChangePermissions",
    value: function handleChangePermissions(topicName, mode, uid) {
      var _this22 = this;

      var topic = this.tinode.getTopic(topicName);

      if (topic) {
        var am = topic.getAccessMode();

        if (uid) {
          am.updateGiven(mode);
          mode = am.getGiven();
        } else {
          am.updateWant(mode);
          mode = am.getWant();
        }

        topic.setMeta({
          sub: {
            user: uid,
            mode: mode
          }
        }).catch(function (err) {
          _this22.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleTagsUpdated",
    value: function handleTagsUpdated(topicName, tags) {
      var _this23 = this;

      var topic = this.tinode.getTopic(topicName);

      if (topic) {
        topic.setMeta({
          tags: tags
        }).catch(function (err) {
          _this23.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "handleLogout",
    value: function handleLogout() {
      Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_16__["updateFavicon"])(0);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('firebase-token');
      localStorage.removeItem('settings');

      if (this.state.firebaseToken) {
        this.fbPush.deleteToken(this.state.firebaseToken);
      }

      if (this.tinode) {
        this.tinode.onDisconnect = undefined;
        this.tinode.disconnect();
      }

      this.setState(this.getBlankState());
      this.tinode = TinodeWeb.tnSetup(this.state.serverAddress, this.state.transport);
      this.tinode.onConnect = this.handleConnected;
      this.tinode.onDisconnect = this.handleDisconnect;
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo('');
    }
  }, {
    key: "handleLeaveUnsubRequest",
    value: function handleLeaveUnsubRequest(topicName) {
      var _this24 = this;

      var topic = this.tinode.getTopic(topicName);

      if (!topic) {
        return;
      }

      topic.leave(true).then(function (ctrl) {
        _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].setUrlTopic(window.location.hash, ''));
      }).catch(function (err) {
        _this24.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleDialogCancel",
    value: function handleDialogCancel() {
      this.setState({
        dialogSelected: null
      });
    }
  }, {
    key: "handleShowContextMenu",
    value: function handleShowContextMenu(params, menuItems) {
      this.setState({
        contextMenuVisible: true,
        contextMenuClickAt: {
          x: params.x,
          y: params.y
        },
        contextMenuParams: params,
        contextMenuItems: menuItems || this.defaultTopicContextMenu(params.topicName),
        contextMenuBounds: react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this).getBoundingClientRect()
      });
    }
  }, {
    key: "defaultTopicContextMenu",
    value: function defaultTopicContextMenu(topicName) {
      var topic = this.tinode.getTopic(topicName);
      var formatMessage = this.props.intl.formatMessage;
      var muted = false,
          blocked = false,
          self_blocked = false,
          subscribed = false,
          deleter = false,
          archived = false;

      if (topic) {
        subscribed = topic.isSubscribed();
        archived = topic.isArchived();
        var acs = topic.getAccessMode();

        if (acs) {
          muted = acs.isMuted();
          blocked = !acs.isJoiner();
          self_blocked = !acs.isJoiner('want');
          deleter = acs.isDeleter();
        }
      }

      return [subscribed ? {
        title: formatMessage({
          id: 'menu_item_info'
        }),
        handler: this.handleShowInfoView
      } : null, subscribed ? 'messages_clear' : null, subscribed && deleter ? 'messages_clear_hard' : null, muted ? blocked ? null : 'topic_unmute' : 'topic_mute', self_blocked ? 'topic_unblock' : 'topic_block', !archived ? 'topic_archive' : null, 'topic_delete'];
    }
  }, {
    key: "handleHideContextMenu",
    value: function handleHideContextMenu() {
      this.setState({
        contextMenuVisible: false,
        contextMenuClickAt: null,
        contextMenuParams: null,
        contextMenuBounds: null
      });
    }
  }, {
    key: "handleContextMenuAction",
    value: function handleContextMenuAction(action, promise, params) {
      var _this25 = this;

      if (action == 'topic_archive') {
        if (promise && params.topicName && params.topicName == this.state.topicSelected) {
          promise.then(function () {
            _this25.handleTopicSelected(null);
          });
        }
      }
    }
  }, {
    key: "handleShowInfoView",
    value: function handleShowInfoView() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].addUrlParam(window.location.hash, 'info', true));
      this.setState({
        showInfoPanel: true
      });
    }
  }, {
    key: "handleHideInfoView",
    value: function handleHideInfoView() {
      _lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].navigateTo(_lib_navigation_js__WEBPACK_IMPORTED_MODULE_14__["default"].removeUrlParam(window.location.hash, 'info'));
      this.setState({
        showInfoPanel: false
      });
    }
  }, {
    key: "handleMemberUpdateRequest",
    value: function handleMemberUpdateRequest(topicName, added, removed) {
      var _this26 = this;

      if (!topicName) {
        return;
      }

      var topic = this.tinode.getTopic(topicName);

      if (!topic) {
        return;
      }

      if (added && added.length > 0) {
        added.map(function (uid) {
          topic.invite(uid, null).catch(function (err) {
            _this26.handleError(err.message, 'err');
          });
        });
      }

      if (removed && removed.length > 0) {
        removed.map(function (uid) {
          topic.delSubscription(uid).catch(function (err) {
            _this26.handleError(err.message, 'err');
          });
        });
      }
    }
  }, {
    key: "handleValidateCredentialsRequest",
    value: function handleValidateCredentialsRequest(cred, code) {
      this.setState({
        credMethod: cred,
        credCode: code
      });
      this.doLogin(null, null, {
        meth: cred,
        resp: code
      });
    }
  }, {
    key: "handlePasswordResetRequest",
    value: function handlePasswordResetRequest(method, value) {
      var _this27 = this;

      this.tinode.connect().then(function () {
        return _this27.tinode.requestResetAuthSecret('basic', method, value);
      }).catch(function (err) {
        _this27.handleError(err.message, 'err');
      });
    }
  }, {
    key: "handleResetPassword",
    value: function handleResetPassword(scheme, newPassword, token) {
      var _this28 = this;

      token = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_11__["base64ReEncode"])(token);

      if (!token) {
        this.handleError("Invalid security token", 'err');
      } else {
        this.tinode.connect().then(function () {
          return _this28.tinode.updateAccountBasic(null, null, newPassword, {
            token: token
          });
        }).catch(function (err) {
          _this28.handleError(err.message, 'err');
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this29 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "app-container"
      }, this.state.contextMenuVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_widgets_context_menu_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
        tinode: this.tinode,
        bounds: this.state.contextMenuBounds,
        clickAt: this.state.contextMenuClickAt,
        params: this.state.contextMenuParams,
        items: this.state.contextMenuItems,
        hide: this.handleHideContextMenu,
        onAction: this.handleContextMenuAction,
        onTopicRemoved: function onTopicRemoved(topicName) {
          if (topicName == _this29.state.topicSelected) {
            _this29.handleTopicSelected(null);
          }
        },
        onError: this.handleError
      }) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_sidepanel_view_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        tinode: this.tinode,
        connected: this.state.connected,
        displayMobile: this.state.displayMobile,
        hideSelf: this.state.displayMobile && this.state.mobilePanel !== 'sidepanel',
        state: this.state.sidePanelSelected,
        title: this.state.sidePanelTitle,
        avatar: this.state.sidePanelAvatar,
        login: this.state.login,
        myUserId: this.state.myUserId,
        loginDisabled: this.state.loginDisabled,
        errorText: this.state.errorText,
        errorLevel: this.state.errorLevel,
        errorAction: this.state.errorAction,
        errorActionText: this.state.errorActionText,
        topicSelected: this.state.topicSelected,
        chatList: this.state.chatList,
        credMethod: this.state.credMethod,
        credCode: this.state.credCode,
        transport: this.state.transport,
        messageSounds: this.state.messageSounds,
        desktopAlerts: this.state.desktopAlerts,
        desktopAlertsEnabled: this.state.desktopAlertsEnabled,
        serverAddress: this.state.serverAddress,
        onGlobalSettings: this.handleGlobalSettings,
        onSignUp: this.handleNewAccount,
        onSettings: this.handleSettings,
        onLoginRequest: this.handleLoginRequest,
        onCreateAccount: this.handleNewAccountRequest,
        onUpdateAccount: this.handleUpdateAccountRequest,
        onUpdateAccountTags: this.handleUpdateAccountTagsRequest,
        onTogglePushNotifications: this.togglePushToken,
        onToggleMessageSounds: this.handleToggleMessageSounds,
        onTopicSelected: this.handleTopicSelected,
        onCreateTopic: this.handleNewTopicRequest,
        onNewTopic: this.handleNewTopic,
        onLogout: this.handleLogout,
        onCancel: this.handleSidepanelCancel,
        onError: this.handleError,
        onValidateCredentials: this.handleValidateCredentialsRequest,
        onPasswordResetRequest: this.handlePasswordResetRequest,
        onResetPassword: this.handleResetPassword,
        onShowArchive: this.handleShowArchive,
        onInitFind: this.tnInitFind,
        searchResults: this.state.searchResults,
        onSearchContacts: this.handleSearchContacts,
        showContextMenu: this.handleShowContextMenu
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_messages_view_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], {
        tinode: this.tinode,
        connected: this.state.connected,
        ready: this.state.ready,
        online: this.state.topicSelectedOnline,
        acs: this.state.topicSelectedAcs,
        displayMobile: this.state.displayMobile,
        viewportWidth: this.state.viewportWidth,
        viewportHeight: this.state.viewportHeight,
        hideSelf: this.state.displayMobile && (this.state.mobilePanel !== 'topic-view' || this.state.showInfoPanel),
        topic: this.state.topicSelected,
        myUserId: this.state.myUserId,
        serverVersion: this.state.serverVersion,
        serverAddress: this.state.serverAddress,
        errorText: this.state.errorText,
        errorLevel: this.state.errorLevel,
        errorAction: this.state.errorAction,
        errorActionText: this.state.errorActionText,
        newTopicParams: this.state.newTopicParams,
        onHideMessagesView: this.handleHideMessagesView,
        onData: this.tnData,
        onError: this.handleError,
        onNewTopicCreated: this.handleNewTopicCreated,
        readTimerHandler: this.handleReadTimer,
        showContextMenu: this.handleShowContextMenu,
        onChangePermissions: this.handleChangePermissions,
        onNewChat: this.handleNewChatInvitation,
        sendMessage: this.handleSendMessage
      }), this.state.showInfoPanel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_info_view_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
        tinode: this.tinode,
        connected: this.state.connected,
        displayMobile: this.state.displayMobile,
        topic: this.state.topicSelected,
        searchableContacts: this.state.searchableContacts,
        myUserId: this.state.myUserId,
        errorText: this.state.errorText,
        errorLevel: this.state.errorLevel,
        errorAction: this.state.errorAction,
        errorActionText: this.state.errorActionText,
        onTopicDescUpdate: this.handleTopicUpdateRequest,
        onCancel: this.handleHideInfoView,
        onChangePermissions: this.handleChangePermissions,
        onMemberUpdateRequest: this.handleMemberUpdateRequest,
        onLeaveTopic: this.handleLeaveUnsubRequest,
        onAddMember: this.handleManageGroupMembers,
        onTopicTagsUpdate: this.handleTagsUpdated,
        onInitFind: this.tnInitFind,
        onError: this.handleError,
        showContextMenu: this.handleShowContextMenu
      }) : null);
    }
  }], [{
    key: "tnSetup",
    value: function tnSetup(serverAddress, transport) {
      var tinode = new tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a(_config_js__WEBPACK_IMPORTED_MODULE_10__["APP_NAME"], serverAddress, _config_js__WEBPACK_IMPORTED_MODULE_10__["API_KEY"], transport, Object(_lib_host_name_js__WEBPACK_IMPORTED_MODULE_12__["isSecureConnection"])());
      tinode.enableLogging(true, true);
      return tinode;
    }
  }, {
    key: "prepareSearchableContacts",
    value: function prepareSearchableContacts(chatList, foundContacts) {
      var merged = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = chatList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;

          if (tinode_sdk__WEBPACK_IMPORTED_MODULE_5___default.a.topicType(c.topic) == 'p2p') {
            merged[c.topic] = {
              user: c.topic,
              updated: c.updated,
              public: c.public,
              private: c.private,
              acs: c.acs
            };
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = foundContacts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _c = _step2.value;

          if (!merged[_c.user]) {
            merged[_c.user] = _c;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return Object.values(merged);
    }
  }]);

  return TinodeWeb;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["injectIntl"])(TinodeWeb));

/***/ }),

/***/ "./src/views/validation-view.jsx":
/*!***************************************!*\
  !*** ./src/views/validation-view.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  phone: {
    "id": "phone_dative",
    "defaultMessage": "phone"
  },
  email: {
    "id": "email_dative",
    "defaultMessage": "email"
  }
});

var ValidationView = function (_React$PureComponent) {
  _inherits(ValidationView, _React$PureComponent);

  function ValidationView(props) {
    var _this;

    _classCallCheck(this, ValidationView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ValidationView).call(this, props));
    _this.state = {
      code: props.credCode || ''
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ValidationView, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.setState({
        code: e.target.value
      });
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.handleSubmit(e);
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();

      if (this.state.code && this.state.code.trim()) {
        this.props.onSubmit(this.props.credMethod, this.state.code.trim());
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var formatMessage = this.props.intl.formatMessage;
      var methods = {
        'email': formatMessage(messages.email),
        'tel': formatMessage(messages.phone)
      };
      var method = methods[this.props.credMethod] || this.props.credMethod;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small",
        htmlFor: "enter-confirmation-code"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "enter_confirmation_code_prompt",
        defaultMessage: "Enter confirmation code sent to you by {method}:",
        values: {
          method: method
        }
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "numeric_confirmation_code_prompt",
        defaultMessage: "Numbers only"
      }, function (numbers_only) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "enter-confirmation-code",
          placeholder: numbers_only,
          value: _this2.state.code,
          onChange: _this2.handleChange,
          onKeyPress: _this2.handleKeyPress,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_confirm",
        defaultMessage: "Confirm"
      }))));
    }
  }]);

  return ValidationView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ValidationView));

/***/ }),

/***/ "./src/widgets/Invitation.jsx":
/*!************************************!*\
  !*** ./src/widgets/Invitation.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Invitation; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Invitation = function (_React$PureComponent) {
  _inherits(Invitation, _React$PureComponent);

  function Invitation(props) {
    var _this;

    _classCallCheck(this, Invitation);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Invitation).call(this, props));
    _this.handleButtonAction = _this.handleButtonAction.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Invitation, [{
    key: "handleButtonAction",
    value: function handleButtonAction(evt, data) {
      evt.preventDefault();
      this.props.onAction(data);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accept-invite-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "title"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation",
        defaultMessage: "You are invited to start a new chat. What would you like to do?"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "footer"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: function onClick(event) {
          _this2.handleButtonAction(event, "accept");
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation_accept",
        defaultMessage: "Accept"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: function onClick(event) {
          _this2.handleButtonAction(event, "delete");
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation_ignore",
        defaultMessage: "Ignore"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: function onClick(event) {
          _this2.handleButtonAction(event, "block");
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "chat_invitation_block",
        defaultMessage: "Block"
      }))));
    }
  }]);

  return Invitation;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/attachment.jsx":
/*!************************************!*\
  !*** ./src/widgets/attachment.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Attachment; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-progress.jsx */ "./src/widgets/file-progress.jsx");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var Attachment = function (_React$Component) {
  _inherits(Attachment, _React$Component);

  function Attachment(props) {
    var _this;

    _classCallCheck(this, Attachment);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Attachment).call(this, props));
    _this.state = {
      downloader: null,
      progress: 0
    };
    _this.downloadFile = _this.downloadFile.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Attachment, [{
    key: "downloadFile",
    value: function downloadFile(url, filename, mimetype) {
      var _this2 = this;

      var downloader = this.props.tinode.getLargeFileHelper();
      this.setState({
        downloader: downloader
      });
      downloader.download(url, filename, mimetype, function (loaded) {
        _this2.setState({
          progress: loaded / _this2.props.size
        });
      }).then(function () {
        _this2.setState({
          downloader: null,
          progress: 0
        });
      }).catch(function (err) {
        if (err) {
          _this2.props.onError("Error downloading file: " + err.message, 'err');
        }

        _this2.setState({
          downloader: null,
          progress: 0
        });
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      if (this.props.uploader) {
        this.props.onCancelUpload();
      } else if (this.state.downloader) {
        this.state.downloader.cancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var filename = this.props.filename || 'file_attachment';

      if (filename.length > 36) {
        filename = filename.substr(0, 16) + '...' + filename.substr(-16);
      }

      var size = this.props.size > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "small gray"
      }, "(", Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__["bytesToHumanSize"])(this.props.size), ")") : null;
      var url, helperFunc;

      if (!this.props.uploader && !this.state.downloader && !/^(?:(?:[a-z]+:)?\/\/)/i.test(this.props.downloadUrl)) {
        url = "javascript:;";

        helperFunc = function helperFunc(e) {
          _this3.downloadFile(_this3.props.downloadUrl, _this3.props.filename, _this3.props.mimetype);
        };
      } else {
        url = this.props.downloadUrl;
        helperFunc = null;
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "attachment"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons big gray"
      }, "insert_drive_file")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "flex-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, filename, " ", size), this.props.uploader || this.state.downloader ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_file_progress_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        progress: this.props.uploader ? this.props.progress : this.state.progress,
        onCancel: this.handleCancel
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: url,
        download: this.props.filename,
        onClick: helperFunc
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "save_attachment",
        defaultMessage: "save"
      })))));
    }
  }]);

  return Attachment;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/avatar-upload.jsx":
/*!***************************************!*\
  !*** ./src/widgets/avatar-upload.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AvatarUpload; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var AvatarUpload = function (_React$Component) {
  _inherits(AvatarUpload, _React$Component);

  function AvatarUpload(props) {
    var _this;

    _classCallCheck(this, AvatarUpload);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AvatarUpload).call(this, props));
    _this.state = {
      dataUrl: props.avatar
    };
    _this.handleFileUpload = _this.handleFileUpload.bind(_assertThisInitialized(_this));
    _this.handleClear = _this.handleClear.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AvatarUpload, [{
    key: "handleFileUpload",
    value: function handleFileUpload(e) {
      var _this2 = this;

      Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__["imageFileScaledToBase64"])(e.target.files[0], _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"], _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"], true, function (base64bits, mime) {
        var du = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__["makeImageUrl"])({
          data: base64bits,
          type: mime
        });

        _this2.setState({
          dataUrl: du
        });

        _this2.props.onImageChanged(du);
      }, function (err) {
        _this2.props.onError(err, 'err');
      });
      e.target.value = '';
    }
  }, {
    key: "handleClear",
    value: function handleClear() {
      this.props.onImageChanged(null);
    }
  }, {
    key: "render",
    value: function render() {
      var randId = "file-input-avatar-" + (Math.random() + '').substr(2);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-upload"
      }, this.props.readOnly || !this.state.dataUrl ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "clear-avatar",
        onClick: this.handleClear
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "clear")), this.state.dataUrl ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: this.state.dataUrl,
        className: "preview"
      }) : this.props.readOnly && this.props.uid ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        avatar: true,
        topic: this.props.uid,
        title: this.props.title
      })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "blank"
      }, _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"], "\xD7", _config_js__WEBPACK_IMPORTED_MODULE_2__["AVATAR_SIZE"]), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        id: randId,
        className: "inputfile hidden",
        accept: "image/*",
        onChange: this.handleFileUpload
      }), this.props.readOnly ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: randId,
        className: "round"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "file_upload")));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.dataUrl != nextProps.avatar) {
        return {
          dataUrl: nextProps.avatar
        };
      }

      return null;
    }
  }]);

  return AvatarUpload;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/chat-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/chat-message.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChatMessage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _attachment_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attachment.jsx */ "./src/widgets/attachment.jsx");
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./received-marker.jsx */ "./src/widgets/received-marker.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








var ChatMessage = function (_React$Component) {
  _inherits(ChatMessage, _React$Component);

  function ChatMessage(props) {
    var _this;

    _classCallCheck(this, ChatMessage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChatMessage).call(this, props));
    _this.state = {
      progress: 0
    };

    if (props.uploader) {
      props.uploader.onProgress = _this.handleProgress.bind(_assertThisInitialized(_this));
    }

    _this.handlePreviewImage = _this.handlePreviewImage.bind(_assertThisInitialized(_this));
    _this.handleFormButtonClick = _this.handleFormButtonClick.bind(_assertThisInitialized(_this));
    _this.handleContextClick = _this.handleContextClick.bind(_assertThisInitialized(_this));
    _this.handleCancelUpload = _this.handleCancelUpload.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ChatMessage, [{
    key: "handlePreviewImage",
    value: function handlePreviewImage(e) {
      e.preventDefault();
      this.props.onImagePreview({
        url: e.target.src,
        filename: e.target.title,
        width: e.target.dataset.width,
        height: e.target.dataset.height,
        size: e.target.dataset.size,
        type: e.target.dataset.mime
      });
    }
  }, {
    key: "handleFormButtonClick",
    value: function handleFormButtonClick(e) {
      e.preventDefault();
      var data = {
        seq: this.props.seq
      };
      data.resp = {};

      if (e.target.dataset.name) {
        data.resp[e.target.dataset.name] = e.target.dataset.val ? e.target.dataset.val : e.target.dataset.val === undefined ? 1 : '' + e.target.dataset.val;
      }

      if (e.target.dataset.act == 'url') {
        data.ref = '' + e.target.dataset.ref;
      }

      var text = e.target.dataset.title || 'unknown';
      this.props.onFormResponse(e.target.dataset.act, text, data);
    }
  }, {
    key: "handleContextClick",
    value: function handleContextClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.showContextMenu({
        seq: this.props.seq,
        y: e.pageY,
        x: e.pageX
      });
    }
  }, {
    key: "handleProgress",
    value: function handleProgress(ratio) {
      this.setState({
        progress: ratio
      });
    }
  }, {
    key: "handleCancelUpload",
    value: function handleCancelUpload() {
      this.props.uploader.cancel();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var sideClass = this.props.sequence + ' ' + (this.props.response ? 'left' : 'right');
      var bubbleClass = this.props.sequence == 'single' || this.props.sequence == 'last' ? 'bubble tip' : 'bubble';
      var avatar = this.props.userAvatar || true;
      var fullDisplay = this.props.userFrom && this.props.response && (this.props.sequence == 'single' || this.props.sequence == 'last');
      var content = this.props.content;
      var attachments = [];

      if (this.props.mimeType == tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].getContentType()) {
        tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachments(content, function (att, i) {
          if (att.mime == 'application/json') {
            return;
          }

          attachments.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_attachment_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
            tinode: this.props.tinode,
            downloadUrl: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].getDownloadUrl(att),
            filename: att.name,
            uploader: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].isUploading(att),
            mimetype: att.mime,
            size: tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].getEntitySize(att),
            progress: this.state.progress,
            onCancelUpload: this.handleCancelUpload,
            onError: this.props.onError,
            key: i
          }));
        }, this);
        content = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('span', null, tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].format(content, draftyFormatter, this));
      } else if (typeof content != 'string') {
        content = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons"
        }, "error_outline"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "invalid_content",
          defaultMessage: "invalid content"
        })));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: sideClass
      }, this.props.userFrom && this.props.response ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        topic: this.props.userFrom,
        title: this.props.userName,
        avatar: avatar
      }) : null) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: bubbleClass
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "message-content"
      }, content, attachments, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_received_marker_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
        timestamp: this.props.timestamp,
        received: this.props.received
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "menuTrigger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.handleContextClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "expand_more")))), fullDisplay ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "author"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "user_not_found",
        defaultMessage: "Not found"
      }, function (notFound) {
        return _this2.props.userName || react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, notFound);
      })) : null));
    }
  }]);

  return ChatMessage;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;



function draftyFormatter(style, data, values, key) {
  var el = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].tagName(style);

  if (el) {
    var attr = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attrValue(style, data) || {};
    attr.key = key;

    switch (style) {
      case 'IM':
        if (data) {
          attr.className = 'inline-image';
          var dim = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_7__["fitImageSize"])(data.width, data.height, Math.min(this.props.viewportWidth - _config_js__WEBPACK_IMPORTED_MODULE_6__["REM_SIZE"] * 4, _config_js__WEBPACK_IMPORTED_MODULE_6__["REM_SIZE"] * 36), _config_js__WEBPACK_IMPORTED_MODULE_6__["REM_SIZE"] * 24, false);
          dim = dim || {
            dstWidth: _config_js__WEBPACK_IMPORTED_MODULE_6__["BROKEN_IMAGE_SIZE"],
            dstHeight: _config_js__WEBPACK_IMPORTED_MODULE_6__["BROKEN_IMAGE_SIZE"]
          };
          attr.style = {
            width: dim.dstWidth + 'px',
            height: dim.dstHeight + 'px'
          };

          if (attr.src) {
            attr.onClick = this.handlePreviewImage;
            attr.className += ' image-clickable';
          } else {
            attr.src = 'img/broken_image.png';
          }
        }

        break;

      case 'BN':
        attr.onClick = this.handleFormButtonClick;
        var inner = react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(values, function (child) {
          return typeof child == 'string' ? child : undefined;
        });

        if (!inner || inner.length == 0) {
          inner = [attr.name];
        }

        attr['data-title'] = inner.join('');
        break;

      case 'FM':
        attr.className = 'bot-form';
        break;

      case 'FE':
        break;
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(el, attr, values);
  } else {
    return values;
  }
}

;

/***/ }),

/***/ "./src/widgets/checkbox.jsx":
/*!**********************************!*\
  !*** ./src/widgets/checkbox.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CheckBox; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var CheckBox = function (_React$PureComponent) {
  _inherits(CheckBox, _React$PureComponent);

  function CheckBox(props) {
    var _this;

    _classCallCheck(this, CheckBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CheckBox).call(this, props));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CheckBox, [{
    key: "handleChange",
    value: function handleChange() {
      this.props.onChange(this.props.name, !this.props.checked);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.onChange ? this.props.checked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons blue clickable",
        onClick: this.handleChange
      }, "check_box") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons blue clickable",
        onClick: this.handleChange
      }, "check_box_outline_blank") : this.props.checked ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "check_box") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "check_box_outline_blank");
    }
  }]);

  return CheckBox;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/chip-input.jsx":
/*!************************************!*\
  !*** ./src/widgets/chip-input.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChipInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chip_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chip.jsx */ "./src/widgets/chip.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var ChipInput = function (_React$Component) {
  _inherits(ChipInput, _React$Component);

  function ChipInput(props) {
    var _this;

    _classCallCheck(this, ChipInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChipInput).call(this, props));
    _this.state = ChipInput.getDerivedStateFromProps(props);
    _this.handleTextInput = _this.handleTextInput.bind(_assertThisInitialized(_this));
    _this.removeChipAt = _this.removeChipAt.bind(_assertThisInitialized(_this));
    _this.handleChipCancel = _this.handleChipCancel.bind(_assertThisInitialized(_this));
    _this.handleFocusGained = _this.handleFocusGained.bind(_assertThisInitialized(_this));
    _this.handleFocusLost = _this.handleFocusLost.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ChipInput, [{
    key: "handleTextInput",
    value: function handleTextInput(e) {
      this.setState({
        input: e.target.value
      });

      if (this.props.filterFunc) {
        this.props.filterFunc(e.target.value);
      }
    }
  }, {
    key: "removeChipAt",
    value: function removeChipAt(idx) {
      var removed = this.state.sortedChips[idx];
      this.props.onChipRemoved(removed.user, this.state.chipIndex[removed.user]);
    }
  }, {
    key: "handleChipCancel",
    value: function handleChipCancel(item, idx) {
      this.removeChipAt(idx);
    }
  }, {
    key: "handleFocusGained",
    value: function handleFocusGained() {
      this.setState({
        focused: true
      });
    }
  }, {
    key: "handleFocusLost",
    value: function handleFocusLost() {
      this.setState({
        focused: false
      });

      if (this.props.onFocusLost) {
        this.props.onFocusLost(this.state.input);
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.key === 'Backspace') {
        if (this.state.input.length == 0 && this.state.sortedChips.length > 0) {
          var at = this.state.sortedChips.length - 1;

          if (this.state.sortedChips[at].user !== this.props.required) {
            this.removeChipAt(at);
          }
        }
      } else if (e.key === 'Enter') {
        if (this.props.onEnter) {
          this.props.onEnter(this.state.input);
        }
      } else if (e.key === 'Escape') {
        if (this.props.onCancel) {
          this.props.onCancel();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var chips = [];
      var count = 0;
      this.state.sortedChips.map(function (item) {
        chips.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_chip_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          onCancel: _this2.handleChipCancel,
          avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__["makeImageUrl"])(item.public ? item.public.photo : null),
          title: item.public ? item.public.fn : undefined,
          noAvatar: _this2.props.avatarDisabled,
          topic: item.user,
          required: item.user === _this2.props.required,
          invalid: item.invalid,
          index: count,
          key: item.user
        }));
        count++;
      });
      var className = "chip-input" + (this.state.focused ? ' focused' : '');
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className
      }, chips, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        placeholder: this.state.placeholder,
        onChange: this.handleTextInput,
        onFocus: this.handleFocusGained,
        onBlur: this.handleFocusLost,
        onKeyDown: this.handleKeyDown,
        value: this.state.input,
        autoFocus: true
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var state = {
        placeholder: nextProps.chips ? '' : nextProps.prompt,
        sortedChips: ChipInput.sortChips(nextProps.chips, nextProps.required),
        chipIndex: ChipInput.indexChips(nextProps.chips),
        focused: prevState && prevState.focused
      };

      if (!prevState || nextProps.chips.length > prevState.sortedChips.length) {
        state.input = '';
      }

      return state;
    }
  }, {
    key: "indexChips",
    value: function indexChips(chips) {
      var index = {};
      var count = 0;
      chips.map(function (item) {
        index[item.user] = count;
        count++;
      });
      return index;
    }
  }, {
    key: "sortChips",
    value: function sortChips(chips, keep) {
      var required = [];
      var normal = [];
      chips.map(function (item) {
        if (item.user === keep) {
          required.push(item);
        } else {
          normal.push(item);
        }
      });
      return required.concat(normal);
    }
  }]);

  return ChipInput;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/chip.jsx":
/*!******************************!*\
  !*** ./src/widgets/chip.jsx ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Chip; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Chip = function (_React$PureComponent) {
  _inherits(Chip, _React$PureComponent);

  function Chip(props) {
    var _this;

    _classCallCheck(this, Chip);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Chip).call(this, props));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Chip, [{
    key: "handleCancel",
    value: function handleCancel() {
      this.props.onCancel(this.props.topic, this.props.index);
    }
  }, {
    key: "render",
    value: function render() {
      var title = this.props.title || this.props.topic;
      var className = this.props.invalid ? 'chip invalid' : 'chip';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className
      }, this.props.noAvatar ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "spacer"
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        avatar: this.props.avatar || true,
        topic: this.props.topic,
        title: this.props.title
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, title), this.props.onCancel && !this.props.required ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.handleCancel
      }, "\xD7") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "spacer"
      }));
    }
  }]);

  return Chip;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/contact-action.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-action.jsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var ContactAction = function (_React$PureComponent) {
  _inherits(ContactAction, _React$PureComponent);

  function ContactAction(props) {
    var _this;

    _classCallCheck(this, ContactAction);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactAction).call(this, props));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ContactAction, [{
    key: "handleClick",
    value: function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onAction(this.props.action);
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        onClick: this.handleClick,
        className: "action"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "action-text"
      }, formatMessage(this.props.title, this.props.values)));
    }
  }]);

  return ContactAction;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ContactAction));

/***/ }),

/***/ "./src/widgets/contact-badges.jsx":
/*!****************************************!*\
  !*** ./src/widgets/contact-badges.jsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ContactBadges; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


var icon_mapping = {
  'muted': 'notifications_off',
  'banned': 'block'
};

var ContactBadges = function (_React$PureComponent) {
  _inherits(ContactBadges, _React$PureComponent);

  function ContactBadges() {
    _classCallCheck(this, ContactBadges);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContactBadges).apply(this, arguments));
  }

  _createClass(ContactBadges, [{
    key: "render",
    value: function render() {
      var badges = null;

      if (this.props.badges && this.props.badges.length > 0) {
        badges = [];
        this.props.badges.map(function (b) {
          if (b.icon) {
            badges.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
              className: "material-icons as-badge",
              key: b.key || b.icon
            }, icon_mapping[b.icon]));
          } else {
            var style = 'badge' + (b.color ? ' ' + b.color : '');
            badges.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
              className: style,
              key: b.key || b.name
            }, b.name));
          }
        });
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, badges);
      }

      return null;
    }
  }]);

  return ContactBadges;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/contact-list.jsx":
/*!**************************************!*\
  !*** ./src/widgets/contact-list.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _contact_action_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-action.jsx */ "./src/widgets/contact-action.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  badge_you: {
    "id": "badge_you",
    "defaultMessage": "you"
  },
  badge_owner: {
    "id": "badge_owner",
    "defaultMessage": "owner"
  }
});

var ContactList = function (_React$Component) {
  _inherits(ContactList, _React$Component);

  function ContactList() {
    _classCallCheck(this, ContactList);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContactList).apply(this, arguments));
  }

  _createClass(ContactList, [{
    key: "render",
    value: function render() {
      var _this = this;

      var formatMessage = this.props.intl.formatMessage;
      var showCheckmark = Array.isArray(this.props.topicSelected);
      var contactNodes = [];
      var contactsCount = 0;

      if (this.props.contacts && this.props.contacts.length > 0) {
        this.props.contacts.map(function (c) {
          if (c.action) {
            contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_action_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
              title: c.title,
              action: c.action,
              values: c.values,
              key: c.action,
              onAction: _this.props.onAction
            }));
          } else {
            var key = c.topic ? c.topic : c.user;

            if (_this.props.filterFunc && _this.props.filter) {
              var content = [key];

              if (c.private && c.private.comment) {
                content.push(('' + c.private.comment).toLowerCase());
              }

              if (c.public && c.public.fn) {
                content.push(('' + c.public.fn).toLowerCase());
              }

              if (!_this.props.filterFunc(_this.props.filter, content)) {
                return;
              }
            }

            var selected = showCheckmark ? _this.props.topicSelected.indexOf(key) > -1 : _this.props.topicSelected === key;
            var badges = [];

            if (_this.props.showMode) {
              if (key === _this.props.myUserId) {
                badges.push({
                  name: formatMessage(messages.badge_you),
                  color: 'green'
                });
              }

              if (c.acs && c.acs.isOwner()) {
                badges.push({
                  name: formatMessage(messages.badge_owner),
                  color: 'blue'
                });
              }
            }

            var comment = Array.isArray(c.private) ? c.private.join(',') : c.private ? c.private.comment : null;
            contactNodes.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
              title: c.public ? c.public.fn : null,
              avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["makeImageUrl"])(c.public ? c.public.photo : null),
              comment: comment,
              unread: _this.props.showUnread ? c.unread : 0,
              now: c.online && _this.props.connected,
              acs: c.acs,
              showMode: _this.props.showMode,
              badges: badges,
              showCheckmark: showCheckmark,
              selected: selected,
              showOnline: _this.props.showOnline,
              onSelected: _this.props.onTopicSelected,
              showContextMenu: _this.props.showContextMenu,
              item: key,
              index: contactNodes.length,
              key: key
            }));
            contactsCount++;
          }
        }, this);
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: this.props.noScroll ? null : "scrollable-panel"
      }, contactsCount == 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "center-medium-text",
        dangerouslySetInnerHTML: {
          __html: this.props.emptyListMessage
        }
      }) : null, contactNodes.length > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "contact-box"
      }, contactNodes) : null);
    }
  }]);

  return ContactList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ContactList));

/***/ }),

/***/ "./src/widgets/contact.jsx":
/*!*********************************!*\
  !*** ./src/widgets/contact.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Contact; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-badges.jsx */ "./src/widgets/contact-badges.jsx");
/* harmony import */ var _unread_badge_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./unread-badge.jsx */ "./src/widgets/unread-badge.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var Contact = function (_React$Component) {
  _inherits(Contact, _React$Component);

  function Contact(props) {
    var _this;

    _classCallCheck(this, Contact);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Contact).call(this, props));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.handleContextClick = _this.handleContextClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Contact, [{
    key: "handleClick",
    value: function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.props.onSelected) {
        this.props.onSelected(this.props.item, this.props.index, this.props.now, this.props.acs);
      }
    }
  }, {
    key: "handleContextClick",
    value: function handleContextClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.showContextMenu({
        topicName: this.props.item,
        y: e.pageY,
        x: e.pageX
      });
    }
  }, {
    key: "render",
    value: function render() {
      var title = this.props.title;

      if (!title) {
        title = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
          id: "unnamed_topic"
        }));
      } else if (title.length > 30) {
        title = title.substring(0, 28) + '...';
      }

      var online = this.props.now ? 'online' : 'offline';
      var avatar = this.props.avatar ? this.props.avatar : true;
      var badges = this.props.badges ? this.props.badges.slice() : [];
      var icon_badges = [];

      if (this.props.acs) {
        if (this.props.showMode) {
          badges.push({
            name: this.props.acs.getMode(),
            key: 'mode'
          });
        }

        if (this.props.acs.isMuted()) {
          icon_badges.push({
            icon: 'muted'
          });
        }

        if (!this.props.acs.isJoiner()) {
          icon_badges.push({
            icon: 'banned'
          });
        }
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: !this.props.showCheckmark && this.props.selected ? "selected" : null,
        onClick: this.handleClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        avatar: avatar,
        title: this.props.title,
        topic: this.props.item
      }), this.props.showOnline ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: online
      }) : this.props.showCheckmark && this.props.selected ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "checkmark material-icons"
      }, "check_circle") : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "text-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "contact-title"
      }, title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_unread_badge_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        count: this.props.unread
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        badges: icon_badges
      })), this.props.comment ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "contact-comment"
      }, this.props.comment) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_badges_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        badges: badges
      }))), this.props.showContextMenu ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "menuTrigger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.handleContextClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "expand_more"))) : null);
    }
  }]);

  return Contact;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/context-menu.jsx":
/*!**************************************!*\
  !*** ./src/widgets/context-menu.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_navigation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/navigation.js */ "./src/lib/navigation.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["defineMessages"])({
  info: {
    "id": "menu_item_info",
    "defaultMessage": "Info"
  },
  clear_messages: {
    "id": "menu_item_clear_messages",
    "defaultMessage": "Clear messages"
  },
  clear_for_all: {
    "id": "menu_item_clear_messages_for_all",
    "defaultMessage": "Clear for All"
  },
  'delete': {
    "id": "menu_item_delete",
    "defaultMessage": "Delete"
  },
  delete_for_all: {
    "id": "menu_item_delete_for_all",
    "defaultMessage": "Delete for All"
  },
  mute: {
    "id": "menu_item_mute",
    "defaultMessage": "Mute"
  },
  unmute: {
    "id": "menu_item_unmute",
    "defaultMessage": "Unmute"
  },
  topic_delete: {
    "id": "menu_item_delete_topic",
    "defaultMessage": "Delete"
  },
  unblock: {
    "id": "menu_item_unblock",
    "defaultMessage": "Unblock"
  },
  block: {
    "id": "menu_item_block",
    "defaultMessage": "Block"
  },
  member_delete: {
    "id": "menu_item_member_delete",
    "defaultMessage": "Remove"
  },
  archive: {
    "id": "menu_item_archive_topic",
    "defaultMessage": "Archive"
  }
});

var ContextMenu = function (_React$Component) {
  _inherits(ContextMenu, _React$Component);

  function ContextMenu(props) {
    var _this;

    _classCallCheck(this, ContextMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContextMenu).call(this, props));
    var formatMessage = props.intl.formatMessage;
    _this.handlePageClick = _this.handlePageClick.bind(_assertThisInitialized(_this));
    _this.handleEscapeKey = _this.handleEscapeKey.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.MenuItems = {
      'topic_info': {
        id: 'topic_info',
        title: formatMessage(messages.info),
        handler: null
      },
      'messages_clear': {
        id: 'messages_clear',
        title: formatMessage(messages.clear_messages),
        handler: function handler(params, errorHandler) {
          return _this.deleteMessages(true, false, params, errorHandler);
        }
      },
      'messages_clear_hard': {
        id: 'messages_clear_hard',
        title: formatMessage(messages.clear_for_all),
        handler: function handler(params, errorHandler) {
          return _this.deleteMessages(true, true, params, errorHandler);
        }
      },
      'message_delete': {
        id: 'message_delete',
        title: formatMessage(messages.delete),
        handler: function handler(params, errorHandler) {
          return _this.deleteMessages(false, false, params, errorHandler);
        }
      },
      'message_delete_hard': {
        id: 'message_delete_hard',
        title: formatMessage(messages.delete_for_all),
        handler: function handler(params, errorHandler) {
          return _this.deleteMessages(false, true, params, errorHandler);
        }
      },
      'topic_unmute': {
        id: 'topic_unmute',
        title: formatMessage(messages.unmute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+P')
      },
      'topic_mute': {
        id: 'topic_mute',
        title: formatMessage(messages.mute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '-P')
      },
      'topic_unblock': {
        id: 'topic_unblock',
        title: formatMessage(messages.unblock),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+JP')
      },
      'topic_block': {
        id: 'topic_block',
        title: formatMessage(messages.block),
        handler: function handler(params, errorHandler) {
          return _this.topicPermissionSetter('-JP', params, errorHandler).then(function (ctrl) {
            _this.props.onTopicRemoved(params.topicName);

            return ctrl;
          });
        }
      },
      'topic_delete': {
        id: 'topic_delete',
        title: formatMessage(messages.topic_delete),
        handler: function handler(params, errorHandler) {
          var topic = _this.props.tinode.getTopic(params.topicName);

          if (!topic) {
            console.log("Topic not found: ", params.topicName);
            return;
          }

          return topic.delTopic().catch(function (err) {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'topic_archive': {
        id: 'topic_archive',
        title: formatMessage(messages.archive),
        handler: function handler(params, errorHandler) {
          var topic = _this.props.tinode.getTopic(params.topicName);

          if (!topic) {
            console.log("Topic not found: ", params.topicName);
            return;
          }

          return topic.archive(true).catch(function (err) {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'permissions': {
        id: 'permissions',
        title: formatMessage({
          id: 'menu_item_edit_permissions'
        }),
        handler: null
      },
      'member_delete': {
        id: 'member_delete',
        title: formatMessage(messages.member_delete),
        handler: function handler(params, errorHandler) {
          var topic = _this.props.tinode.getTopic(params.topicName);

          if (!topic || !params.user) {
            console.log("Topic or user not found: '" + params.topicName + "', '" + params.user + "'");
            return;
          }

          return topic.delSubscription(params.user).catch(function (err) {
            if (errorHandler) {
              errorHandler(err.message, 'err');
            }
          });
        }
      },
      'member_mute': {
        id: 'member_mute',
        title: formatMessage(messages.mute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '-P')
      },
      'member_unmute': {
        id: 'member_unmute',
        title: formatMessage(messages.unmute),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+P')
      },
      'member_block': {
        id: 'member_block',
        title: formatMessage(messages.block),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '-J')
      },
      'member_unblock': {
        id: 'member_unblock',
        title: formatMessage(messages.unblock),
        handler: _this.topicPermissionSetter.bind(_assertThisInitialized(_this), '+J')
      }
    };
    return _this;
  }

  _createClass(ContextMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('mousedown', this.handlePageClick, false);
      document.addEventListener('keyup', this.handleEscapeKey, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this.handlePageClick, false);
      document.removeEventListener('keyup', this.handleEscapeKey, false);
    }
  }, {
    key: "handlePageClick",
    value: function handlePageClick(e) {
      if (react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this).contains(e.target)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      this.props.hide();
    }
  }, {
    key: "handleEscapeKey",
    value: function handleEscapeKey(e) {
      if (e.keyCode === 27) {
        this.props.hide();
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.hide();
      var item = this.props.items[e.currentTarget.dataset.id];

      if (typeof item == 'string') {
        item = this.MenuItems[item];
      }

      if (!item) {
        console.log("Invalid menu item ID", e.currentTarget.dataset.id);
      } else {
        this.props.onAction(item.id, item.handler(this.props.params, this.props.onError), this.props.params);
      }
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(all, hard, params, errorHandler) {
      var topic = this.props.tinode.getTopic(params.topicName);

      if (!topic) {
        console.log("Topic not found: ", params.topicName);
        return;
      }

      if (!all && topic.cancelSend(params.seq)) {
        return;
      }

      var promise = all ? topic.delMessagesAll(hard) : topic.delMessagesList([params.seq], hard);
      return promise.catch(function (err) {
        if (errorHandler) {
          errorHandler(err.message, 'err');
        }
      });
    }
  }, {
    key: "topicPermissionSetter",
    value: function topicPermissionSetter(mode, params, errorHandler) {
      var topic = this.props.tinode.getTopic(params.topicName);

      if (!topic) {
        console.log("Topic not found", params.topicName);
        return;
      }

      var am, user;

      if (params.user) {
        user = topic.subscriber(params.user);

        if (!user) {
          console.log("Subscriber not found", params.topicName + "[" + params.user + "]");
          return;
        }

        am = user.acs.updateGiven(mode).getGiven();
      } else {
        am = topic.getAccessMode().updateWant(mode).getWant();
      }

      var result = topic.setMeta({
        sub: {
          user: params.user,
          mode: am
        }
      });

      if (errorHandler) {
        result = result.catch(function (err) {
          errorHandler(err.message, 'err');
        });
      }

      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var count = 0;
      var menu = [];
      this.props.items.map(function (item) {
        if (typeof item == 'string') {
          item = _this2.MenuItems[item];
        }

        if (item && item.title) {
          menu.push(item.title == '-' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
            className: "separator",
            key: count
          }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
            onClick: _this2.handleClick,
            "data-id": count,
            key: count
          }, item.title));
        }

        count++;
      });
      var hSize = 12 * _config_js__WEBPACK_IMPORTED_MODULE_3__["REM_SIZE"];
      var vSize = _config_js__WEBPACK_IMPORTED_MODULE_3__["REM_SIZE"] * (0.7 + menu.length * 2.5);
      var left = this.props.bounds.right - this.props.clickAt.x < hSize ? this.props.clickAt.x - this.props.bounds.left - hSize : this.props.clickAt.x - this.props.bounds.left;
      var top = this.props.bounds.bottom - this.props.clickAt.y < vSize ? this.props.clickAt.y - this.props.bounds.top - vSize : this.props.clickAt.y - this.props.bounds.top;
      var position = {
        left: left + 'px',
        top: top + 'px'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "menu",
        style: position
      }, menu);
    }
  }]);

  return ContextMenu;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_2__["injectIntl"])(ContextMenu));

/***/ }),

/***/ "./src/widgets/error-panel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/error-panel.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ErrorPanel; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var ErrorPanel = function (_React$PureComponent) {
  _inherits(ErrorPanel, _React$PureComponent);

  function ErrorPanel(props) {
    var _this;

    _classCallCheck(this, ErrorPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ErrorPanel).call(this, props));
    _this.state = {
      show: false
    };
    _this.hide = _this.hide.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ErrorPanel, [{
    key: "hide",
    value: function hide() {
      this.setState({
        show: false
      });

      if (this.props.onClearError) {
        this.props.onClearError();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var icons = {
        err: 'error',
        warn: 'warning',
        info: 'info'
      };
      var level = icons[this.props.level] || '';
      var className = 'alert-box ' + level;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: className
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "icon"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, level)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: this.props.text
        }
      }), this.props.action ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.action
      }, this.props.actionText) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "cancel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        onCancel: this.hide
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      return {
        show: !!nextProps.level
      };
    }
  }]);

  return ErrorPanel;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/file-progress.jsx":
/*!***************************************!*\
  !*** ./src/widgets/file-progress.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FileProgress; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var FileProgress = function (_React$PureComponent) {
  _inherits(FileProgress, _React$PureComponent);

  function FileProgress() {
    _classCallCheck(this, FileProgress);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileProgress).apply(this, arguments));
  }

  _createClass(FileProgress, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "uploader"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        style: {
          width: this.props.progress * 100 + "%"
        }
      })), this.props.progress < 0.999 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.onCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "close"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "action_cancel",
        defaultMessage: "cancel"
      })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "upload_finishing",
        defaultMessage: "finishing..."
      }));
    }
  }]);

  return FileProgress;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/group-manager.jsx":
/*!***************************************!*\
  !*** ./src/widgets/group-manager.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact-list.jsx */ "./src/widgets/contact-list.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  no_contacts: {
    "id": "no_contacts",
    "defaultMessage": "You have no contacts :-("
  },
  contacts_not_found: {
    "id": "contacts_not_found_short",
    "defaultMessage": "No contacts match '{query}'"
  }
});

var GroupManager = function (_React$Component) {
  _inherits(GroupManager, _React$Component);

  function GroupManager(props) {
    var _this;

    _classCallCheck(this, GroupManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupManager).call(this, props));
    _this.state = {
      members: props.members,
      index: GroupManager.indexMembers(props.members),
      contactFilter: '',
      noContactsMessage: props.intl.formatMessage(messages.no_contacts),
      selectedContacts: GroupManager.selectedContacts(props.members)
    };
    _this.handleContactSelected = _this.handleContactSelected.bind(_assertThisInitialized(_this));
    _this.handleMemberRemoved = _this.handleMemberRemoved.bind(_assertThisInitialized(_this));
    _this.handleContactFilter = _this.handleContactFilter.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GroupManager, [{
    key: "handleContactSelected",
    value: function handleContactSelected(userId, index) {
      var status = this.state.index[userId];

      if (status) {
        if (status.present) {
          return;
        }

        status.delta += 1;
        status.present = true;
      } else {
        status = {
          delta: 1,
          present: true
        };
      }

      var m = this.state.members.slice();
      m.push(this.props.contacts[index]);
      var sel = GroupManager.selectedContacts(m);
      var i = this.state.index;
      i[userId] = status;
      this.setState({
        members: m,
        index: i,
        selectedContacts: sel
      });
    }
  }, {
    key: "handleMemberRemoved",
    value: function handleMemberRemoved(userId, index) {
      var status = this.state.index[userId];

      if (!status || !status.present) {
        return;
      }

      status.present = false;
      status.delta -= 1;
      var m = this.state.members.slice();
      m.splice(index, 1);
      var sel = GroupManager.selectedContacts(m);
      var i = this.state.index;
      i[userId] = status;
      this.setState({
        members: m,
        index: i,
        selectedContacts: sel
      });
    }
  }, {
    key: "handleContactFilter",
    value: function handleContactFilter(val) {
      var formatMessage = this.props.intl.formatMessage;
      var msg = !val ? formatMessage(messages.no_contacts) : formatMessage(messages.contacts_not_found, {
        query: val
      });
      this.setState({
        contactFilter: val,
        noContactsMessage: msg
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var instance = this;
      var members = [];
      var added = [];
      var removed = [];
      var keys = Object.keys(this.state.index);
      keys.map(function (k) {
        if (instance.state.index[k].present) {
          members.push(k);
        }

        if (instance.state.index[k].delta > 0) {
          added.push(k);
        } else if (instance.state.index[k].delta < 0) {
          removed.push(k);
        }
      });
      this.props.onSubmit(members, added, removed);
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.props.onCancel();
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "group-manager"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_group_members",
        defaultMessage: "Group Members"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        chips: this.state.members,
        required: this.props.requiredMember,
        prompt: "add members",
        filterFunc: this.handleContactFilter,
        onChipRemoved: this.handleMemberRemoved
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_all_contacts",
        defaultMessage: "All Contacts"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_list_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        contacts: this.props.contacts,
        myUserId: this.props.myUserId,
        topicSelected: this.state.selectedContacts,
        filter: this.state.contactFilter,
        filterFunc: GroupManager.doContactFiltering,
        emptyListMessage: this.state.noContactsMessage,
        showOnline: false,
        showUnread: false,
        onTopicSelected: this.handleContactSelected
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "group-manager-buttons",
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_ok",
        defaultMessage: "OK"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel",
        defaultMessage: "Cancel"
      }))));
    }
  }], [{
    key: "indexMembers",
    value: function indexMembers(members) {
      var index = {};
      members.map(function (m) {
        index[m.user] = {
          delta: 0,
          present: true
        };
      });
      return index;
    }
  }, {
    key: "selectedContacts",
    value: function selectedContacts(members) {
      var sel = [];
      members.map(function (m) {
        sel.push(m.user);
      });
      return sel;
    }
  }, {
    key: "doContactFiltering",
    value: function doContactFiltering(filter, values) {
      if (filter) {
        for (var i = 0; i < values.length; i++) {
          if (values[i].indexOf(filter) >= 0) {
            return true;
          }
        }

        return false;
      }

      return true;
    }
  }]);

  return GroupManager;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(GroupManager));

/***/ }),

/***/ "./src/widgets/group-subs.jsx":
/*!************************************!*\
  !*** ./src/widgets/group-subs.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GroupSubs; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var GroupSubs = function (_React$Component) {
  _inherits(GroupSubs, _React$Component);

  function GroupSubs(props) {
    _classCallCheck(this, GroupSubs);

    return _possibleConstructorReturn(this, _getPrototypeOf(GroupSubs).call(this, props));
  }

  _createClass(GroupSubs, [{
    key: "render",
    value: function render() {
      var usersOnline = [];
      (this.props.subscribers || []).map(function (sub) {
        usersOnline.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "avatar-box",
          key: sub.user
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
          topic: sub.user,
          avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_2__["makeImageUrl"])(sub.public ? sub.public.photo : null) || true,
          title: sub.public ? sub.public.fn : null
        })));
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "topic-users"
      }, usersOnline);
    }
  }]);

  return GroupSubs;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/host-selector.jsx":
/*!***************************************!*\
  !*** ./src/widgets/host-selector.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HostSelector; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var HostSelector = function (_React$PureComponent) {
  _inherits(HostSelector, _React$PureComponent);

  function HostSelector(props) {
    var _this;

    _classCallCheck(this, HostSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HostSelector).call(this, props));
    _this.state = {
      hostName: props.serverAddress,
      changed: false
    };
    _this.handleHostNameChange = _this.handleHostNameChange.bind(_assertThisInitialized(_this));
    _this.handleEditingFinished = _this.handleEditingFinished.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(HostSelector, [{
    key: "handleHostNameChange",
    value: function handleHostNameChange(e) {
      this.setState({
        hostName: e.target.value,
        changed: true
      });
    }
  }, {
    key: "handleEditingFinished",
    value: function handleEditingFinished() {
      if (this.state.changed) {
        this.setState({
          changed: false
        });
        this.props.onServerAddressChange(this.state.hostName.trim());
      }
    }
  }, {
    key: "render",
    value: function render() {
      var hostOptions = [];

      for (var key in _config_js__WEBPACK_IMPORTED_MODULE_1__["KNOWN_HOSTS"]) {
        var item = _config_js__WEBPACK_IMPORTED_MODULE_1__["KNOWN_HOSTS"][key];
        hostOptions.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
          key: item,
          value: item
        }));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "search",
        id: "host-name",
        placeholder: this.props.hostName,
        list: "known-hosts",
        className: "quoted",
        value: this.state.hostName,
        onChange: this.handleHostNameChange,
        onBlur: this.handleEditingFinished,
        required: true
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("datalist", {
        id: "known-hosts"
      }, hostOptions));
    }
  }]);

  return HostSelector;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/image-preview.jsx":
/*!***************************************!*\
  !*** ./src/widgets/image-preview.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ImagePreview; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var ImagePreview = function (_React$PureComponent) {
  _inherits(ImagePreview, _React$PureComponent);

  function ImagePreview(props) {
    var _this;

    _classCallCheck(this, ImagePreview);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImagePreview).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(ImagePreview, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        width: this.container.clientWidth,
        height: this.container.clientHeight
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.content) {
        return null;
      }

      var instance = this;
      var dim = Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_3__["fitImageSize"])(this.props.content.width, this.props.content.height, this.state.width, this.state.height, false);
      var size = dim ? {
        width: dim.dstWidth + 'px',
        height: dim.dstHeight + 'px'
      } : this.props.content.width > this.props.content.height ? {
        width: '100%'
      } : {
        height: '100%'
      };
      size.maxWidth = '100%';
      size.maxHeight = '100%';
      var filename = this.props.content.filename;
      var maxlength = this.props.content.width / _config_js__WEBPACK_IMPORTED_MODULE_2__["REM_SIZE"] | 0;

      if (filename.length > maxlength) {
        filename = filename.slice(0, maxlength - 2) + '...' + filename.slice(2 - maxlength);
      }

      var width = this.props.content.width || '-';
      var height = this.props.content.height || '-';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview",
        onClick: this.props.onClose
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview-caption-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: this.props.content.url,
        download: this.props.content.filename
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "file_download"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "download_action",
        defaultMessage: "download"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.onClose
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons gray"
      }, "close"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview-container",
        ref: function ref(_ref) {
          instance.container = _ref;
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: this.props.content.url,
        style: size
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "image-preview-footer"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_file_name",
        defaultMessage: "File name:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        title: this.props.content.filename
      }, filename ? filename : '-'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_content_type",
        defaultMessage: "Content type:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, this.props.content.type)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_size",
        defaultMessage: "Size:"
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, width, " \xD7 ", height, " px; ", Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_4__["bytesToHumanSize"])(this.props.content.size)))));
    }
  }]);

  return ImagePreview;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/in-place-edit.jsx":
/*!***************************************!*\
  !*** ./src/widgets/in-place-edit.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return InPlaceEdit; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./visible-password.jsx */ "./src/widgets/visible-password.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var InPlaceEdit = function (_React$Component) {
  _inherits(InPlaceEdit, _React$Component);

  function InPlaceEdit(props) {
    var _this;

    _classCallCheck(this, InPlaceEdit);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InPlaceEdit).call(this, props));
    _this.state = {
      active: props.active,
      initialValue: props.value || '',
      value: props.value || ''
    };
    _this.handeTextChange = _this.handeTextChange.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.handleStartEditing = _this.handleStartEditing.bind(_assertThisInitialized(_this));
    _this.handleEditingFinished = _this.handleEditingFinished.bind(_assertThisInitialized(_this));
    _this.handlePasswordFinished = _this.handlePasswordFinished.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InPlaceEdit, [{
    key: "handeTextChange",
    value: function handeTextChange(e) {
      this.setState({
        value: e.target.value
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode === 27) {
        this.setState({
          value: this.props.value,
          active: false
        });
      } else if (e.keyCode === 13) {
        this.handleEditingFinished(e);
      }
    }
  }, {
    key: "handleStartEditing",
    value: function handleStartEditing() {
      if (!this.props.readOnly) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this).focus();
        this.setState({
          active: true
        });
      }
    }
  }, {
    key: "handleEditingFinished",
    value: function handleEditingFinished(event) {
      if (this.props.required && !event.target.checkValidity()) {
        this.setState({
          value: this.props.value,
          active: false
        });
        return;
      }

      this.setState({
        active: false
      });
      var value = this.state.value.trim();

      if ((value || this.props.value) && value !== this.props.value) {
        this.props.onFinished(value);
      }
    }
  }, {
    key: "handlePasswordFinished",
    value: function handlePasswordFinished(value) {
      this.setState({
        active: false
      });

      if (value && value !== this.props.value) {
        this.props.onFinished(value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.active) {
        var fieldType = this.props.type || 'text';
      } else {
        var spanText = this.props.type == 'password' ? '••••••••' : this.state.value;
        var spanClass = 'in-place-edit' + (this.props.readOnly ? ' disabled' : '');

        if (!spanText) {
          spanText = this.props.placeholder;
          spanClass += ' placeholder';
        }

        if (spanText.length > 20) {
          spanText = spanText.substring(0, 19) + '...';
        }
      }

      return this.state.active ? fieldType == 'password' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_visible_password_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        value: this.state.value,
        placeholder: this.props.placeholder,
        required: this.props.required ? 'required' : '',
        autoComplete: this.props.autoComplete,
        autoFocus: true,
        onFinished: this.handlePasswordFinished
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: fieldType,
        value: this.state.value,
        placeholder: this.props.placeholder,
        required: this.props.required ? 'required' : '',
        autoComplete: this.props.autoComplete,
        autoFocus: true,
        onChange: this.handeTextChange,
        onKeyDown: this.handleKeyDown,
        onBlur: this.handleEditingFinished
      }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: spanClass,
        onClick: this.handleStartEditing
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "content"
      }, spanText));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.initialValue != nextProps.value && !prevState.active) {
        return {
          initialValue: nextProps.value || '',
          value: nextProps.value || ''
        };
      }

      return null;
    }
  }]);

  return InPlaceEdit;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/letter-tile.jsx":
/*!*************************************!*\
  !*** ./src/widgets/letter-tile.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LetterTile; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var LetterTile = function (_React$PureComponent) {
  _inherits(LetterTile, _React$PureComponent);

  function LetterTile() {
    _classCallCheck(this, LetterTile);

    return _possibleConstructorReturn(this, _getPrototypeOf(LetterTile).apply(this, arguments));
  }

  _createClass(LetterTile, [{
    key: "render",
    value: function render() {
      var avatar;

      if (this.props.avatar === true) {
        var isGroup = tinode_sdk__WEBPACK_IMPORTED_MODULE_1___default.a.topicType(this.props.topic) == 'grp';

        if (this.props.topic && this.props.title && this.props.title.trim()) {
          var letter = this.props.title.trim().charAt(0);
          var color = 'lettertile ' + (isGroup ? 'color' : 'dark-color') + Math.abs(Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_2__["stringHash"])(this.props.topic)) % 16;
          avatar = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            className: color
          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, letter));
        } else {
          avatar = isGroup ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
            className: "material-icons"
          }, "group") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
            className: "material-icons"
          }, "person");
        }
      } else if (this.props.avatar) {
        avatar = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
          className: "avatar",
          alt: "avatar",
          src: this.props.avatar,
          onError: function onError(e) {
            e.target.onerror = null;
            e.target.src = "/img/broken_image.png";
          }
        });
      } else {
        avatar = null;
      }

      return avatar;
    }
  }]);

  return LetterTile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/load-spinner.jsx":
/*!**************************************!*\
  !*** ./src/widgets/load-spinner.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LoadSpinner; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var LoadSpinner = function (_React$PureComponent) {
  _inherits(LoadSpinner, _React$PureComponent);

  function LoadSpinner() {
    _classCallCheck(this, LoadSpinner);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoadSpinner).apply(this, arguments));
  }

  _createClass(LoadSpinner, [{
    key: "render",
    value: function render() {
      return this.props.show ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "load-spinner-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "loader-spinner"
      })) : null;
    }
  }]);

  return LoadSpinner;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/menu-cancel.jsx":
/*!*************************************!*\
  !*** ./src/widgets/menu-cancel.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MenuCancel; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MenuCancel = function (_React$PureComponent) {
  _inherits(MenuCancel, _React$PureComponent);

  function MenuCancel(props) {
    _classCallCheck(this, MenuCancel);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuCancel).call(this, props));
  }

  _createClass(MenuCancel, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.onCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "close"));
    }
  }]);

  return MenuCancel;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/menu-contacts.jsx":
/*!***************************************!*\
  !*** ./src/widgets/menu-contacts.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MenuContacts; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MenuContacts = function (_React$PureComponent) {
  _inherits(MenuContacts, _React$PureComponent);

  function MenuContacts() {
    _classCallCheck(this, MenuContacts);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuContacts).apply(this, arguments));
  }

  _createClass(MenuContacts, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.onNewTopic
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "chat")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.onSettings
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "settings")));
    }
  }]);

  return MenuContacts;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/menu-start.jsx":
/*!************************************!*\
  !*** ./src/widgets/menu-start.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MenuStart; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MenuStart = function (_React$PureComponent) {
  _inherits(MenuStart, _React$PureComponent);

  function MenuStart() {
    _classCallCheck(this, MenuStart);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuStart).apply(this, arguments));
  }

  _createClass(MenuStart, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.onSignUp
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "person_add")), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.props.onSettings
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "settings")));
    }
  }]);

  return MenuStart;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/more-button.jsx":
/*!*************************************!*\
  !*** ./src/widgets/more-button.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MoreButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MoreButton = function (_React$PureComponent) {
  _inherits(MoreButton, _React$PureComponent);

  function MoreButton(props) {
    var _this;

    _classCallCheck(this, MoreButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MoreButton).call(this, props));
    _this.state = {
      open: props.open
    };
    _this.handleToggle = _this.handleToggle.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MoreButton, [{
    key: "handleToggle",
    value: function handleToggle() {
      var open = !this.state.open;
      this.setState({
        open: open
      });

      if (this.props.onToggle) {
        this.props.onToggle(open);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small clean-clickable",
        onClick: this.handleToggle
      }, this.props.title, "...", this.state.open ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "expand_more") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "chevron_right"));
    }
  }]);

  return MoreButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ "./src/widgets/new-topic-by-id.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-by-id.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  invalid_id: {
    "id": "error_invalid_id",
    "defaultMessage": "Invalid ID"
  }
});

var NewTopicById = function (_React$PureComponent) {
  _inherits(NewTopicById, _React$PureComponent);

  function NewTopicById(props) {
    var _this;

    _classCallCheck(this, NewTopicById);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewTopicById).call(this, props));
    _this.state = {
      groupId: ''
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewTopicById, [{
    key: "handleChange",
    value: function handleChange(e) {
      this.setState({
        groupId: e.target.value
      });
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.handleSubmit(e);
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();

      if (this.state.groupId) {
        var name = this.state.groupId.trim();

        if (name.length > 3 && (name.substr(0, 3) == 'usr' || name.substr(0, 3) == 'grp')) {
          this.props.onSubmit(name);
        } else {
          this.props.onError(this.props.intl.formatMessage(messages.invalid_id), 'err');
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "group_user_id_prompt",
        defaultMessage: "Group or User ID"
      }, function (prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          placeholder: prompt,
          value: _this2.state.groupId,
          onChange: _this2.handleChange,
          onKeyPress: _this2.handleKeyPress,
          required: true
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_subscribe",
        defaultMessage: "Subscribe"
      }))));
    }
  }]);

  return NewTopicById;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(NewTopicById));

/***/ }),

/***/ "./src/widgets/new-topic-group.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/new-topic-group.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NewTopicGroup; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./avatar-upload.jsx */ "./src/widgets/avatar-upload.jsx");
/* harmony import */ var _tag_manager_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tag-manager.jsx */ "./src/widgets/tag-manager.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var NewTopicGroup = function (_React$PureComponent) {
  _inherits(NewTopicGroup, _React$PureComponent);

  function NewTopicGroup(props) {
    var _this;

    _classCallCheck(this, NewTopicGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewTopicGroup).call(this, props));
    _this.state = {
      fn: '',
      private: '',
      imageDataUrl: null,
      tags: []
    };
    _this.handleFnChange = _this.handleFnChange.bind(_assertThisInitialized(_this));
    _this.handlePrivateChange = _this.handlePrivateChange.bind(_assertThisInitialized(_this));
    _this.handleImageChanged = _this.handleImageChanged.bind(_assertThisInitialized(_this));
    _this.handleTagsChanged = _this.handleTagsChanged.bind(_assertThisInitialized(_this));
    _this.handleTagsChanged = _this.handleTagsChanged.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewTopicGroup, [{
    key: "handleFnChange",
    value: function handleFnChange(e) {
      this.setState({
        fn: e.target.value
      });
    }
  }, {
    key: "handlePrivateChange",
    value: function handlePrivateChange(e) {
      this.setState({
        private: e.target.value
      });
    }
  }, {
    key: "handleImageChanged",
    value: function handleImageChanged(img) {
      this.setState({
        imageDataUrl: img
      });
    }
  }, {
    key: "handleTagsChanged",
    value: function handleTagsChanged(tags) {
      this.setState({
        tags: tags
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();

      if (this.state.fn && this.state.fn.trim()) {
        this.props.onSubmit(this.state.fn.trim(), this.state.imageDataUrl, this.state.private.trim(), this.state.tags);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var submitClasses = 'blue';

      if (this.props.disabled) {
        submitClasses += ' disabled';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "panel-form",
        onSubmit: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small",
        htmlFor: "new-topic-fn"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_topic_name"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "topic_name_editing_placeholder",
        defaultMessage: "Freeform name of the group"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "new-topic-fn",
          placeholder: placeholder,
          value: _this2.state.fn,
          onChange: _this2.handleFnChange,
          autoFocus: true,
          required: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small",
        htmlFor: "new-topic-priv"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "label_private"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "private_editing_placeholder"
      }, function (placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          type: "text",
          id: "new-topic-priv",
          placeholder: placeholder,
          value: _this2.state.private,
          onChange: _this2.handlePrivateChange
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_avatar_upload_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onError: this.props.onError,
        onImageChanged: this.handleImageChanged
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_tag_manager"
      }, function (title) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tag_manager_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
          tags: _this2.state.tags,
          activated: true,
          onTagsChanged: _this2.handleTagsChanged,
          title: title
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: submitClasses
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_create",
        defaultMessage: "Create"
      }))));
    }
  }]);

  return NewTopicGroup;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/permissions-editor.jsx":
/*!********************************************!*\
  !*** ./src/widgets/permissions-editor.jsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkbox.jsx */ "./src/widgets/checkbox.jsx");
/* harmony import */ var _contact_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./contact.jsx */ "./src/widgets/contact.jsx");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'joiner': {
    "id": "permission_join",
    "defaultMessage": "Join ({val})"
  },
  'reader': {
    "id": "permission_read",
    "defaultMessage": "Read ({val})"
  },
  'writer': {
    "id": "permission_write",
    "defaultMessage": "Write ({val})"
  },
  'preser': {
    "id": "permission_pres",
    "defaultMessage": "Get notified ({val})"
  },
  'approver': {
    "id": "permission_admin",
    "defaultMessage": "Approve ({val})"
  },
  'sharer': {
    "id": "permission_share",
    "defaultMessage": "Share ({val})"
  },
  'deleter': {
    "id": "permission_delete",
    "defaultMessage": "Delete ({val})"
  },
  'owner': {
    "id": "permission_owner",
    "defaultMessage": "Owner ({val})"
  }
});

var PermissionsEditor = function (_React$Component) {
  _inherits(PermissionsEditor, _React$Component);

  function PermissionsEditor(props) {
    var _this;

    _classCallCheck(this, PermissionsEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PermissionsEditor).call(this, props));
    _this.state = {
      mode: (props.mode || '').replace('N', '')
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PermissionsEditor, [{
    key: "handleChange",
    value: function handleChange(val) {
      var mode = this.state.mode;
      var idx = mode.indexOf(val);

      if (idx == -1) {
        mode += val;
      } else {
        mode = mode.replace(val, '');
      }

      this.setState({
        mode: mode
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var mode = (this.state.mode || 'N').split('').sort().join('');
      var before = (this.props.mode || 'N').split('').sort().join('');

      if (mode !== before) {
        this.props.onSubmit(mode);
      } else {
        this.props.onCancel();
      }
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.props.onCancel();
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var all = 'JRWPASDO';
      var names = {
        'J': formatMessage(messages.joiner, {
          val: 'J'
        }),
        'R': formatMessage(messages.reader, {
          val: 'R'
        }),
        'W': formatMessage(messages.writer, {
          val: 'W'
        }),
        'P': formatMessage(messages.preser, {
          val: 'P'
        }),
        'A': formatMessage(messages.approver, {
          val: 'A'
        }),
        'S': formatMessage(messages.sharer, {
          val: 'S'
        }),
        'D': formatMessage(messages.deleter, {
          val: 'D'
        }),
        'O': formatMessage(messages.owner, {
          val: 'O'
        })
      };
      var skip = this.props.skip || '';
      var mode = this.state.mode;
      var compare = (this.props.compare || '').replace('N', '');
      var items = [];

      for (var i = 0; i < all.length; i++) {
        var c = all.charAt(i);

        if (skip.indexOf(c) >= 0 && mode.indexOf(c) < 0) {
          continue;
        }

        items.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          key: c
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, names[c]), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "checkbox"
        }, skip.indexOf(c) < 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: c,
          checked: mode.indexOf(c) >= 0,
          onChange: this.handleChange
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: c,
          checked: mode.indexOf(c) >= 0
        })), this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "checkbox"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_checkbox_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          name: c,
          checked: compare.indexOf(c) >= 0
        })) : null));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, this.props.userTitle ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "contact-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_contact_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        item: this.props.item,
        title: this.props.userTitle,
        avatar: Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["makeImageUrl"])(this.props.userAvatar ? this.props.userAvatar : null)
      })) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_permissions",
        defaultMessage: "Permissions"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
        className: "permission-editor"
      }, this.props.compare ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, this.props.modeTitle), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, this.props.compareTitle))) : null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, items)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "dialog-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_ok"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel"
      }))));
    }
  }]);

  return PermissionsEditor;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(PermissionsEditor));

/***/ }),

/***/ "./src/widgets/received-marker.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/received-marker.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'sending': {
    "id": "message_sending",
    "defaultMessage": "sending..."
  },
  'failed': {
    "id": "message_sending_failed",
    "defaultMessage": "failed"
  }
});

var ReceivedMarker = function (_React$PureComponent) {
  _inherits(ReceivedMarker, _React$PureComponent);

  function ReceivedMarker() {
    _classCallCheck(this, ReceivedMarker);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReceivedMarker).apply(this, arguments));
  }

  _createClass(ReceivedMarker, [{
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var timestamp;

      if (this.props.received <= tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENDING) {
        timestamp = formatMessage(messages.sending);
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_FAILED) {
        timestamp = formatMessage(messages.failed);
      } else {
        timestamp = Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_3__["shortDateFormat"])(this.props.timestamp, this.props.intl.locale);
      }

      var marker = null;

      if (this.props.received <= tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENDING) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small"
        }, "access_time");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_FAILED) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small amber"
        }, "warning");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_SENT) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small"
        }, "done");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_RECEIVED) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small"
        }, "done_all");
      } else if (this.props.received == tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.MESSAGE_STATUS_READ) {
        marker = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "material-icons small blue"
        }, "done_all");
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "timestamp"
      }, timestamp, "\xA0", marker);
    }
  }]);

  return ReceivedMarker;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(ReceivedMarker));

/***/ }),

/***/ "./src/widgets/search-contacts.jsx":
/*!*****************************************!*\
  !*** ./src/widgets/search-contacts.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SearchContacts; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var SearchContacts = function (_React$PureComponent) {
  _inherits(SearchContacts, _React$PureComponent);

  function SearchContacts(props) {
    var _this;

    _classCallCheck(this, SearchContacts);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchContacts).call(this, props));
    _this.state = {
      edited: false,
      search: ''
    };
    _this.handleSearchChange = _this.handleSearchChange.bind(_assertThisInitialized(_this));
    _this.handleSearch = _this.handleSearch.bind(_assertThisInitialized(_this));
    _this.handleClear = _this.handleClear.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SearchContacts, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.state.edited) {
        this.setState({
          search: '',
          edited: false
        });
        this.props.onSearchContacts(tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
      }
    }
  }, {
    key: "handleSearchChange",
    value: function handleSearchChange(e) {
      this.setState({
        search: e.target.value
      });
    }
  }, {
    key: "handleSearch",
    value: function handleSearch(e) {
      e.preventDefault();
      var query = this.state.search.trim();
      this.setState({
        edited: query.length > 0
      });
      this.props.onSearchContacts(query.length > 0 ? query : tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
    }
  }, {
    key: "handleClear",
    value: function handleClear() {
      if (this.state.edited) {
        this.props.onSearchContacts(tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default.a.DEL_CHAR);
      }

      this.setState({
        search: '',
        edited: false
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.key === 'Enter') {
        this.handleSearch(e);
      } else if (e.key === 'Escape') {
        this.handleClear();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons search"
      }, "search"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "search_placeholder",
        defaultMessage: "List like email:alice@example.com, tel:17025550003..."
      }, function (search_placeholder) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          className: "search",
          type: "text",
          placeholder: search_placeholder,
          value: _this2.state.search,
          onChange: _this2.handleSearchChange,
          onKeyDown: _this2.handleKeyDown,
          required: true,
          autoFocus: true
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.handleClear
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "close"))));
    }
  }]);

  return SearchContacts;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/send-message.jsx":
/*!**************************************!*\
  !*** ./src/widgets/send-message.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tinode-sdk */ "../tinode-js/umd/tinode.prod.js");
/* harmony import */ var tinode_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/blob-helpers.js */ "./src/lib/blob-helpers.js");
/* harmony import */ var _lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/strformat.js */ "./src/lib/strformat.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var messages = Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["defineMessages"])({
  'messaging_disabled': {
    "id": "messaging_disabled_prompt",
    "defaultMessage": "Messaging disabled"
  },
  'type_new_message': {
    "id": "new_message_prompt",
    "defaultMessage": "New message"
  },
  'file_attachment_too_large': {
    "id": "file_attachment_too_large",
    "defaultMessage": "The file size {size} exceeds the {limit} limit."
  },
  'cannot_initiate_upload': {
    "id": "cannot_initiate_file_upload",
    "defaultMessage": "Cannot initiate file upload."
  }
});

var SendMessage = function (_React$PureComponent) {
  _inherits(SendMessage, _React$PureComponent);

  function SendMessage(props) {
    var _this;

    _classCallCheck(this, SendMessage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SendMessage).call(this, props));
    _this.state = {
      message: '',
      keypressTimestamp: new Date().getTime() - _config_js__WEBPACK_IMPORTED_MODULE_3__["KEYPRESS_DELAY"] - 1
    };
    _this.handlePasteEvent = _this.handlePasteEvent.bind(_assertThisInitialized(_this));
    _this.handleAttachImage = _this.handleAttachImage.bind(_assertThisInitialized(_this));
    _this.handleAttachFile = _this.handleAttachFile.bind(_assertThisInitialized(_this));
    _this.handleSend = _this.handleSend.bind(_assertThisInitialized(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind(_assertThisInitialized(_this));
    _this.handleMessageTyping = _this.handleMessageTyping.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SendMessage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.messageEditArea.addEventListener('paste', this.handlePasteEvent, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.messageEditArea.removeEventListener('paste', this.handlePasteEvent, false);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.messageEditArea.focus();
    }
  }, {
    key: "handlePasteEvent",
    value: function handlePasteEvent(e) {
      var _this2 = this;

      if (this.props.disabled) {
        return;
      }

      if (Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["filePasted"])(e, function (bits, mime, width, height, fname) {
        _this2.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].insertImage(null, 0, mime, bits, width, height, fname));
      }, function (mime, bits, fname) {
        _this2.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachFile(null, mime, bits, fname));
      }, this.props.onError)) {
        e.preventDefault();
      }
    }
  }, {
    key: "handleAttachImage",
    value: function handleAttachImage(e) {
      var _this3 = this;

      if (e.target.files && e.target.files.length > 0) {
        var file = e.target.files[0];

        if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_INBAND_ATTACHMENT_SIZE"] || _lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["SUPPORTED_IMAGE_FORMATS"].indexOf(file.type) < 0) {
          Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["imageFileScaledToBase64"])(file, _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_IMAGE_DIM"], _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_IMAGE_DIM"], false, function (bits, mime, width, height, fname) {
            _this3.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].insertImage(null, 0, mime, bits, width, height, fname));
          }, function (err) {
            _this3.props.onError(err, 'err');
          });
        } else {
          Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["imageFileToBase64"])(file, function (bits, mime, width, height, fname) {
            _this3.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].insertImage(null, 0, mime, bits, width, height, fname));
          }, function (err) {
            _this3.props.onError(err, 'err');
          });
        }
      }

      e.target.value = '';
    }
  }, {
    key: "handleAttachFile",
    value: function handleAttachFile(e) {
      var _this4 = this;

      var formatMessage = this.props.intl.formatMessage;

      if (e.target.files && e.target.files.length > 0) {
        var file = e.target.files[0];

        if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_EXTERN_ATTACHMENT_SIZE"]) {
          this.props.onError(formatMessage(messages.file_attachment_too_large, {
            size: Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__["bytesToHumanSize"])(file.size),
            limit: Object(_lib_strformat_js__WEBPACK_IMPORTED_MODULE_5__["bytesToHumanSize"])(_config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_EXTERN_ATTACHMENT_SIZE"])
          }), 'err');
        } else if (file.size > _config_js__WEBPACK_IMPORTED_MODULE_3__["MAX_INBAND_ATTACHMENT_SIZE"]) {
          var uploader = this.props.tinode.getLargeFileHelper();

          if (!uploader) {
            this.props.onError(formatMessage(messages.cannot_initiate_upload));
            return;
          }

          var uploadCompletionPromise = uploader.upload(file);
          var msg = tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachFile(null, file.type, null, file.name, file.size, uploadCompletionPromise);
          this.props.sendMessage(msg, uploadCompletionPromise, uploader);
        } else {
          Object(_lib_blob_helpers_js__WEBPACK_IMPORTED_MODULE_4__["fileToBase64"])(file, function (mime, bits, fname) {
            _this4.props.sendMessage(tinode_sdk__WEBPACK_IMPORTED_MODULE_2__["Drafty"].attachFile(null, mime, bits, fname));
          }, this.props.onError);
        }
      }

      e.target.value = '';
    }
  }, {
    key: "handleSend",
    value: function handleSend() {
      var message = this.state.message.trim();

      if (message) {
        this.props.sendMessage(this.state.message.trim());
        this.setState({
          message: ''
        });
      }
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          this.handleSend();
        }
      }
    }
  }, {
    key: "handleMessageTyping",
    value: function handleMessageTyping(e) {
      var newState = {
        message: e.target.value
      };
      var now = new Date().getTime();

      if (now - this.state.keypressTimestamp > _config_js__WEBPACK_IMPORTED_MODULE_3__["KEYPRESS_DELAY"]) {
        var topic = this.props.tinode.getTopic(this.props.topic);

        if (topic.isSubscribed()) {
          topic.noteKeyPress();
        }

        newState.keypressTimestamp = now;
      }

      this.setState(newState);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var formatMessage = this.props.intl.formatMessage;
      var prompt = this.props.disabled ? formatMessage(messages.messaging_disabled) : formatMessage(messages.type_new_message);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "send-message-panel"
      }, this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons disabled"
      }, "photo") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: function onClick(e) {
          _this5.attachImage.click();
        },
        title: "Add image"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons secondary"
      }, "photo")), this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons disabled"
      }, "attach_file") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: function onClick(e) {
          _this5.attachFile.click();
        },
        title: "Attach file"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons secondary"
      }, "attach_file")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        id: "sendMessage",
        placeholder: prompt,
        disabled: this.props.disabled,
        value: this.state.message,
        onChange: this.handleMessageTyping,
        onKeyPress: this.handleKeyPress,
        ref: function ref(_ref) {
          _this5.messageEditArea = _ref;
        },
        autoFocus: true
      }), this.props.disabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons disabled"
      }, "send") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        onClick: this.handleSend,
        title: "Send"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "send")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        ref: function ref(_ref2) {
          _this5.attachFile = _ref2;
        },
        onChange: this.handleAttachFile,
        style: {
          display: 'none'
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        ref: function ref(_ref3) {
          _this5.attachImage = _ref3;
        },
        accept: "image/*",
        onChange: this.handleAttachImage,
        style: {
          display: 'none'
        }
      }));
    }
  }]);

  return SendMessage;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

;
/* harmony default export */ __webpack_exports__["default"] = (Object(react_intl__WEBPACK_IMPORTED_MODULE_1__["injectIntl"])(SendMessage));

/***/ }),

/***/ "./src/widgets/side-navbar.jsx":
/*!*************************************!*\
  !*** ./src/widgets/side-navbar.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SideNavbar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letter-tile.jsx */ "./src/widgets/letter-tile.jsx");
/* harmony import */ var _menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./menu-cancel.jsx */ "./src/widgets/menu-cancel.jsx");
/* harmony import */ var _menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu-contacts.jsx */ "./src/widgets/menu-contacts.jsx");
/* harmony import */ var _menu_start_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu-start.jsx */ "./src/widgets/menu-start.jsx");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var SideNavbar = function (_React$PureComponent) {
  _inherits(SideNavbar, _React$PureComponent);

  function SideNavbar() {
    _classCallCheck(this, SideNavbar);

    return _possibleConstructorReturn(this, _getPrototypeOf(SideNavbar).apply(this, arguments));
  }

  _createClass(SideNavbar, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "side-caption-panel",
        className: "caption-panel"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "self-avatar",
        className: "avatar-box"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_letter_tile_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        avatar: this.props.avatar,
        topic: this.props.myUserId,
        title: this.props.title
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "sidepanel-title",
        className: "panel-title"
      }, this.props.title), this.props.state === 'login' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_start_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onSignUp: this.props.onSignUp,
        onSettings: this.props.onSettings
      }) : this.props.state === 'contacts' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_contacts_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], {
        onNewTopic: this.props.onNewTopic,
        onSettings: this.props.onSettings
      }) : null, this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_menu_cancel_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
        onCancel: this.props.onCancel
      }) : null);
    }
  }]);

  return SideNavbar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/tag-manager.jsx":
/*!*************************************!*\
  !*** ./src/widgets/tag-manager.jsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TagManager; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-intl */ "react-intl");
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chip-input.jsx */ "./src/widgets/chip-input.jsx");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./src/config.js");
/* harmony import */ var _lib_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/utils.js */ "./src/lib/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var TagManager = function (_React$Component) {
  _inherits(TagManager, _React$Component);

  function TagManager(props) {
    var _this;

    _classCallCheck(this, TagManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TagManager).call(this, props));
    _this.state = {
      tags: _this.props.tags,
      tagInput: '',
      activated: _this.props.activated
    };
    _this.handleShowTagManager = _this.handleShowTagManager.bind(_assertThisInitialized(_this));
    _this.handleTagInput = _this.handleTagInput.bind(_assertThisInitialized(_this));
    _this.handleAddTag = _this.handleAddTag.bind(_assertThisInitialized(_this));
    _this.handleRemoveTag = _this.handleRemoveTag.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TagManager, [{
    key: "handleShowTagManager",
    value: function handleShowTagManager() {
      this.setState({
        activated: true
      });
    }
  }, {
    key: "handleTagInput",
    value: function handleTagInput(text) {
      this.setState({
        tagInput: text
      });

      if (text.length > 0) {
        var last = text[text.length - 1];

        if (text[0] == '"') {
          if (text.length > 1 && last == '"') {
            this.handleAddTag(text.substring(1, text.length - 1));
          }
        } else if (last == ',' || last == ' ' || last == ';' || last == '"') {
          this.handleAddTag(text.substring(0, text.length - 1).trim());
        }
      }
    }
  }, {
    key: "handleAddTag",
    value: function handleAddTag(tag) {
      if (tag.length > 0) {
        var tags = this.state.tags.slice(0);
        tags.push(tag);
        this.setState({
          tags: tags,
          tagInput: ''
        });

        if (this.props.onTagsChanged) {
          this.props.onTagsChanged(tags);
        }

        return tags;
      }

      return this.state.tags;
    }
  }, {
    key: "handleRemoveTag",
    value: function handleRemoveTag(tag, index) {
      var tags = this.state.tags.slice(0);
      tags.splice(index, 1);
      this.setState({
        tags: tags
      });

      if (this.props.onTagsChanged) {
        this.props.onTagsChanged(tags);
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      this.props.onSubmit(this.handleAddTag(this.state.tagInput.trim()));
      this.setState({
        activated: false,
        tags: this.props.tags
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.setState({
        activated: false,
        tagInput: '',
        tags: this.props.tags
      });

      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var tags = [];

      if (this.state.activated) {
        this.state.tags.map(function (tag) {
          tags.push({
            user: tag,
            invalid: tag.length < _config_js__WEBPACK_IMPORTED_MODULE_3__["MIN_TAG_LENGTH"]
          });
        });
      } else {
        this.state.tags.map(function (tag) {
          tags.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
            className: "badge",
            key: tags.length
          }, tag));
        });

        if (tags.length == 0) {
          tags = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
            id: "tags_not_found",
            defaultMessage: "No tags defined. Add some."
          }));
        }
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-column"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "small"
      }, this.props.title)), this.state.activated ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "tags_editor_no_tags",
        defaultMessage: "Add some tags"
      }, function (add_tags_prompt) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_chip_input_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
          chips: tags,
          avatarDisabled: true,
          prompt: add_tags_prompt,
          onEnter: _this2.handleAddTag,
          onFocusLost: _this2.handleAddTag,
          onCancel: _this2.handleCancel,
          onChipRemoved: _this2.handleRemoveTag,
          filterFunc: _this2.handleTagInput
        });
      }), this.props.onSubmit || this.props.onCancel ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "tag-manager-buttons",
        className: "panel-form-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "blue",
        onClick: this.handleSubmit
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_ok",
        defautMessage: "OK",
        description: "Confirmation button [OK]"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "white",
        onClick: this.handleCancel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "button_cancel",
        defautMessage: "Cancel",
        description: "Rejection button [Cancel]"
      }))) : null) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "javascript:;",
        className: "flat-button",
        onClick: this.handleShowTagManager
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons"
      }, "edit"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_1__["FormattedMessage"], {
        id: "title_manage_tags",
        defaultMessage: "Manage tags"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, tags)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (!Object(_lib_utils_js__WEBPACK_IMPORTED_MODULE_4__["arrayEqual"])(nextProps.tags, prevState.tags) && !prevState.activated) {
        return {
          tags: nextProps.tags
        };
      }

      return null;
    }
  }]);

  return TagManager;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


;

/***/ }),

/***/ "./src/widgets/unread-badge.jsx":
/*!**************************************!*\
  !*** ./src/widgets/unread-badge.jsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UnreadBadge; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var UnreadBadge = function (_React$PureComponent) {
  _inherits(UnreadBadge, _React$PureComponent);

  function UnreadBadge() {
    _classCallCheck(this, UnreadBadge);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnreadBadge).apply(this, arguments));
  }

  _createClass(UnreadBadge, [{
    key: "render",
    value: function render() {
      return this.props.count > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "unread"
      }, this.props.count > 9 ? "9+" : this.props.count) : null;
    }
  }]);

  return UnreadBadge;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);


;

/***/ }),

/***/ "./src/widgets/visible-password.jsx":
/*!******************************************!*\
  !*** ./src/widgets/visible-password.jsx ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return VisiblePassword; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var VisiblePassword = function (_React$PureComponent) {
  _inherits(VisiblePassword, _React$PureComponent);

  function VisiblePassword(props) {
    var _this;

    _classCallCheck(this, VisiblePassword);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VisiblePassword).call(this, props));
    _this.state = {
      value: _this.props.value,
      visible: false
    };
    _this.handleVisibility = _this.handleVisibility.bind(_assertThisInitialized(_this));
    _this.handeTextChange = _this.handeTextChange.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.handleEditingFinished = _this.handleEditingFinished.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(VisiblePassword, [{
    key: "handeTextChange",
    value: function handeTextChange(e) {
      this.setState({
        value: e.target.value
      });

      if (this.props.onChange) {
        this.props.onChange(e);
      }
    }
  }, {
    key: "handleVisibility",
    value: function handleVisibility(e) {
      e.preventDefault();
      this.setState({
        visible: !this.state.visible
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode == 27) {
        this.setState({
          value: this.props.value,
          visible: false
        });

        if (this.props.onFinished) {
          this.props.onFinished();
        }
      } else if (e.keyCode == 13) {
        this.handleEditingFinished();
      }
    }
  }, {
    key: "handleEditingFinished",
    value: function handleEditingFinished(e) {
      var _this2 = this;

      if (e) {
        var currentTarget = e.currentTarget;
        setTimeout(function () {
          if (!currentTarget.contains(document.activeElement)) {
            if (_this2.props.onFinished) {
              _this2.props.onFinished(_this2.state.value);
            }
          }
        }, 0);
      } else if (this.props.onFinished) {
        this.props.onFinished(this.state.value.trim());
      }
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        tabIndex: "-1",
        className: "group-focus",
        onBlur: this.handleEditingFinished
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "with-visibility",
        type: this.state.visible ? "text" : "password",
        value: this.state.value,
        placeholder: this.props.placeholder,
        required: this.props.required ? 'required' : '',
        autoFocus: this.props.autoFocus ? 'autoFocus' : '',
        autoComplete: this.props.autoComplete,
        onChange: this.handeTextChange,
        onKeyDown: this.handleKeyDown
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        onClick: this.handleVisibility
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "material-icons clickable light-gray"
      }, this.state.visible ? 'visibility' : 'visibility_off')));
    }
  }]);

  return VisiblePassword;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);



/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ }),

/***/ "firebase/app":
/*!***************************!*\
  !*** external "firebase" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = firebase;

/***/ }),

/***/ "firebase/messaging":
/*!*****************************************!*\
  !*** external ["firebase","messaging"] ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = firebase["messaging"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),

/***/ "react-intl":
/*!****************************!*\
  !*** external "ReactIntl" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ReactIntl;

/***/ })

/******/ });
//# sourceMappingURL=index.dev.js.map