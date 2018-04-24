const gulp = require("gulp");
const pug = require("gulp-pug2");
const gutil = require("gulp-util");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");

/* ---------------------------------------------------------------
*  Settings 
*  -------------------------------------------------------------*/
// All source files and folders are placed in the "src" directory,
// the processed files will be compiled to the "dist" folder

// The constants below specificies the directory for the different
// languages handled by gulp

const settings = {
  pug: {
    src: "src/pug",
    dist: "dist",
  },
  sass: {
    src: "src/sass",
    dist: "dist/assets/css",
    includePaths: ["node_modules/foundation-sites/scss"],
    outputStyle: "compressed",
  },
  js: {
    src: "src/js",
    dist: "dist/assets/js",
  },
  fonts: {
    src: "src/fonts",
    dist: "dist/assets/fonts",
  },
  img: {
    src: "src/img",
    dist: "dist/assets/img",
  },
};

/* ---------------------------------------------------------------
*  Gulp Tasks
*  -------------------------------------------------------------*/

/**
 * Pug Tasks
 */
gulp.task("pug", () => {
  return gulp
    .src(`${settings.pug.src}/**/*.pug`)
    .pipe(plumber({ errorHandler: onError }))
    .on("error", onError)
    .pipe(pug())
    .pipe(gulp.dest(`${settings.pug.dist}`));
});

/**
 * Sass Tasks
 * Compiles sass files to css and auto-inject into browsers
 */
gulp.task("sass", () => {
  return gulp
    .src(`${settings.sass.src}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(plumber({ errorHandler: onError }))
    .on("error", onError)
    .pipe(
      sass({
        outputStyle: settings.sass.outputStyle,
        includePaths: settings.sass.includePaths,
      }),
    )
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./sass-maps"))
    .pipe(gulp.dest(settings.sass.dist))
    .pipe(browserSync.stream());
});

// Copy fonts
gulp.task("fonts", () => {
  return gulp
    .src(`${settings.fonts.src}/**/*.*`)
    .pipe(gulp.dest(settings.fonts.dist));
});

// Copy Images
gulp.task("images", () => {
  return gulp
    .src(`${settings.img.src}/**/*.*`)
    .pipe(gulp.dest(settings.img.dist));
});

// Copy JS
gulp.task("js", () => {
  return gulp
    .src(`${settings.js.src}/**/*.*`)
    .pipe(gulp.dest(settings.js.dist));
});

// Default Task
gulp.task("default", ["pug", "sass", "fonts", "images", "js"], function() {
  // Initialize Browsersync
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  // Watch pugfile and transpile
  gulp.watch(`${settings.pug.src}/**/*.pug`, ["pug"]);

  // Watch sass files
  gulp.watch(`${settings.sass.src}/**/*.scss`, ["sass"]);

  // Watch font files
  gulp.watch(`${settings.fonts.src}/**/*.*`, ["fonts"]);

  // Watch image files
  gulp.watch(`${settings.img.src}/**/*.*`, ["images"]);

  // Watch js files
  gulp.watch(`${settings.js.src}/**/*.js`, ["js"]);

  // Watch html files and reload
  gulp.watch(`${settings.pug.dist}/**/*.html`).on("change", browserSync.reload);

  // Watch JS files and reload
  gulp.watch(`${settings.js.dist}/**/*.js`).on("change", browserSync.reload);
});

// Utility Functions -----------------------------------------------------
// Task error handler
const onError = function(error, message) {
  notify({
    title: "Error in Build",
    message: error.message,
  }).write(error);

  gutil.log(gutil.colors.bgRed(error.message));
  this.emit("end");
};
