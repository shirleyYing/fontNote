#Promise对象

## **构造函数**

```
var promise = new Promise(function(resolve, reject) {
 // 异步处理 
// 处理结束后、调用resolve 或 reject
 });
```


##用法：

```javascript

Function getPromise(){
    return new Promise(function(resolve,reject){
        var str=‘new promise’;
console.log(str);
        resolve(str);
}) ;
}
1 
getPromise().then(function fulfilled (value){
    console.log(value);   // --> new promise
}，function onRejected(error){
});
2
getPromise().then(function(value){
    console.log(value);   // --> new promise
}).catch(function(error){
})
```

>**1和2的写法等价。但2的写法更清楚一些。**
当getPromise()返回一个状态为resolve的promise对象时，会执行then（）中的onfullfilled函数，如果是reject 状态，就会执行后面的onRecjected 函数（或者是catch中的函数。）
2写法的有一点好处是，then() 执行过后会返回一个新的promise 对象，这样的话如果then函数体中抛出error错误，就会调用到后面的catch（）中的函数。
也就是说，catch（）可以出来来自getPromise（）或者then（）两个地方的出错信息。

 **Promise.resolve(value)**

相当于
```
new Promise(function(resolve){
    resolve(‘promise’);
})
```
用法：
```
Promise.resolve(42).then(function(value){
    console.log(value);       //--> 42
})
```
让promise对象立即进入resolve状态执行then（）中的函数，并将resolve中的数据传递给then中的函数。

**另一个作用**
    将thenable对象转换成promise对象
`henable` 是指具有`then()`法的对象，向有length属性的类数组对象一样。
jQuery.ajax()返回一个`jqXHR Object`对象，有`then()`。但是他没有`catch()`转换后就可以使用es 6 中promise对象的方法了。
```
 var promise = Promise.resolve($.ajax('/json/comment.json'));// -->promise对象  
 promise.then(function(value){    console.log(value); });
```
####Promise.resolve(value) 同步？
以为promise立即进入resolve的状态，给人同步的感觉，但是处理过程还是异步的。因为异步同步同时存在会产生处理混乱，所以同意采用异步方式处理回调函数。

**Promise chain**

Promise链式调用。

```
var promise = Promise.resolve(1);
promise
.then(fun1)
.then(fun2)
.catch(fun3)
.then(fun4)
```

链式调用中，每个then（）不仅是注册一个回调函数那么简单，他创建并产生一个新的promise对象传递给后面的函数，所以说，当某一个then（）中的函数抛出了异常，就直接会跳到catch（）。但是catch（）函数体中的异常还有fun4中的异常是没办法被捕获的。所以catch（）放在最后比较好，并且函数体内只做异常的处理，而不要做别的比较好。


##Promise 和deferred的区别
Defdrred包含Promise对象，并且具有操作promise对象的特权方法
```
function Deferred() {
    this.promise = new Promise(function (resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    }.bind(this));
}
Deferred.prototype.resolve = function (value) {
    this._resolve.call(this.promise, value);
};
Deferred.prototype.reject = function (reason) {
    this._reject.call(this.promise, reason);
};
function getURL(URL) {
    var deferred = new Deferred();
    var req = new XMLHttpRequest();
    req.open('GET', URL, true);
    req.onload = function () {
        if (req.status === 200) {
            deferred.resolve(req.responseText);
        } else {
            deferred.reject(new Error(req.statusText));
        }
    };
    req.onerror = function () {
        deferred.reject(new Error(req.statusText));
    };
    req.send();
    return deferred.promise;
}
// 运行示例
var URL = "http://httpbin.org/get";
getURL(URL).then(function onFulfilled(value){
    console.log(value);
}).catch(console.error.bind(console));
```
**deferred 对象可以实现在函数执行的任何时候改变promise对象的状态，而promise对象只能在构造函数体内调用`resolve（）`,相对灵活了很多。**

Promise代表了一个对象，这个对象的状态现在还不确定，但是未来一个时间点它的状态要么变为正常值（FulFilled），要么变为异常值（Rejected）；而Deferred对象表示了一个处理还没有结束的这种事实，在它的处理结束的时候，可以通过Promise来取得处理结果.

##Promise对象数组

>` Promise.all() `
>当promise对象数组中所有的promise对象状态全部变为resolve状态时，才执行后面的.then() 如果有的话。
>` Promise.race() `
>当promise对象数组中所有的promise对象状态有一个变为resolve状态时，就会执行后面的.then() 如果有的话。并且数组中还没有执行完的promise对象会继续执行。