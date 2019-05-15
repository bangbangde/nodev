const fs = require('fs');
const path = require('path');
const mime = require('mime');

/**
 * 静态资源加载中间件，支持指定根目录。
 * 支持查询参数：
 * delay：指定延时时间 (s)
 * content-type: 指定资源类型(MIME)
 */
module.exports = async function fn(req, res, next) {
    let mUrl = new URL(req.url, 'http://' + req.headers.host);
    let pathname = mUrl.pathname;
    let mimeName = mime.getType(pathname);
    
    let delay = mUrl.searchParams.get('delay') || 0;
    let contentType = mUrl.searchParams.get('contentType') || mimeName;
    let root = fn.args.root || './';
    try {
        let file = await new Promise(function (resolve, reject) {
            let mPath = path.resolve(path.join(root, pathname));
            fs.readFile(mPath, function (err, file) {
                if (err) return reject(err);
                return resolve(file)
            })
        })
        res.writeHead(200, {'Content-Type': contentType});
        if(delay){
            setTimeout(function () {
                res.end(file);
            }, delay * 1000)
        }else{
            res.end(file);
        }
    } catch (error) {
        await next();
    }
    return;
}
