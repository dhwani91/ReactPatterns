var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var vsource = require("vinyl-source-stream");
var babel = require('babelify');
var shell = require('gulp-shell');
var config = require('./config.json');

var shellTaskArgument;
if (process.platform == 'win32') shellTaskArgument = config.winProjectRoot + '/node_modules/electron-prebuilt/dist/electron.exe ' + config.winProjectRoot;
else shellTaskArgument = './node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron ./../ReFluxElectron';

var source = {
	appjs: './ui-src/app.js',
	js: ['./ui-src/**/*.js'],
	appcss: ['./ui-src/css/*.css'],
	apphtml: ['./ui-src/**/*.html']
};

gulp.task('appjs', function(){
	browserify({ debug: true })
		.transform(babel)
		.require(source.appjs, { entry: true })
		.bundle()
		.pipe(vsource('app.min.js'))
		.pipe(gulp.dest('./ui-dist'));
});

gulp.task('appcss', function () {
	gulp.src(source.appcss)
		.pipe(concat('app.min.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./ui-dist'))
});

gulp.task('apphtml', function() {
	gulp.src(source.apphtml)
		.pipe(gulp.dest('./ui-dist'));
});

gulp.task('watch', function() {
	gulp.watch(source.appcss, ['appcss']);
	gulp.watch(source.apphtml, ['apphtml']);
	gulp.watch(source.js, ['appjs']);
});

gulp.task('default', ['appjs', 'appcss', 'apphtml', 'watch']);

gulp.task('nw', ['appjs', 'appcss', 'apphtml']);

gulp.task('run', shell.task([shellTaskArgument]));
