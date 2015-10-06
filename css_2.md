#web高性能动画与页面渲染

昨天听了css大会，其中美女黄薇分享的高性能动画超级赞。在这里做一个总结。
###页面渲染过程
layout(计算范围)——paint（计算展现）——composit（合成位图）
###fps
页面是每一帧变化都是系统绘制出来的(GPU或者CPU)。但这种绘制又和PC游戏的绘制不同，它的最高绘制频率受限于显示器的刷新频率(而非显卡)，所以大多数情况下最高的绘制频率只能是每秒60帧(frame per second，以下用fps简称)，对应于显示器的60Hz。人眼能识别的卡顿在fps30 以下，也就是每一帧动画至少要在33.4ms内完成，才会有流畅的动画体验。chorme浏览器的devtool中的render和timeline工具都可以很好地分析fps以及dom渲染时间。
###减少触发layout
####减少对相关属性的读取和操作

每当对页面元素的width，height，margin 以及位置相关的属性进行修改或者读取时，都会触发浏览器的layout行为，进而会引起后续的浏览器行为。如果频繁触发浏览器的layout行为，会导致页面不停的重绘，非常影响性能。另外box-shadow ，backgorund-attachment， fix 等属性，也会导致页面不停的重绘，使得浏览器渲染页面的时间加长。
####优化layout触发次数
浏览器有自己的优化方案，所有可触发layout的操作都会被暂时放入 layout-queue 中，等到必须更新的时候，再计算整个队列中所有操作影响的结果，执行所有layout的操作。
例如，可以连续的读取 offsetWidth/Height 属性与连续的设置 width/height 属性，相比分别读取设置单个属性可少触发一次layout。
也可以将读取和设置的操作放到`requestAnimFrame `函数体中来减少layout触发次数。
###setTimeout 的替代方案
setTimeout根据浏览器的内置时钟更新频率。例如，ie8 以前的更新间隔为15.6ms，setTimeout为16.7ms时，需要两个时间间隔才能触发。

因为js引擎为单线程，setTimeout可能会遭遇阻塞而导致减少执行次数，而引起的跳帧。从而页面动画会出现闪烁和卡顿的现象。

用`requestAnimFrame (callback)`可以很好地解决以上问题。
该方法让浏览器优化并行的动画动作，更合理的重新排列动作序列，并把能够合并的动作放在一个渲染周期内完成，减少触发layout，从而呈现出更流畅的动画效果。

###硬件加速
GPU擅长进行偏移，缩放，旋转，更改透明的操作。
浏览器会根据css属性生成layer（图层）,将layer作为texture上传给GPU，当改变layers的上述中属性的时候，浏览器会跳过layout 和paint ，进入composite阶段，直接告诉GPU修改对应的属性，这样就节省了浏览器layout 和repaint 的时间和将生成的位图上传到GPU的时间。

生成layer触发条件有

      3D或transform属性
      使用transition或animation属性改变 opacity，transform
      video
      canvas
      css filter


####使用：
1. `transform:transition3d(0,0,0)` 利用3D属性给需要的元素开启硬件加速。

2. `will-change`属性可以通知浏览器关注特性的变化，以及相应的优化和分配内存。开启硬件加速。但是作为一个新属性，支持程度有限。ie就不要奢望了。可以参照 [caniuse](www.caniuse.com) 。而且该属性使用不好也可能造成占用过多内存的情况。
GPU也是有容量的，不能随意开启硬件加速，超过容量就没有加速的效果了。而且也会带来占用过多cpu资源等其他问题。

####硬件加速适用情况
- 使用很多大尺寸图片(尤其是PNG24图)进行动画的页面。
- 页面有很多大尺寸图片并且进行了css缩放处理，页面可以滚动时。
- 使用background-size:cover设置大尺寸背景图，并且页面可以滚动时。(详见:https://coderwall.com/p/j5udlw)
- 编写大量DOM元素进行CSS3动画时(transition/transform/keyframes/absTop&Left)



>有些地方理解的还不是很到位，如果有错误欢迎指正。
dfdf
>dfdfgg风格反馈结果