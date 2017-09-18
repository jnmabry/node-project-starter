var gulp = require('gulp');
var sass = require('gulp-sass');
var watchSass = require('gulp-watch-sass');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Compile sass to css and watch for changes
gulp.task("sass:watch", () => watchSass([
  "./sass/**/*.{scss,css}",
])
  .pipe(sass())
  .pipe(gulp.dest("./css"))
  .pipe(browserSync.reload({
    stream: true
  }))
);

// Watch for changes in files 
gulp.task('watch', function() {
    gulp.watch('css/*.css', browserSync.reload);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
    gulp.watch('*.php', browserSync.reload);
});

// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src('css/main.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))

    gulp.src(['node_modules/popper.js/dist/**/*'])
        .pipe(gulp.dest('vendor/popper'))
        
    gulp.src(['node_modules/reset-css/reset.css'])
        .pipe(gulp.dest('vendor/reset'))        

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
})

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
      server: {
          baseDir: ''
      },
  })
})

// Run all tasks by default gulp command
gulp.task('default', ['sass:watch', 'minify-css', 'minify-js', 'copy', 'browserSync', 'watch']);