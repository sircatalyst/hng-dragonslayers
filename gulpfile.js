'use strict';

const { src, dest, series, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const eslint = require('gulp-eslint');

const { init, reload, stream } = require('browser-sync').create();

// file paths configuration
const paths = {
  app: {
    styles: 'app/css/**/*',
    img: 'app/img/**/*',
    js: 'app/js/**/*',
    html: 'app/*.html'
  },
  dist: {
    styles: 'dist/css',
    js: 'dist/js',
    html: 'dist'
  }
};

/* @description HTML Runner */
function html() {
  const { app, dist } = paths;

  return src(app.html)
    .pipe(dest(dist.html))
    .pipe(stream());
}

/* @description Script Runner */
function scripts() {
  const { app, dist } = paths;

  return src(app.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(dest(dist.js))
    .pipe(stream());
}

/* @description Style runner */
function css() {
  const { app, dist } = paths;
  // postcss plugins
  const plugins = [autoprefixer(), cssnano()];

  return src(app.styles)
    .pipe(postcss(plugins))
    .pipe(dest(dist.styles))
    .pipe(stream());
}

/* @description Watch files for changes */
function watchFiles() {
  const { app } = paths;

  watch(app.styles, css);
  watch(app.js, scripts);
  watch(app.html, html);
  watch([app.html, app.styles, app.js]).on('change', reload);
}

/* @description BrowserSync Server */
function serve() {
  init({
    server: {
      baseDir: './dist'
    }
  });
  watchFiles();
}

exports['dev-server'] = series(css, scripts, html, serve);
