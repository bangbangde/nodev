const {URL} = require('url');
const path = require('path');
const Nodev = require('./lib/nodev');
const staticFile = require('./middlewares/static-file');

let app = new Nodev();
app.use(staticFile);
app.use(async function(req, res, next){
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.end(`
        <h1>hello developer</h1>
        <ul>
            <li><a href='assets/index.html'>html资源加载demo(禁用缓存并设置了延时)</a></li>
        </ul>
    `);
})
app.listen(3000);
