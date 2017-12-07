'use strict';

var gulp = require('gulp'),
    browserSync = require("browser-sync"),
    less = require('gulp-less'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    watch = require('gulp-watch'),
    frontMatter    = require('gulp-front-matter'),
    autoprefixer = require('gulp-autoprefixer'),
    path = require('path'),
    nunjucks = require('gulp-nunjucks'),
    data = require('gulp-data'),
    fs = require("fs"),
    reload = browserSync.reload;

var url = {
    build: {
        html: 'public/',
        php: 'public/',
        css: 'public/assets/css/',
        js: 'public/assets/js/',
        img: 'public/assets/media/img/',
        video: 'public/assets/media/video/',
        fonts: 'public/assets/fonts/'
    },
    src: {
        html: 'src/templates/**/[^_]*.html',
        php: 'src/php/*.php',
        lang_data: 'src/lang/',
        style: 'src/assets/less/*.less',
        js: 'src/assets/js/*.js',
        img: 'src/assets/img/**/*.*',
        video: 'src/assets/video/**/*.*',
        fonts: 'src/assets/fonts/**/*.*'
    },
    watch: {
        html: 'src/templates/**/*.html',
        php: 'src/php/*.php',
        lang_data: 'src/lang/**/*.*',
        style: 'src/assets/less/**/*.less',
        js: 'src/assets/js/**/*.js',
        img: 'src/assets/img/**/*.*',
        video: 'src/assets/video/**/*.*',
        fonts: 'src/assets/fonts/**/*.*'
    },
    clean: './public'
};

var langs = [
    {
        'name' : 'ru',
        'folder' : 'ru',
        'url' : ''
    },
    {
        'name' : 'en',
        'folder' : 'en',
        'url' : 'en'
    }
];

var config = {
    server: {
        baseDir: "./public"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "Frontend_:"
};

gulp.task('webserver', function () {
    browserSync(config);
});

// default tasks
gulp.task('default', ['build', 'webserver', 'watch']);


// build tasks
gulp.task('html:build', function () {
    build();
});

gulp.task('php:build', function () {
    gulp.src(url.src.php)
        .pipe(gulp.dest(url.build.php))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(url.src.style)
        .pipe(less({
            includePaths: ['src/less/'],
            outputStyle: 'compressed',
            errLogToConsole: true
        }))
        .pipe(autoprefixer('last 10 versions', 'ie 9'))
        .pipe(gulp.dest(url.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(url.src.js)
        .pipe(gulp.dest(url.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(url.src.img)
        .pipe(gulp.dest(url.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(url.src.fonts)
        .pipe(gulp.dest(url.build.fonts))
});

gulp.task('video:build', function() {
    gulp.src(url.src.video)
        .pipe(gulp.dest(url.build.video))
});

gulp.task('build', [
    'html:build',
    'php:build',
    'style:build',
    'js:build',
    'image:build',
    'fonts:build',
    'video:build'
]);


// watch tasks
gulp.task('watch', function(){
    watch([url.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([url.watch.lang_data], function(event, cb) {
        gulp.start('html:build');
    });
    watch([url.watch.php], function(event, cb) {
        gulp.start('php:build');
    });
    watch([url.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([url.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([url.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([url.watch.video], function(event, cb) {
        gulp.start('video:build');
    });
    watch([url.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


// additional tasks

gulp.task('clean', function (cb) {
    rimraf(url.clean, cb);
});




// additional functions
function build() {
    langs.forEach(function (lang) {
        return renderHtml(lang);
    });
}

function renderHtml(lang) {
    return gulp
        .src(url.src.html)
        .pipe(frontMatter({ property: 'data' }))
        .pipe(data(function(file) {
            var json_name = url.src.lang_data + lang.folder+'/'+path.basename(file.path).slice(0, -5)+'.json';
            var json_info = JSON.parse(fs.readFileSync(json_name));

            return json_info;
        }))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest(url.build.html+lang.url))
        .pipe(reload({stream: true}));
}












