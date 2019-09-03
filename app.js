const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const {access} = require('./src/untils/log')

let SESSION_DATA = {}

//处理postData
const getPostData = (req) => {
    const promise = new Promise((resolve,reject) => {
        if(req.method !== 'POST'){
            resolve({})
            return
        }
        if(req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
            let postData = ''
            req.on('data',chunk => {
                postData += chunk.toString()
            })
            //请求结束时的操作
            req.on('end',()=> {
                console.log(postData);
                if(!postData){
                    resolve({})
                    return
                }
                resolve(
                    JSON.parse(postData)
                )
            })
        })
        return promise
}

//获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24*60*60*1000))
    // console.log('toGMTString',d.toGMTString());
    return d.toGMTString()
}

const serverHandle = (req,res) => {
    // console.log(req.body);
    //记录 access.log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)


    //头
    res.setHeader("Access-Control-Allow-Headers","*")
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4444');
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Content-Type','application/json')
    // res.setHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log(req.body);
    //获取path和method
    const url = req.url
    req.path = url.split('?')[0]

    //解析query
    req.query = querystring.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if(!item){
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    });

    //解析session
    let needSetCookie = false
    let {userid} = req.cookie
    if(userid) {
        if(!SESSION_DATA[userid]){
            SESSION_DATA[userid] = {}
        }
    } else {
        needSetCookie = true
        userid = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userid] = {}
    }
    req.session = SESSION_DATA[userid]


    //处理post data
    getPostData(req).then(postData=> {
        req.body =postData


        //处理blog理由
        const blogResult = handleBlogRouter(req,res)
        if(blogResult){
            blogResult.then(blogData => {
                if(needSetCookie){
                    res.setHeader(`Set-Cookie`,`userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`);
                    //path=/ 指这个cookie在根路径所有都生效  httpOnly只能服务端修改，expires是cookie到期时间
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        
        const userResult = handleUserRouter(req,res)
        if(userResult){
            userResult.then(userData => {
                if(needSetCookie){
                    res.setHeader(`Set-Cookie`,`userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        //404
        res.writeHead(404,{'Content-type':'text/plain'})
        res.write('404 Not Found!\n')
        res.end()
    })  
    

}

module.exports = serverHandle

//process.env.NODE_ENV