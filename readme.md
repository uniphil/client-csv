Client CSV
==========


No-flash client-side helpers for downloading CSVs that Just Work.

A number of strategies increase the likliness that you can open the CSV in Microsoft Excel without using the Import Wizzard:

- The file is UTF-16 encoded _with a BOM_. For some reason, this works. Thanks Microsoft.

I guess that's about it.

On cool browsers, the `download` attribute of your `<a>` tag is used to trigger the download, and the file content is injected as a `data-url`. Apparently this can have problems for files bigger than 2MB, but I haven't hit any yet, so...

On Internet Explorere 10+, which does not recognize the `download` attribute, `msSaveOrOpenBlob` is used to trigger the download, and the contents are created as a `Blob`. The user may get a warning on pageload. Sorry. Sometimes life sucks.

For other browsers, it explodes, throwing `Error`. whee...


### You should know

- You have to create the CSV as a big string, this library does not help with that. Check out [papa parse](http://papaparse.com/).
- Whether or not the file opens correctly in Microsoft Excel depends on **the Microsoft Excel language settings of the user**. Yeah. Fun. For Americans, delimit your CSV with `tab` characters. Other places you may need commas. Don't you just love Microsoft.



```javascript
var aClickFactory = require('client-csv.')

document.getElementById('downloadLink')
  .addEventListener('click', aClickFactory('blah.csv', function getData() {
    return 'a\tb\t✓\n1\t2\t3\n4\t5\t6';
  }));
```
