# 搭建公用头尾方法
## 概念介绍
1.  区块：最基本的代码块。对代码片段的一种封装，提高复用性。
2.  静态页面：cms页面（盒子页面，源代码页面）。页面编译只在点击发布时发生，页面上包含的内容修改，以及数据的更新，都需要重新发布页面，才可以生效。静态页面的内容不包括头尾，头尾在页面属性中进行选择。
3.  动态页面：由后端根据数据生成的页面。
4.   extenal页面：后端调用的页面，一个extenal页面只能对应一个后端app。
5.  ESI区块：引用方式为ESI引用的区块，选择这种引用方式的区块的特点是，如果该区块有改动，所有包含该区块的**静态页面**（只有静态页面）以自动更新该区块内容，不用重新发布页面来达到更新区块内容的效果。



> **为什么会存在extenal页面？**

> 动态页面由java生成，但是页面的头尾是固定的。并不需要后端用数据渲染。并且头尾代码是由前端同学完成，后端直接存储代码段的话，代码修改，后端不好维护。所以需要对区块进行包装，包装方式就是extenal页面。如果新建extenal页面时选择了”需要渲染“，extenal页面会按照velocity语法将内容编译一遍。后端调用extenal页面时，会再次编译，最终生成头尾。这样也给后端设置参数提供了机会。

------------


> **静态页面数据打点问题**

>静态页面只能对内容部分进行数据打点。头尾不包括在内。如果需要对头尾进行打点，需要将头尾做成组件，添加到页面中。

## 关联关系
![Alt text](../../images/tool_3_related.jpg)


首先编写头尾区块。为了解决一些问题和适合一些应用场景，给区块穿了三件不同外衣。
1.  为了能够使静态页面自动更新该区块代码，将区块包在ESI 区块中。
2.  为了解决静态页面只支持对内容进行数据打点的问题。将头尾区块包在组件中。
3.  为了解决动态页面需要头尾代码问题，将区块包在extenal页面中供动态页面使用。

## 如何搭建
以采购商城首页公共头部为例。
### 供静态页面使用
1.  编写头部区块内容，caigou_header.
2.  在旧类目站点下新建一个区块，masthead_caigou_v6_esi。在该区块中引入caigou_header。页面属性中供选择的公共头尾只显示旧类目站点下的区块。所以必须建在旧类目站点下。
代码如下：

```javascript
#set($caigou_header_useinapp=false)
#set($caigou_header_alibar=true)
#set($caigou_header_notice=true)
#set($caigou_header_help=true)
#set($caigou_header_search=true)
#set($caigou_header_nav=true)
#set($caigou_header_nav_selfopen=false)

##set the param below in app to add a title
##set($caigou_header_title="")

#parse("caigou_header")

```
3.若有对头部进行数据打点的需要，新建头部组件，只展示部分代码。

```javascript
<script type="text/dcms-param">
@param({
   ···
});
</script>


#set($caigou_header_useinapp = false)
#set($caigou_header_notice = true)
#set($caigou_header_alibar = ($headerAlibar.value.value == "1"))
#set($caigou_header_help = ($headerHelp.value.value == "1"))
#set($caigou_header_search = ($headerSearch.value.value == "1"))
#set($caigou_header_cart = ($headerCart.value.value == "1"))
#set($caigou_header_nav = ($headerNav.value.value == "1"))
#set($caigou_header_nav_expand = ($headerNavExpand.value.value == "1"))

#set($caigou_header_nav_current = $headerNavCurrent.value)
#set($caigou_header_title = $headerTitle.value)

#parse("caigou_header")
```

### 供后端使用
新建extenal页面。caigou_header_rate。
caigou_header_rate代码：

```javascript
#set($caigou_header_useinapp=true)
#set($caigou_header_alibar=false)
#set($caigou_header_search=false)
#set($caigou_header_nav=false)

##set the param below in app to add a title
##set($caigou_header_title="")

#parse("caigou_header")

```

该extenal页面中需要后端控制参数，所以在区块caigou_header添加了开关控制。

```javascript
 #if($caigou_header_useinapp)
            \#if($caigou_header_title && $caigou_header_title != "")
            <h1>$caigou_header_title</h1>
            \#else
            <img class="ali-market-img" width="185" height="18" src="//cbu01.alicdn.com/cms/upload/2015/513/083/2380315_1173562213.png" />
            \#end
#else
```

`\#if` 经过编译后会变为`#if`，以供后端拿到页面后继续编译。

## 修改区块后需要做什么

区块caigou_header 修改提交后，需要：
1. 发布所有引用该模块的extenal页面
2. 发布引入该区块的组件所在页面
3. 发布引入该区块的ESI区块