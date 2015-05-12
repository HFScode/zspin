'use strict';

var gulp       = require('gulp');
var gu_concat  = require('gulp-concat');
var gu_uglify  = require('gulp-uglify');
var gu_minify  = require('gulp-minify-css');
var gu_sass    = require('gulp-sass');
var gu_tpls    = require('gulp-angular-templatecache');
var gu_lr      = require('gulp-livereload');
var gu_install = require('gulp-install');

var vendors = {
  'scripts': [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jswheel/jswheel.js',
    'bower_components/toastr/toastr.js',
    'bower_components/angular/angular.js',
    'bower_components/ng-load/ng-load.js',
    'bower_components/ng-resize/ngresize.js',
    'bower_components/angular-route/angular-route.js',
    // 'bower_components/angular-gamepad/dist/angular-gamepad.js', // Fixme
    'bower_components/angular-hotkeys/build/hotkeys.js',
    'bower_components/gsap/src/uncompressed/TweenLite.js',
    'bower_components/gsap/src/uncompressed/plugins/CSSPlugin.js',
    'bower_components/gsap/src/uncompressed/jquery.gsap.js',
    'bower_components/json-formatter/dist/json-formatter.js',
  ],
  'styles': [
    'bower_components/skeleton/css/normalize.css',
    'bower_components/skeleton/css/skeleton.css',
    'bower_components/json-formatter/dist/json-formatter.css',
    'bower_components/toastr/toastr.css',
  ],
  'fonts': [
//    'bower_components/bootstrap/dist/fonts/*', // * preserve dir structure
  ]
};

gulp.task('vendors:scripts', function() {
  return gulp.src(vendors.scripts)
    .pipe(gu_concat('vendors.js'))
    .pipe(gu_uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('vendors:styles', function() {
  return gulp.src(vendors.styles)
    .pipe(gu_concat('vendors.css'))
    .pipe(gu_minify())
    .pipe(gulp.dest('build/css'));
});

gulp.task('vendors:fonts', function() {
  return gulp.src(vendors.fonts)
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('vendors', ['vendors:scripts', 'vendors:styles' ,'vendors:fonts']);

/************************************ App ************************************/

var app = {
  'statics': [
    'app_statics/**/*',
  ],
  'scripts': [
    'app_sources/**/*.js',
    'app_sources/index.js',
  ],
  'styles': [
    'app_sources/**/*.scss',
  ],
  'templates': [
    'app_sources/templates/*.html',
    'app_sources/**/*.html',
  ]
};

gulp.task('app:statics', function() {
  return gulp.src(app.statics)
    .pipe(gulp.dest('build'))
    .pipe(gu_install());
});

gulp.task('app:scripts', function() {
  return gulp.src(app.scripts)
    .pipe(gu_concat('app.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('app:styles', function() {
  return gulp.src(app.styles)
    .pipe(gu_sass({
      errLogToConsole: true,
      sourceComments: 'map',
      sourceMap: 'sass'
    }))
    .pipe(gu_concat('app.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('app:templates', function() {
  return gulp.src(app.templates)
    .pipe(gu_tpls({standalone: true}))
    .pipe(gu_concat('app.tpls.js'))
    .pipe(gulp.dest('build/js'));
});


gulp.task('app', ['app:statics', 'app:scripts', 'app:styles', 'app:templates']);

/*********************************** Watch ***********************************/

gulp.task('watch', ['default'], function() {
  gu_lr.listen();
  gulp.watch(app.statics,   ['app:statics']);
  gulp.watch(app.styles,    ['app:styles']);
  gulp.watch(app.scripts,   ['app:scripts']);
  gulp.watch(app.templates, ['app:templates']);
  gulp.watch('build/**').on('change', gu_lr.changed);
});

gulp.task('default', ['vendors', 'app']);

