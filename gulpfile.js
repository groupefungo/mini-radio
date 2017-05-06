'use strict';

/*

npm install gulp --save-dev
npm install gulp-sass --save-dev
npm install gulp-sourcemaps --save-dev
npm install gulp-jade --save-dev
npm install gulp-uglify --save-dev
npm install gulp-jsonminify --save-dev
npm install gulp-imagemin --save-dev
npm i -D imagemin-pngquant
npm install gulp-shell --save-dev
npm install del vinyl-paths --save-dev
npm install gulp-zip --save-dev

*/

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	jade = require('gulp-jade'),
	uglify = require('gulp-uglify'),
	jsonminify = require('gulp-jsonminify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	shell = require('gulp-shell'),
	del = require('del'),
	vinylPaths = require('vinyl-paths'),
	zip = require('gulp-zip');
	

/* SASS */
gulp.task('sass', function () {
	return gulp.src('./src/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass())
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('./src/css'));
});

/* Jade */
gulp.task('jade', function () {
	return gulp.src('./src/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('./src'))
});

/* Minify JS */
gulp.task('js', function () {
  return gulp.src('./src/js/*.js')
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('lib', function () {
    return gulp.src(['./src/lib/*.js'])
        .pipe(gulp.dest('./dist/lib'));
});

/* jsonminify */
gulp.task('json', function () {
    return gulp.src(['./src/**/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('./dist'));
});

/* Image */
gulp.task('image', () => {
    return gulp.src('./src/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img'));
});

/* Delete old dist and radio.zip  */
gulp.task('clean', function () {
    return del.sync(['./dist', './radio.zip']);
});

/* Generate json from DataBase */
gulp.task('stations', shell.task([
	'php stations.php'
]));

/* gulp watch */
gulp.task('watch', function () {
	gulp.watch('./src/sass/*.scss', ['sass']);
	gulp.watch('./src/*.jade', ['jade']);
});

gulp.task('dist', ['sass', 'jade', 'lib', 'js', 'json', 'image'], () => {
    return gulp.src(['./src/*.html', './src/**/*.css'])
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['dist', 'clean'], function () {
    return gulp.src('./dist/**/*')
		.pipe(zip('radio.zip'))
		.pipe(gulp.dest('./'));
});