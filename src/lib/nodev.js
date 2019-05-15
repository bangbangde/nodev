const http = require('http');

class Nodev {
    constructor(){
        this.middleware = [];
    }

    use(fn, args){
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function');
        switch (Object.prototype.toString.call(fn)) {
            case '[object Function]': fn.type = 0; break;
            case '[object GeneratorFunction]': fn.type = 1; break;
            case '[object AsyncFunction]': fn.type = 2; break;
            default: throw new TypeError();
        }
        fn.args = args || Object.create(null);
        this.middleware.push(fn);
    }

    callback(){
        let length = this.middleware.length;
        let callbacks = this.middleware;
        function cb(req, res) {
            let currentCallbackIndex = 0;
            async function next() {
                if(++currentCallbackIndex < length){
                    await callbacks[currentCallbackIndex](req, res, next)
                }
            }
            callbacks[currentCallbackIndex](req, res, next)
        }
        return cb;
    }

    listen(port){
        http.createServer(this.callback()).listen(port, function () {
            console.log(`Server running at http://127.0.0.1:${port}/`);
        });
    }
}

module.exports = Nodev;
