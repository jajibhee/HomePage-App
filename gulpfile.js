const gulp = require('gulp');
const pug = require('gulp-pug2');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const iconfont = require('gulp-iconfont');
const iconfontCSS = require('gulp-iconfont-css');
const imagemin = require('gulp-imagemin');

/* ---------------------------------------------------------------
 *  Settings
 *  -------------------------------------------------------------*/
// All source files and folders are placed in the "src" directory,
// the processed files will be compiled to the "dist" folder

// The constants below specify the directory for the different
// languages handled by gulp

const settings = {
  pug: {
    src: 'src/pug',
    dist: 'dist',
  },
  sass: {
    src: 'src/sass',
    dist: 'dist/assets/css',
    includePaths: ['node_modules/foundation-sites/scss'],
    outputStyle: 'compressed',
  },
  js: {
    src: 'src/js',
    dist: 'dist/assets/js',
  },
  fonts: {
    src: 'src/fonts',
    dist: 'dist/assets/fonts',
  },
  img: {
    src: 'src/img',
    dist: 'dist/assets/img',
  },
  iconfont: {
    src: 'src/iconfonts',
    path: 'src/icon-font-template.scss',
    dist: 'dist/assets/fonts',
    fontName: 'iconfonts',
    targetPath: '../../../src/sass/components/iconfonts.scss', // The path where the (S)CSS file should be saved, relative to the path used in gulp.dest() (optional, defaults to _icons.css).
    fontPath: '/assets/fonts/' // Directory of font files relative to generated (S)CSS file (optional, defaults to ./)
  }
};

/* ---------------------------------------------------------------
 *  Gulp Tasks
 *  -------------------------------------------------------------*/

/**
 * Pug Tasks
 */
gulp.task('pug', () => {
  return gulp
    .src(`${settings.pug.src}/**/*.pug`)
    .pipe(plumber({
      errorHandler: onError
    }))
    .on('error', onError)
    .pipe(pug())
    .pipe(gulp.dest(`${settings.pug.dist}`));
});

// Converts SVG icons placed in the SVG source directory to icon fonts
gulp.task('iconfont', () => {
  return gulp
    .src(`${settings.iconfont.src}/**/*.svg`)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(iconfontCSS({
      path: settings.iconfont.path,
      fontName: settings.iconfont.fontName,
      targetPath: settings.iconfont.targetPath,
      fontPath: settings.iconfont.fontPath
    }))
    .pipe(iconfont({
      fontName: settings.iconfont.fontName,
      // prependUnicode: true,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      timestamp: Math.round(Date.now() / 1000),
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest(`${settings.iconfont.dist}`))
})

/**
 * Sass Tasks
 * Compiles sass files to css and auto-inject into browsers
 */
gulp.task('sass', () => {
  return gulp
    .src(`${settings.sass.src}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: onError
    }))
    .on('error', onError)
    .pipe(
      sass({
        outputStyle: settings.sass.outputStyle,
        includePaths: settings.sass.includePaths,
      }),
    )
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./sass-maps'))
    .pipe(gulp.dest(settings.sass.dist))
    .pipe(browserSync.stream());
});

// Copy fonts
gulp.task('fonts', () => {
  return gulp
    .src(`${settings.fonts.src}/**/*.*`)
    .pipe(gulp.dest(settings.fonts.dist));
});


// Copy Images
gulp.task('images', () => {
  return gulp
    .src(`${settings.img.src}/**/*.*`)
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ], {
      verbose: true
    }))
    .pipe(gulp.dest(settings.img.dist));
});

// Copy JS
// gulp.task('js', () => {
//   return gulp
//     .src(`${settings.js.src}/**/*.*`)
//     .pipe(gulp.dest(settings.js.dist));
// });

// Default Task

gulp.task('serve', ['pug', 'sass', 'fonts', 'images', 'iconfont'], function () {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  // Watch pugfile and transpile
  gulp.watch(`${settings.pug.src}/**/*.pug`, ['pug']);

  // Watch sass files
  gulp.watch(`${settings.sass.src}/**/*.scss`, ['sass']);

  // Watch font files
  gulp.watch(`${settings.fonts.src}/**/*.*`, ['fonts']);

  // Watch image files
  gulp.watch(`${settings.img.src}/**/*.*`, ['images']);

  // Watch icon files
  gulp.watch(`${settings.iconfont.src}/**/*.*`, ['iconfont']);

  // Watch html files and reload
  gulp.watch(`${settings.pug.dist}/**/*.html`).on('change', browserSync.reload);

  // Watch JS files and reload
  gulp.watch(`${settings.js.dist}/**/*.js`).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);

// Utility Functions -----------------------------------------------------
// Task error handler
const onError = function (error, message) {
  notify({
    title: 'Error in Build',
    message: error.message,
  }).write(error);

  gutil.log(gutil.colors.bgRed(error.message));
  this.emit('end');
};