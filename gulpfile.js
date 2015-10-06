var gulp = require("gulp"),  
    deploy = require("gulp-gh-pages");

gulp.task('publish', function () {
  gulp.src("./_book/book/**/*.*")
    .pipe(deploy({
      remoteUrl: "git@github.com:shirleyYing/fontNote.git"
    }))
    .on("error", function(err){
      console.log(err);
    });
});