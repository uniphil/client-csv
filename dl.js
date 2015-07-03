// feature detect
var hasDownload = (typeof document.createElement('a').download !== 'undefined'),
    ieSave = (window.navigator.msSaveOrOpenBlob !== undefined);  // IE10+


/**
 * Raw UTF-16 bytes for a file from a string
 */
function u16le(str) {
  // mark that this file is little-endian utf-16
  var bom = [0xFF, 0xFE];

  // Extract the u16 character codes
  var u16nums = [];
  for (var i = 0; i < str.length; i++) {
    u16nums[i] = str.charCodeAt(i);
  }

  // transform them into byte pairs
  var bytePairNums = u16nums.map(function(num) {
    return [num & 0xFF,  // mask for lower bits
            num >> 8];  // grab higher bits
  })

  // put the BOM in front
  bytePairNums.unshift(bom);

  // bytes to string of chars
  return bytePairNums
    .reduce(function(a, b) { return a.concat(b); })  // flatten
    .map(function(b) { return String.fromCharCode(b); })
    .join('');
}


/**
 * Get a data-URL
 */
function dataPrefix(encoding, raw) {
  return 'data:text/plain;' + encoding + ',' + raw;
}


/**
 * Get a data-URL suitable for client-side file download
 */
function toDataURL(data) {
  return dataPrefix('base64', btoa(u16le(data)));
}


/**
 * Get a string as an UTF-16 arraybuffer, for IE10+
 */
function toArrayBuff(str) {
  var buf = new ArrayBuffer(str.length * 2 + 2);  // extra two bytes for the BOM
  var bView = new Uint16Array(buf);
  bView[0] = 0xFEFF;  // utf-16 BE
  for (var i=0; i < str.length; i++) {
    bView[i+1] = str.charCodeAt(i);  // offset 1 (two bytes because UTF-16) for BOM
  }
  return bView;
}


/**
 * Get a binary string as a U8 ArrayBuffer
 */
function toU8Buff(str) {
  var out = new Uint8Array(str.length);
  for (var i=0; i < str.length; i++) {
    out[i] = str.charCodeAt(i);
  }
  return out;
}


function textEncoder(str) {
  return {
    asDataURL: function() {
      return toDataURL(str);
    },
    asBlob: function() {
      return new Blob([toArrayBuff(str)]);
    },
  };
}


function canvasEncoder(cv) {
  return {
    asDataURL: function() {
      return cv.toDataURL('image/png');
    },
    asBlob: function() {  // use toDataURL because toBlob is async
      var binStr = atob(this.asDataURL().split(',')[1]);
      return new Blob([toU8Buff(binStr)], {type: 'image/png'});
    },
  };
}


var encoders = {
  text: textEncoder,
  canvas: canvasEncoder,
};


function clickDownload(link, cb) {
  link.addEventListener('click', function download(evt) {
    var stuff = cb(encoders);

    if (hasDownload) {
      link.setAttribute('download', stuff.filename);
      link.href = stuff.contents.asDataURL();

    } else if (ieSave) {
      evt.preventDefault();
      window.navigator.msSaveOrOpenBlob(stuff.contents.asBlob(), stuff.filename);

    } else {
      throw new Error('Please upgrade to a modern browser to download files');
    }

  });
}


module.exports = clickDownload;
