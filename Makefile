all: dist.js

dist.js: dl.js Makefile
	browserify dl.js --standalone clickDownload | uglifyjs > dist.js

