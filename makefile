setup:
	mkdir -p dist/assets/{js,img,css,fonts} && mkdir -p src/{js,img,pug,sass,fonts,iconfonts} && touch src/js/app.js && touch src/sass/app.scss && touch src/pug/index.pug && yarn install
start:
	gulp &! webpack -w