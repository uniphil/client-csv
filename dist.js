(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var hasDownload=typeof document.createElement("a").download!=="undefined",ieSave=window.navigator.msSaveOrOpenBlob!==undefined;function u16le(str){var bom=[255,254];var u16nums=[];for(var i=0;i<str.length;i++){u16nums[i]=str.charCodeAt(i)}var bytePairNums=u16nums.map(function(num){return[num&255,num>>8]});bytePairNums.unshift(bom);return bytePairNums.reduce(function(a,b){return a.concat(b)}).map(function(b){return String.fromCharCode(b)}).join("")}function dataPrefix(encoding,raw){return"data:text/plain;"+encoding+","+raw}function toDataURL(data){return dataPrefix("base64",btoa(u16le(data)))}function toArrayBuff(str){var buf=new ArrayBuffer(str.length*2+2);var bView=new Uint16Array(buf);bView[0]=65279;for(var i=0;i<str.length;i++){bView[i+1]=str.charCodeAt(i)}return bView}function toU8Buff(str){var out=new Uint8Array(str.length);for(var i=0;i<str.length;i++){out[i]=str.charCodeAt(i)}return out}function textEncoder(str){return{asDataURL:function(){return toDataURL(str)},asBlob:function(){return new Blob([toArrayBuff(str)])}}}function canvasEncoder(cv){return{asDataURL:function(){return cv.toDataURL("image/png")},asBlob:function(){var binStr=atob(this.asDataURL().split(",")[1]);return new Blob([toU8Buff(binStr)],{type:"image/png"})}}}var encoders={text:textEncoder,canvas:canvasEncoder};function clickDownload(link,cb){link.addEventListener("click",function download(evt){var stuff=cb(encoders);if(hasDownload){link.setAttribute("download",stuff.filename);link.href=stuff.contents.asDataURL()}else if(ieSave){evt.preventDefault();window.navigator.msSaveOrOpenBlob(stuff.contents.asBlob(),stuff.filename)}else{throw new Error("Please upgrade to a modern browser to download files")}})}module.exports=clickDownload},{}]},{},[1]);
