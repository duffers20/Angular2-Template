var gulp = require('gulp');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var pump = require('pump');

var paths = {
    html: 'src/**/*.html',
    css: 'src/**/*.css',
    javascript: 'src/**/*.js',
    scripts: 'src/**/*.ts',
    favicon: 'src/favicon.ico',
    dest: 'dist'
};

var vendor = {
    rxjs: 'node_modules/rxjs/**/*.+(js|js.map)',
    systemjs: ['node_modules/systemjs/dist/system-polyfills.js', 'node_modules/systemjs/dist/system.src.js'],
    zonejs: 'node_modules/zone.js/dist/**/*.+(js|js.map)',
    reflect: 'node_modules/reflect-metadata/**/*.+(ts|js|js.map)',
    angular: 'node_modules/@angular/**/*.+(js|js.map)',
    es6: 'node_modules/es6-shim/es6-shim.js'
}

gulp.task('compile', function () {
    var tsProject = typescript.createProject('src/tsconfig.json');
    pump([
        gulp.src(paths.scripts),
        typescript(tsProject),
        uglify(),
        gulp.dest(paths.dest)
    ]);
});

gulp.task('deploy:vendor:angular', function () {
    return gulp.src(vendor.angular).pipe(gulp.dest(paths.dest + '/vendor/@angular/'));
});

gulp.task('deploy:vendor:rxjs', function () {
    return gulp.src(vendor.rxjs).pipe(gulp.dest(paths.dest + '/vendor/rxjs/'));
});

gulp.task('deploy:vendor:systemjs', function () {
    return gulp.src(vendor.systemjs).pipe(gulp.dest(paths.dest + '/vendor/systemjs/dist'));
});

gulp.task('deploy:vendor:zonejs', function () {
    return gulp.src(vendor.zonejs).pipe(gulp.dest(paths.dest + '/vendor/zonejs/dist'));
});

gulp.task('deploy:vendor:reflect', function () {
    return gulp.src(vendor.reflect).pipe(gulp.dest(paths.dest + '/vendor/reflect-metadata/'));
});

gulp.task('deploy:vendor:es6', function () {
    return gulp.src(vendor.es6).pipe(gulp.dest(paths.dest + '/vendor/es6-shim/'));
});

gulp.task('deploy:vendor', ['deploy:vendor:rxjs', 'deploy:vendor:systemjs', 'deploy:vendor:zonejs', 'deploy:vendor:reflect', 'deploy:vendor:angular', 'deploy:vendor:es6']);

gulp.task('deploy:html', function () {
    return gulp.src(paths.html).pipe(gulp.dest(paths.dest));
});

gulp.task('deploy:css', function () {
    return gulp.src(paths.css).pipe(gulp.dest(paths.dest));
});

gulp.task('deploy:javascript', function () {
    return gulp.src(paths.javascript).pipe(gulp.dest(paths.dest));
});

gulp.task('deploy:favicon', function () {
    return gulp.src(paths.favicon).pipe(gulp.dest(paths.dest));
});

gulp.task('default', ['deploy:css', 'deploy:javascript', 'deploy:favicon', 'compile', 'deploy:vendor', 'deploy:html']);

gulp.task('defaultwatch', ['default'], function () {
    gulp.watch(paths.scripts, ['compile']);
    gulp.watch(paths.html, ['deploy:html']);
    gulp.watch(paths.css, ['deploy:css']);
});