'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var es = require('event-stream');

var paths = {
  build: 'build',
  produce: 'client',
  scripts: ['client/**/**/*.js', 'client/**/**/*.js'],
  coffeeScript: ['client/**/**/*.coffee', 'client/**/**/*.coffee'],
  images: 'client/img/**/*',
  sassRoot: ['client/**/**/*.scss', 'client/**/**/*.scss'],
  cssRoot: ['client/**/**/*.css', 'client/**/**/*.css']
};

gulp.task('clean', function() {
  del([paths.build], function(err) {
    console.log('Files deleted');
  });
});

gulp.task('sass-to-css', function(){
  return gulp.src(paths.sassRoot)
    .pipe(sass({sourcemap: true}))
    .pipe(gulp.dest(paths.produce));
});

gulp.task('prefix', ['sass-to-css'], function(){
  return gulp.src(paths.cssRoot)
    .pipe(prefix("last 3 versions"))
    .pipe(gulp.dest(paths.produce));
});

gulp.task('minify-css', ['prefix'], function(){
  return gulp.src(paths.cssRoot)
    //.pipe(sourcemaps.init())
    .pipe(minify())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

gulp.task('coffee-to-js', function() {
  return gulp.src(paths.coffeeScript)
    .pipe(coffee())
    .pipe(gulp.dest(paths.produce));
});

gulp.task('scripts', ['coffee-to-js'], function() {
  return gulp.src(paths.scripts)
    //.pipe(sourcemaps.init())
    .pipe(uglify())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.build+'/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.cssRoot, ['minify-css']);
});

// The dev task (called when you run `gulp` from cli)
gulp.task('dev', ['watch', 'prefix', 'coffee-to-js']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'clean', 'minify-css', 'scripts', 'images']);



