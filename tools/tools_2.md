# sublime3+livereload+chrome插件安装

**sublime3 package里的livereload安装后没有启动服务的选项。需要去github上自己下载。**

1. 下载liveReload包
https://github.com/dz0ny/LiveReload-sublimetext2#devel-branch 直接git clone下来

clone或download zip后,放到ST3的Packages里:

2. ctrl+shift+p 打开包管理器

3. LiveReload: Enable/disable plugins

4. Enable - SimpleReload

这时候它的livereload服务才可以真正使用,可以打开http://localhost:35729/livereload.js?snipver=1
以测试,如果livereload服务正常,则会正确显示JS内容,反则之服务没正常启动

接着再安装chrome上的LiveReload Extension

在浏览器中点击livereload小图标，中间变为实心小点，启用livereload绑定。

一切就ok了。