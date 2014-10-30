var gulp = require('gulp'),
	concat = require('gulp-concat'),
	gulpCC = require('gulp-closurecompiler'),
	sass = require('gulp-sass'),
	gulpFontgen = require('gulp-fontgen'),
	iconfont = require('gulp-iconfont'),
	consolidate = require('gulp-consolidate'),
	rename = require('gulp-rename'),
	run = require('gulp-run'),
	filter = require('gulp-filter'),
	yuicompressor = require('gulp-yuicompressor'),
	del = require('del'),
	app = require('./app.json'),
	pkg = require('./package.json');

// SASS = SCSS
gulp.task('sass', [
	'scss'
]);

// Compile Scss files to CSS
gulp.task('scss', [ 'icons' ], function() {
	return gulp
	.src(
		'Resources/Private/Scss/{screen,print}.scss'
	)
	.pipe(
		sass({
			outputStyle: 'compressed'
		})
	)
	.pipe(
		yuicompressor({
			type: 'css'
		})
	)
	.pipe(
		gulp.dest('Resources/Public/css/')
	)
});

// Compile and uglify Javascript
gulp.task('js', function() {
	return gulp
	.src(
		app
		.assets
		.js
		.concat([
			'Resources/Private/JavaScript/*.js'
		])
	)
	.pipe(
		gulpCC({
			dest: 'Resources/Public/js/main.js'
		})
	)
});

// Render webicons (SVG) as fonts
gulp.task('icons', function() {
	var ttfFilter = filter( pkg.name + '-icons.ttf' );

	return gulp
	.src(
		'Resources/Private/Icons/*.svg'
	)
	.pipe(
		iconfont({
			fontName: pkg.name + '-icons'
		})
	)
	.on('codepoints', function(codepoints) {
		gulp
		.src('icons.css')
		.pipe(
			consolidate('lodash', {
				glyphs: codepoints,
				fontName: pkg.name + '-icon',
				fontPath: '../fonts/',
				className: pkg.name + '-icon'
			})
		)
		.pipe(
			rename({
				basename: '_' + pkg.name + '-icons',
				extname: '.scss'
			})
		)
		.pipe(
			gulp.dest('Resources/Private/Scss/')
		);
	})
	.pipe(
		ttfFilter
	)
	.pipe(
		run('/bin/sh -c cat | ttfautohint --symbol --fallback-script=latn --no-info /dev/stdin /dev/stdout | cat', {
			verbosity: '0'
		})
	)
	.pipe(
		ttfFilter.restore()
	)
	.pipe(
		gulp.dest('Resources/Public/fonts/')
	)
});

// Copy images to a public folder
gulp.task('images', function(){
	return gulp
	.src( 'Resources/Private/Images/**/*' )
	.pipe(
		gulp.dest( 'Resources/Public/img' )
	)
});

// Copy assets fonts to the public folder
gulp.task('fonts', function(){
	return gulp
	.src( app.assets.fonts )
	.pipe(
		gulp.dest( 'Resources/Public/fonts' )
	)
});

// Generate webfonts starting from Desktop Fonts
gulp.task('generate-webfonts', function(){
	return gulp
	.src( 'Resources/Private/Fonts/*.{otf,ttf}' )
	.pipe(
		gulpFontgen({
			dest: 'Resources/Temp/Fonts/',
			css_fontpath: '../fonts/'
		})
	)
});

// Move fonts file to a public folder, then concat CSS style and place it on the relative public folder
gulp.task('webfonts', [ 'generate-webfonts' ], function(){
	var cssFilter = filter('*.css'),
		fontFilter = filter('*.{ttf,woff,eot,svg,otf}');

	return gulp
	.src( 'Resources/Temp/Fonts/*' )
	.pipe(
		fontFilter
	)
	.pipe(
		gulp.dest( 'Resources/Public/fonts' )
	)
	.pipe(
		fontFilter.restore()
	)
	.pipe(
		cssFilter
	)
	.pipe(
		concat( 'webfont.css' )
	)
	.pipe(
		gulp.dest( 'Resources/Public/css/' )
	)
});

// After we finish all the stuff, clean the crap out
gulp.task('clean', [
	'webfonts',
	'fonts',
	'images',
	'scss',
	'js'
], function(cb){
	del([
		'Resources/Temp'
	], cb);
});

// Do the magic :)
gulp.task('default', [
	'clean'
]);