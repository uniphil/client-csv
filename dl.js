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
 * Get a string as an arraybuffer, for IE10+
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
 * Best-case download mechanism: use the `download` property on the <a> tag
 */
function anchorDownload(link, fname, data) {
  link.setAttribute('download', fname);
  link.href = toDataURL(data);
}


/**
 * IE10+ fallback case: use MS's proprietary msSaveOrOpenBlob feature
 */
function ieDownload(fname, data) {
  var blobObj = new Blob([toArrayBuff(data)]);
  window.navigator.msSaveOrOpenBlob(blobObj, fname);
}


/**
 * Download the content
 *
 * This function should be called synchronously in the click handler of an
 * anchor (<a>) element.
 *
 * @param e -- the click event
 * @param fname -- the file name of the downloaded file
 * @param getData -- callback returning a string for the file contents
 * @throws `Error` if the current browser is not supported
 */
function download(e, fname, getData) {
  if (hasDownload) {
    anchorDownload(e.target, fname, getData());
  } else if (ieSave) {
    e.preventDefault();
    ieDownload(fname, getData());
  } else {
    throw new Error('Please upgrade to a modern browser to download files');
  }
}


/**
 * Helper to hook up downloading to a link
 *
 * @params see `download` above
 * @throws `Error`, see `download` above.
 */
function aClickFactory(fname, getData) {
  return function dlHandler(e) {
    return download(e, fname, getData);
  }
}


module.exports = {
  download: download,
  aClickFactory: aClickFactory,
};
