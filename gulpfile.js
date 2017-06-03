var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    bourbon = require('node-bourbon'),
    autoprefixer = require('gulp-autoprefixer'),
    ftp = require('vinyl-ftp'),
    gutil = require('gulp-util');

gulp.task('sass', function() {
  return gulp.src(['app/sass/**.sass', 'app/sass/**.scss'])
  .pipe(sass({
      includePaths: bourbon.includePaths
  }).on("error", sass.logError))
  .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(cssnano())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
  return gulp.src(['app/libs/jquery-3.2.1.min.js',
    'app/libs/jquery.mmenu.all.min.js',
    'app/libs/owl.carousel.min.js',
    'app/libs/fotorama.js',
    'app/libs/jquery.malihu.PageScroll2id.min.js',
    'app/js/main.js'])
  .pipe(concat('scripts.min.js'))
  // .pipe(uglify()) 
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('css-libs', function() {
  return gulp.src(['app/libs/*.css'])
  .pipe(concatCss('libs.min.css'))
  .pipe(gulp.dest('app/css'));
});

gulp.task('deploy', function() {

  var conn = ftp.create({
    host: 'alex210.s-host.net',
    user: 'punsckxk',
    password: 'I78p7mth4S',
    parallel: 10,
    log: gutil.log
  });

  var globs = [
  'dist/**',
  'dist/.htaccess',
  ];
  return gulp.src(globs, {buffer: false})
  .pipe(conn.dest('/public_html'));

});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('default', ['browser-sync', 'css-libs', 'sass', 'scripts'], function() {
  gulp.watch(['app/sass/**.sass', 'app/sass/**.scss'], ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/main.js', ['scripts']);
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('imagemin', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'imagemin', 'sass', 'scripts', 'css-libs'], function() {

  gulp.src(['app/css/*.css'])
  .pipe(gulp.dest('dist/css'));

  gulp.src(['app/fonts/**/*'])
  .pipe(gulp.dest('dist/fonts'));

  gulp.src(['app/js/*.js'])
  .pipe(gulp.dest('dist/js'));

  gulp.src(['app/*.html', 'app/.htaccess'])
  .pipe(gulp.dest('dist'));
});

gulp.task('clear', function() {
  return cache.clearAll();
});
