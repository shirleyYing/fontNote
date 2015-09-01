
#js代码组织-解耦，简洁，复用


这是修改后的js代码，由于修改前没有保存下来。只能这样分析啦。
```
define('js/module/offer-stock', ['jquery'], function($) {
    'use strict';
    function init(el) {
        var $el = $(el);
        var $stockDoms = $el.find('.j-stock').not('.j-stock-success');
        var offeridList = [];
        var stockDomObj = {};

        $stockDoms.each(function(index) {
            var offerid = $(this).data('offerid');
            if (offerid) {
                stockDomObj[offerid] = $(this);
                offeridList.push(offerid);
            }
        });

        if (offeridList.length === 0) {
            return;
        }

        getCount(offeridList.join(','))
            .done(function(json) {
                rander(json.content);
            })
            .fail(function() {
                rander();
            });

        /*获取数据*/
        function getCount(offerIds) {
            var deferred = $.Deferred();

            $.ajax({
                url: url,
                data: {
                    ids: offerIds
                },
                type: 'get',
                dataType: 'jsonp',
                success: function(json) {
                    if (json && json.content) {
                        deferred.resolve(json);
                    } else {
                        deferred.reject();
                    }
                },
                error: function() {
                    deferred.reject();
                }
            });

            return deferred.promise();
        }

        function rander(content) {
            if (content) {
                $.each(offeridList, function(index, value) {
                    var stock = content[value].totalquantity;
                    if (stock) {
                        stockDomObj[value].text(stock).addClass('j-stock-success');
                    }
                });
            }
            stockDomObj = {};
        }
    }
    return {
        init:init
    };
});
```
>大致逻辑是先得到需要填写库存数量的dom，再根据data得到id。由于返回的json数据是用offerid作为key的。所以选择将每个offerid作为key，对应的dom作为值。

1. **var stockDomObj = {};**


之前的写法是: `stockDomObj=[]`,然后把dom顺序放进去，之后便利得到的json对象，依次赋值。犯了一个很严重的错误，json对象是没有顺序的。不能保证数组的dom顺序和json的对象顺序是一致的。不能确定萝卜放对了坑。其实有想到顺序遍历可能出现对不上的情况，不够保险，但是没有意识到问题的严重性，就直接用了数组，对象遍历。
2.  建立索引，提高运行速度

另外，建立对象的好处是，可以利用索引的优势，不用循环遍历，提高js运行速度。虽然`jQuery.inArray(param,arr)`也可以做到。但是不如 `obj[param]`来的直接。循环遍历数组这样简单粗暴，但是高损耗的方式，一定要尽量规避。

3.考虑周全，容错能力

ajax请求的失败情况是一定要写进去的。请求成功也要进一步判断数据的正确性。代码中，请求成功判断了一次，渲染dom时又判断了一次。保证真正的数据填入dom中。

4 目标打标，避免重复请求。

一开始的思路是存一个全局变量，将请求过的id放进去，每次将新得到的id和旧的id作比较，把数组中没有的传给getCount（）；但是这样不能解决全部问题，因为只要在调用时写了两处重复的define，就没有用了。而且数组遍历也不是办法，在offer量很大的时候，虽然也可以用对象建索引的方式改善。但引用两次的问题是没法解决的。
后来师父给出的思路是，渲染成功后给dom加一个class。这样就完美解决了。自己都没有想到这么好的方法。。。
好好记住。
另外，加了对offeridList 的判断，如果没有，就不再发起请求。节省了页面响应时间。确实是页面请求数据和复杂程度达到一定数量级，各个方面都到思考到位，努力做到极致。才会给用户一个尽量流畅的体验。

5 命名规范，

首先一个意思不能用两个词汇去表达。随心所欲自己以后看着一定会纠结。另外，起名字一定要语义化。不动脑筋的起了boolean=true；这样的变量名简直让师父无语了。应该用hasXXX，isXXX这样的命名啊！
写代码太过随意，完全不考虑后期的维护问题。想想也是，以前写的代码确实没有再去看过了。

6 代码抽象与解耦。

deferred 对象的使用，是的异步获取的数据与ajax分离，使得可以用得到的数据做更多的事情。可以把ajax获取数据这个方法完全剥离出来。实现了解耦。之前的方法是直接在后面接了done（）方法，这样虽然可以传`callback` 但是不够彻底。

抽象和解耦，并不是简单的把几行相关的代码，拿出来，包一个函数名存起来，就是了。这样简单粗暴的结果会是，把直线式的逻辑拆成了折线式，反倒更low了。

抽象要考虑函数可以被单独使用，函数体内不依赖其他的变量。可以作为独立的一环或者一个分支使用。就像获取异步数据的函数，如果拿不到传回来的数据，那在ajax外面包一层函数名的意义又在哪里呢？

