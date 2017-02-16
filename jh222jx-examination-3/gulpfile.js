'use strict';
// https://github.com/oskarradon/neat-boilerplate/blob/master/gulpfile.js

var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var jade        = require('gulp-jade');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var browserify  = require('browserify');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var reactify    = require('reactify');
var reload      = browserSync.reload;

// HTML task
gulp.task('html', function(){
  return gulp.src(['./source/jade/*.jade'])
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./debug/'))
});

// Browser-sync task
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./debug/"
    }
  });
});

// SASS task
gulp.task('sass', function() {
  return gulp.src(['./source/sass/*.sass'])
	.pipe(sass({
	  noCache: true
	}))
	.pipe(gulp.dest('./debug/stylesheet'))
});

// JS task
gulp.task('js', function() {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './source/js/app.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle().on('error', gutil.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./debug/javascript/'));
});



// Gulp watch
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('./source/jade/*.jade', ['html', reload]);
  gulp.watch('./source/sass/*.sass', ['sass', reload]);
  gulp.watch('./source/js/*.js', ['js', reload]);
});


gulp.task('default', ['html', 'sass', 'js', 'watch', 'browser-sync'])
