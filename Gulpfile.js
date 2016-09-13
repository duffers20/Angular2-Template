var gulp = require('gulp');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var pump = require('pump');
var inject = require('gulp-inject');

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
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css'
]

var injects = [
    './dist/vendor/es6-shim/es6-shim.js',
    './dist/vendor/reflect-metadata/Reflect.js',
    './dist/vendor/systemjs/dist/system.src.js',
    './dist/vendor/zone.js/dist/zone.js',
    './dist/vendor/jquery/dist/jquery.min.js',
    './dist/vendor/bootstrap/dist/js/bootstrap.min.js',
    './dist/vendor/bootstrap/dist/css/bootstrap.min.css',
    './dist/vendor/font-awesome/css/font-awesome.min.css'
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

gulp.task('deploy:app', ['compile'], function () {
    return gulp.src(sources, { base: 'src/' })
        .pipe(gulp.dest(paths.dest));
});

gulp.task('deploy:vendors', function () {
    return gulp.src(vendors, { base: 'node_modules/' })
        .pipe(gulp.dest(paths.dest + '/vendor'));
});

gulp.task('inject:dependencies', ['deploy:vendors'], function() {
    var sources = gulp.src(injects, {
        read: false
    });
    var target = gulp.src(paths.dest + '/index.html');
    return target.pipe(inject(sources, {
        ignorePath: 'dist',
        addRootSlash: false
    })).pipe(gulp.dest(paths.dest));
})

gulp.task('default', ['deploy:app', 'inject:dependencies']);

gulp.task('watch', ['default'], function () {
    gulp.watch(paths.typescript, ['compile', 'deploy:app']);
    gulp.watch(sources, ['deploy:app']);
});
