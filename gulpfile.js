const gulp = require('gulp'),
			browserSync = require('browser-sync'),
			sourcemaps = require('gulp-sourcemaps'),
			sass = require('gulp-sass'),
			bourbon = require('node-bourbon'),
			autoprefixer = require('gulp-autoprefixer'),
			cssnano = require('gulp-cssnano'),
			rename = require('gulp-rename'),
			concat = require('gulp-concat'),
			uglify = require('gulp-uglify'),
			babel = require('gulp-babel'),
			del = require('del'),
			imagemin = require('gulp-imagemin'),
			cache = require('gulp-cache');

gulp.task('css-libs', function() {
  return gulp.src(['app/sass/libs.sass'])
  .pipe(sass().on("error", sass.logError))
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function(){
	return gulp.src(['app/sass/*.sass', '!app/sass/libs.sass'])
	.pipe(sourcemaps.init())
	.pipe(sass({
  	includePaths: bourbon.includePaths
  }).on("error", sass.logError))
	.pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8']))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js-libs', function() {
  return gulp.src(['app/libs/jquery/dist/jquery.min.js'])
  .pipe(concat('libs.min.js'))
  .pipe(uglify()) 
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
  return gulp.src(['app/scripts/main.js'])
  .pipe(sourcemaps.init())
  .pipe(babel({
  	presets: ['env'],
  }))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('app/js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('default', ['browser-sync', 'css-libs', 'sass', 'js-libs', 'scripts'], function() {
  gulp.watch(['app/sass/*.sass', '!app/sass/libs.sass'], ['sass']);
  gulp.watch(['app/sass/libs.sass'], ['css-libs']);
  gulp.watch(['app/scripts/*.js'], ['scripts']);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'css-libs', 'sass', 'js-libs', 'scripts', 'img'], function(){

  gulp.src(['app/fonts/**/*'])
  .pipe(gulp.dest('dist/fonts'));

  gulp.src(['app/css/*.min.css'])
  .pipe(gulp.dest('dist/css'));

  gulp.src(['app/js/*.min.js'])
  .pipe(gulp.dest('dist/js'));

  gulp.src(['app/*.html'])
  .pipe(gulp.dest('dist'));

});