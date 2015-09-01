#lofty组件用法整理
刚刚写了一个轮播组件。和传统的触点和轮播组件分别在两个列表中的样式有些不同。
发现默认的切换样式会将其他没显示的轮播元素添加样式：display：none；自己做了hack。显示正常了但是发现触点 hover事件不管用了。于是去源码中找了一下，发现了问题所在，也熟悉了一下tab组件的用法。
组件地址：http://cms.cn.alibaba-inc.com/page/box/view.html?id=7272&type=module)
```
define(['fui/tabs/2.0','jquery'], function(Tabs,$){
        var $el=$('.korea-imgtab');
        var $li=$el.find('.img-list li');
        var $dot=$el.find('.main');
        var tab = new Tabs({
            tpl:$el,
            boxSelector: $li,
            titleSelector:$dot,
            currentCls:"cur",
            autoPlay:'line',
            listenDefault:true,
            interval:2000
        });
});
```
传jquery对象是出于避免命名冲突的考虑。但是忘记了文档中规定了只能传递string，也就是selector。但是这样子也可以用，只是触点hover效果失效了。默认触点事件为`onmouseenter`. 效果为暂停轮播。去源码中找到了答案。

Tab组件继承自Widget组件，初始化由widget完成，
```
init: function( config) {

                //初始化options
                this.mixOptions(['tpl', 'events']);

                //调用基类的构造函数，初始化属性及plugin等
                Base.prototype.init.call(this, config || {});

                //判断组件的渲染方式，并获取组件根节点
                this.buildElement();

                //初始化组件事件
                this.bindEvent();

                //子类组件的具体实现
                this._create();
            },
```
`buildElement()` 中会得到模板节点
在 buildElement() 函数中，根据实例化组件时传入的 tpl 参数的值，可以判断组件的渲染方式。
```
if (isString(tpl)) {
    // 组件的Dom节点存在于页面上
    if (tpl.charAt(0) === '.' || tpl.charAt(0) === '#' || tpl === 'body') {
        node = $(tpl);
    }
}else{
    node = tpl;
}
```
因为有这样的兼容，所以，传了jquery对象也是没有问题的。
无论渲染方式如何，buildElement()最终会构建得到组件的根节点对象 --> this.get('el')，init 函数执行过程中， 通过 bindEvent 函数将定义在 UI 基类 events 对象中的 节点选择器 + 事件 + callback 以事件**委托的方式**自动注册到跟节点上。

```
bindEvent: function(events) {

                events = events || this.get('events');
                for (var selector in events) {
                    var es = events[selector];
                    for (var type in es) {

                        var selector = parseSelector(selector, this);
                        var event = parseSelector(type, this) + '.events-' + this.wId;
                        (function(handler, self) {
                            var callback = function(e) {
                                if (isFunction(handler)) {
                                    handler.call(self, e);
                                } else {
                                    self[handler](e);
                                }
                            }

                            var element = self.get('el');
                            if (selector === "") {
                                element.on(event, callback);
                            }
                            else if(selector === "document"){
                                $(document).on(event, callback);
                            }
                            else if(selector === "window"){
                                $(window).on(event, callback);
                            }
                            else {
                                element.on(event, selector, callback);
                            }

                        })(es[type], this);
                    }
                }
                return this;
            },
```
因为事件委托，绑定函数时需要格式化selector。保证selector是一个字符串，
```
function parseSelector(selector, widget){

            return selector.replace(/{([^}]+)}/g, function(m, name) {
                var parts = name.split('.');
                var point = widget, part;

                while (part = parts.shift()) {
                    if (point === widget.options) {
                      point = widget.get(part);
                    } else {
                      point = point[part];
                    }
                }
                if (isString(point)) {
                    return point;
                }
                return '';
            });
        };
```
问题就在这里。因为传入的titleSelector不是string，所以会返回" "，这样触点时间就绑定在了根节点tpl上。hover肯定就失效了。

再回到根节点tpl 上来，tab `_creat()` 函数中对所需元素集合的查找全是基于根节点的。
```
var element     = this.get('el');
this.titles     = element.find(this.get('titleSelector'));
this.boxes      = element.find(this.get('boxSelector'));
this.prevNode   = element.find(this.get('prev'));
this.nextNode   = element.find(this.get('next'));
```
这样的话其实传jquery对象的意义也就没有了。还是要仔细看文档才行。

另一个问题，如果boxSelector 传入jquery对象时，`this.boxes     = element.find(this.get('boxSelector'));`
`this.get`是attribute.js中的方法。
```
get: function(key) {
    var option = this.options[key] || {};
    var val = option.value;
    return option.getter ? option.getter.call(this, val, key) : val;
},
```
如此就返回val，就是传入的jquery对象了。

另外，过程中还出了一个小错误，写了 `titleSelector：'.korea-imgtab .main'` 这样基于事件委托的绑定方式，一定是找不到的。事件委托，selector要为选定元素的子元素的选择器才可以。小错误一定要注意。

##其他用法
文档中提供了两个事件：
switch. beforeSwitch
用法
```
tab.on('switch',function(o){
            console.log(o.boxes.eq(o.index));
})
```
o.box为轮播集合，o.index为当前轮播的索引。可以对当前元素做一些操作。
另外还有o.lastIndex , 上一个元素的索引。

##tab组件的盒子用法

```
 <div class="design-tabs-01" data-allo="Tabs" data-allo-config='{"titleSelector":".fx-tab-nav li","boxSelector":".fx-tab-pane","effect":"fade","currentCls":"active"}'>
 <ul calss='list'></ul>
 <ul calss='dot'></ul>
```
这样可以不用写js。非常适用于同一个页面上引用了两个相同的轮播组件。
详细用法文档地址：[《盒子allo JS 组件规范(盒子组件内不含script标签)》](http://wd.alibaba-inc.com/doc/page/work/cbu-operation-tools/dcms/allo)


