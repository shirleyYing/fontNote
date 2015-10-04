

1.映像区域问题
--------

链接为块状区域时，a标签外面还套了p 等时，有时hover效果要整块一起，如果只是加了p:hover的话，当鼠标在p上，a外面时，a的hover效果不会显示，会感觉到一瞬间的延迟。感觉不好。好的解决方法是把a标签放在最外层。这样指到该块的边缘时，就可以看到小手。让人感觉整个标签是一个整体。

2.标题，文字溢出。
----------

数据源字数不好控制，所以每一个p都要设置高度和width。
并且还要有overflow。只看设计稿经常会忽略这些问题，但是当引入数据源后，就会发现页面上这里掉下去了，那里又上去了。

3.组件化开发，要注意组件的灵活度。
------------------

宽高尽量合身，用内容的实际大小。虽然外层li设置高度和宽度，也可以达到效果，但是复用度很低。另外一个组件的li宽高变了，改动成本就很大。内容每个标签合身，用margin来控制位置。
![示例图](css1_img.png)

**踩到的坑：** 子元素尽量避免使用height：100%。如果不必要设置height时，就不要写，这样如果修改父元素高度的话里面也会跟着变，以防修改时忘记该里面的高度值，把整个父元素撑开，还不知道怎么回事。

4 标签语义化
-------

注意标签的语义化，标题的部分就要用h1，h3..
文字段落就用p，列表就用三种列表形式。要严格根据文字内容使用标签，其中dl，dt，虽然可以单独设置样式，对于那种标题配一句话文案的地方比较好用（个人习惯），但是是不符合语义化的，把标题外面用dl套了一层，可能搜索引擎就找不到了。。。多少点击量就没啦。。。（运营姐姐哭晕在厕所。。。）

要思考每一种写法的必要性，优缺点，适用性。不能只看效果ok就不管了。知其然，知其所以然。