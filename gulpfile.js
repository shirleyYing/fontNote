var gulp = require("gulp"),  
    deploy = require("gulp-gh-pages");

var options={remoteUrl: "git@github.com:shirleyYing/fontNote_book.git"};
gulp.task('publish', function () {  
  gulp.src("./_book/**/*")
    .pipe(deploy(options))
    .on("error", function(err){
      console.log(err);
    });
});
