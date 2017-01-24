const
    gulp       = require('gulp'),
    inject     = require('gulp-inject'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    watch      = require('gulp-watch'),
    tslint     = require('gulp-tslint'),
    del        = require('del'),
    runSeq     = require('run-sequence'),

    paths      = {'src' : 'src',
                  'dest': 'dist',
                  'app' : 'src/app'},

    tsFiles    = paths.src + '/**/*.ts',
    
    rootFiles  = [paths.src + '/*.html', 
                  paths.src + '/*.ico', 
                  paths.src + '/*.js'],

    appFiles   = [paths.app + '/**/*.html',
                  paths.app + '/**/*.css'],

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
                 
    injects    = [paths.dest + '/vendor/reflect-metadata/Reflect.js',
                  paths.dest + '/vendor/core-js/client/shim.min.js',
                  paths.dest + '/vendor/systemjs/dist/system.src.js',
                  paths.dest + '/vendor/zone.js/dist/zone.js',
                  paths.dest + '/vendor/jquery/dist/jquery.min.js',
                  paths.dest + '/vendor/bootstrap/dist/js/bootstrap.min.js',
                  paths.dest + '/vendor/bootstrap/dist/css/bootstrap.min.css',
                  paths.dest + '/vendor/font-awesome/css/font-awesome.min.css']
                  
    tsProject  =  typescript.createProject(paths.src + '/tsconfig.json', { outDir: paths.dest });

////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function () {
    return del([paths.dest + '/**']);
});

gulp.task('copy-root', function () {
    return gulp.src(rootFiles)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('copy-vendor', function () {
    return gulp.src(vendors, { base: 'node_modules/' })
        .pipe(gulp.dest( paths.dest + '/vendor'));
});

gulp.task('inject', function () {
    var sources = gulp.src(injects, {
        read: false
    });
    var target = gulp.src(paths.dest + '/index.html');
    return target.pipe(inject(sources, {
        ignorePath: paths.dest,
        addRootSlash: false
    })).pipe(gulp.dest(paths.dest));
})

gulp.task('compile', function () {
    return gulp.src(tsFiles)
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report({
            emitError: false
        }))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('copy-app', function () {
    return gulp.src(appFiles, { base: paths.src + '/' })
        .pipe(gulp.dest(paths.dest));
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
    gulp.watch(paths.app + '/**/*.ts', ['compile']);
    gulp.watch(paths.app + '/**/*.+(html|css)', ['copy-app']);
});
