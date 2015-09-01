#node网络爬虫小例子
```
var superagent = require('superagent');
var http = require('http');
var urlModel=require('url');


http.createServer(function(req, res) {
    // var host='http://segmentfault.com/';
    var host='http://caigou.1688.com';

    var path=req.url;
    if(path==='/'){
        path = host;
    }else{
        path=host+urlModel.parse(path).pathname;
    }
    superagent
    .get(path)
    .set('encoding','null')
    .end(function(err, data) {
        if (err) {
            console.error(err);
            res.end('error:'+data.statusCode);
        }else{
            if(data.ok){
                // res.writeHead(data.statusCode,data.header);
                var encoding=data.charset;
                req.setEncoding(encoding);
                var str=iconv.decode(data.text,encoding);
                res.end(data.text);
            }else{
                console.log(data.statusCode);
                res.end('error:'+data.statusCode);
            }
        }

    });
}).listen(3000, function() {
    console.log('Server running at http://127.0.0.1:3000/');
});
```
尝试用superagent 发起http请求，把请求到的数据，展示到页面中。但是尝试了中文编码的网站后，就呵呵了，乱码了。用调试器调试之后，发现superagent返回一个自己封装的response对象，  `data.text  ` 已经是乱码。查看过github上的api后，修改无果。放弃使用。改用大名鼎鼎的request库。
```
var http = require('http');
var request = require('request');
var urlModel = require('url');
// var iconv = require('iconv-lite');

http.createServer(function(req, res) {

    // var host='http://segmentfault.com';
    var host = 'http://caigou.1688.com';
    var url = req.url;
    var header = {};
    var status = '';
    url = host + urlModel.parse(url).pathname;
    request({
        url: url,
        encoding: null // 这个是关键
    }, function(err, mes, body) {
        if (err) {
            console.error(err);
            // res.end('error:' + data.statusCode);
            return;
        }
        // html = iconv.decode(body, 'gbk');
        res.end(body);
    });
}).listen(3000, function() {
    console.log('Server running at http://127.0.0.1:3000/');
});
```
`iconv-lite ` 是专门用来转码的库，后来发现用不着，但是还是学到了一些东西。
因为node在得到数据流后默认会做utf-8的编码，这样如果是数据是gbk格式的话，就已经变成了乱码，后面按照对应格式解码是没有用的。

    iconv.decode(body, 'gbk');
body按照 一定的格式解码成utf-8，使得内容在node环境下可读。因为node内部只支持utf-8的编码。但是如果展示到网页上，由于这里的body，是一个完整的html页面代码，包含网页头部信息，浏览器会根据header自动识别编码格式，按照正确的格式展示到网页上。

如果是这样

     html = iconv.decode(body, 'gbk');
     res.end(html);
浏览器显示乱码，因为这时候html是utf8的编码，而浏览器会按照头部信息用gbk展示。所以会乱码。

**PS：两种乱码显示**

gbk用utf-8 展示 出现黑色方框，中间问号
urf-8 用gbk展示，锟斤拷。