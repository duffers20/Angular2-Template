var gulp = require('gulp');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var pump = require('pump');

var sources = [
    'src/**/*.html',
    'src/**/*.css',
    'src/**/*.js',
    'src/favicon.ico'
];

var vendors = [
    'node_modules/rxjs/**/*.+(js|js.map)',
    'node_modules/systemjs/dist/system-polyfills.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/zone.js/dist/**/*.+(js|js.map)',
    'node_modules/reflect-metadata/**/*.+(ts|js|js.map)',
    'node_modules/@angular/**/*.+(js|js.map)',
    'node_modules/es6-shim/es6-shim.js',
]

var paths = {
    'typescript': 'src/**/*.ts',
    'dest': 'dist'
}

gulp.task('compile', function () {
    var tsProject = typescript.createProject('src/tsconfig.json');
    pump([
        gulp.src(paths.typescript),
        typescript(tsProject),
        uglify(),
        gulp.dest(paths.dest)
    ]);
});

gulp.task('deploy:app', ['compile'], function() {
    return gulp.src(sources, {base: 'src/'})
        .pipe(gulp.dest(paths.dest));
});

gulp.task('deploy:vendors', function() {
    return gulp.src(vendors, {base: 'node_modules/'})
        .pipe(gulp.dest(paths.dest + '/vendor'));
});

gulp.task('default', ['deploy:vendors', 'deploy:app']);

gulp.task('watch', ['default'], function () {
    gulp.watch(paths.typescript, ['compile', 'deploy:app']);
    gulp.watch(sources, ['deploy:app']);
});
