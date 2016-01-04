'use strict';
const gulp = require('gulp');
const named = require('vinyl-named');
const run = require('run-sequence');
const del = require('del');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
$.webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

const src = {
  webpack: ['src/client.js'],
  css: ['src/styles/**/*.css', '!src/styles/**/_*.css', ]
};
const tmp = {
  js: '.tmp/scripts',
  css: '.tmp/styles',
  lib: '.tmp/lib'
};
const dist = {
  js: 'dist/scripts',
  css: 'dist/styles'
};

gulp.task('default', ['start']);
gulp.task('start', done => {
  run('clean', ['start-server', 'watch'], done);
});
gulp.task('watch', ['webpack:watch', 'postcss:watch']);
gulp.task('build', done => {
  run('clean', ['webpack:min', 'postcss:min'], done);
});

gulp.task('start-server', done => {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'dist', 'public'],
    },
    files: [
      '.tmp/**/*.{js,css}',
      'dist/**/*.{js,css}',
      'public/**/*.{html,js,css,jpeg,jpg,png,gif,svg}'
    ]
  });
});

gulp.task('webpack', () => {
  return gulp.src(src.webpack)
    .pipe(named())
    .pipe($.webpack(webpackConfig))
    .pipe(gulp.dest(tmp.js));
});

gulp.task('webpack:watch', () => {
  const config = Object.assign(webpackConfig, { watch: true });
  return gulp.src(src.webpack)
    .pipe(named())
    .pipe($.webpack(config))
    .pipe(gulp.dest(tmp.js));
});

gulp.task('webpack:min', () => {
  const plugins = [new UglifyJsPlugin()];
  const devtool = false;
  const config = Object.assign(webpackConfig, { plugins, devtool });
  return gulp.src(src.webpack)
    .pipe(named())
    .pipe($.webpack(config))
    .pipe(gulp.dest(dist.js));
});

gulp.task('postcss', () => {
  const plugins = [
    require('autoprefixer'),
    require('precss')
  ];
  return gulp.src(src.css)
    .pipe($.sourcemaps.init())
    .pipe($.postcss(plugins))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(tmp.css));
});

gulp.task('postcss:watch', ['postcss'], () => {
  gulp.watch(src.css, ['postcss']);
});

gulp.task('postcss:min', () => {
  const plugins = [
    require('autoprefixer'),
    require('precss'),
    require('cssnano')
  ];
  return gulp.src(src.css)
    .pipe($.postcss(plugins))
    .pipe(gulp.dest(dist.css));
});

const libs = [
  'node_modules/es6-promise/dist/es6-promise.min.js'
];
gulp.task('copy', () => gulp.src(libs).pipe(gulp.dest(tmp.lib)));

gulp.task('clean', () => del(['.tmp', 'dist']));
