'use strict';
//var path = require('path');
var gulp = require('gulp');
// var eslint = require('gulp-eslint');
//var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
// var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
//var coveralls = require('@kollavarsham/gulp-coveralls');

// gulp.task('lint', gulp.series(function () {
//   return gulp.src('generators/!(templates)**/index.js')
//     .pipe(excludeGitignore())
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// }));

// gulp.task('nsp', function (cb) {
//   nsp({package: path.resolve('package.json')}, cb);
// });

// gulp.task('pre-test', gulp.series(() => {
//   return gulp.src(['generators/!(templates)**/index.js'])
//     .pipe(excludeGitignore())
//     .pipe(istanbul({
//       includeUntested: true
//     }))
//     .pipe(istanbul.hookRequire())
//   }));

gulp.task('test', gulp.series(/*'pre-test',*/ function (done) {
  var mochaErr;

  return gulp.src('test/**/*.js')
    .pipe(plumber(function(err) {
      //console.error(err);
      this.emit('end');
  }))
    .pipe(mocha({reporter: 'spec', timeout: 600000}))
    .on('error', function (err) {
      //console.error(err);
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('error', function (err) {
      //console.error(err);
      if (err) done(err);
    })
    .on('end', function () {
      done(mochaErr);
    });
}));

gulp.task('watch', gulp.series(function (done) {
  gulp.watch(gulp.parallel('generators/**/*.js', 'test/**', 'test'));
  done();
}));

// gulp.task('coveralls', gulp.series('test', function (done) {
//   if (!process.env.CI) {
//     done();
//   }

//   return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
//     .pipe(coveralls());
// }));

//gulp.task('prepare', [/* 'nsp' */]);
gulp.task('default', gulp.series('test'/*, 'coveralls'*/));
