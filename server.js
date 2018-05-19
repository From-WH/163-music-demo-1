var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method


    /******** 从这里开始看，上面不要看 ************/


    if (path === '/uptoken') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8')
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.removeHeader('Date')

        var config = fs.readFileSync('./qiniu-key.json')
        config = JSON.parse(config)

        let { accessKey, secretKey } = config;
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var options = {
            scope: '163-music-demo-1',    //篮子名字  七牛上的项目叫什么就写什么
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken = putPolicy.uploadToken(mac);
        response.write(`
        {
        "uptoken": "${uploadToken}"
        }
        `)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.write('找不到页面')
        response.end()
    }
            
    //以下为server服务器学习内容：
    // console.log('HTTP 路径为\n' + path)
    // if (path == '/style.css') {
    //     response.setHeader('Content-Type', 'text/css; charset=utf-8')
    //     response.write('body{background-color: #ddd;}h1{color: red;}')
    //     response.end()
    // } else if (path == '/main.js') {
    //     response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    //     response.write('alert("这是JS执行的")')
    //     response.end()
    // } else if (path == '/') {
    //     response.setHeader('Content-Type', 'text/html; charset=utf-8')
    //     response.write('<!DOCTYPE>\n<html>' +
    //         '<head><link rel="stylesheet" href="/style.css">' +
    //         '</head><body>' +
    //         '<h1>你好，Server.js</h1>' +
    //         '<script src="main.js"></script>' +
    //         '</body></html>')
    //     response.end()
    // } else {
    //     response.statusCode = 404
    //     response.end()
    // }








    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
