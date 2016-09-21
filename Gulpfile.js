const
    gulp       = require('gulp'),
    inject     = require('gulp-inject'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    watch      = require('gulp-watch'),
    del        = require('del'),
    runSeq     = require('run-sequence'),

    tsFiles    = 'src/**/*.ts',
    
    rootFiles  = ['src/*.html', 
                  'src/*.ico', 
                  'src/*.js'],

    appFiles   = ['src/app/**/*.html',
                  'src/app/**/*.css'],

    vendors    = ['node_modules/rxjs/**/*.+(js|js.map)',
                  'node_modules/systemjs/dist/system-polyfills.js',
                  'node_modules/systemjs/dist/system.src.js',
                  'node_modules/zone.js/dist/**/*.+(js|js.map)',
                  'node_modules/reflect-metadata/**/*.+(ts|js|js.map)',
                  'node_modules/@angular/**/*.+(js|js.map)',
                  'node_modules/es6-shim/es6-shim.min.js',
                  'node_modules/jquery/dist/jquery.min.js',
                  'node_modules/bootstrap/dist/js/bootstrap.min.js',
                  'node_modules/bootstrap/dist/css/bootstrap.min.css',
                  'node_modules/bootstrap/dist/fonts/**/*.*',
                  'node_modules/font-awesome/css/font-awesome.min.css',
                  'node_modules/core-js/client/shim.min.js'],
                 
    injects    = ['dist/vendor/reflect-metadata/Reflect.js',
                  'dist/vendor/core-js/client/shim.min.js',
                  'dist/vendor/systemjs/dist/system.src.js',
                  'dist/vendor/zone.js/dist/zone.js',
                  'dist/vendor/jquery/dist/jquery.min.js',
                  'dist/vendor/bootstrap/dist/js/bootstrap.min.js',
                  'dist/vendor/bootstrap/dist/css/bootstrap.min.css',
                  'dist/vendor/font-awesome/css/font-awesome.min.css'];

////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function () {
    return del(['dist/**']);
});

gulp.task('copy-root', function () {
    return gulp.src(rootFiles)
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-vendor', function () {
    return gulp.src(vendors, { base: 'node_modules/' })
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('inject', function () {
    var sources = gulp.src(injects, {
        read: false
    });
    var target = gulp.src('dist/index.html');
    return target.pipe(inject(sources, {
        ignorePath: 'dist',
        addRootSlash: false
    })).pipe(gulp.dest('dist'));
})

gulp.task('compile', function () {
    var tsProject = typescript.createProject('src/tsconfig.json');
    return gulp.src(tsFiles)
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-app', function () {
    return gulp.src(appFiles, { base: 'src/' })
        .pipe(gulp.dest('dist'));
});

////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', function () {
    runSeq(
        'clean',
        'copy-root',
        'copy-vendor',
        'inject',
        'compile',
        'copy-app'
    );
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/app/**/*.ts', ['compile']);
    gulp.watch('src/app/**/*.+(html|css)', ['copy-app']);
});
