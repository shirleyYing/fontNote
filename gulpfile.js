var gulp = require("gulp"),  
    deploy = require("gulp-gh-pages");

gulp.task('publish', function () {
  return gulp.src("_book/**/*")
    .pipe(deploy({
      remoteUrl: "git@github.com:xxx/fontNote"
    }))
    .on("error", function(err){
      console.log(err);
    });
});