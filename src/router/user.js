const {login} = require('../controller/user')
const {SuccessModel,ErrorModel} = require('../model/resModel')



const handleUserRouter = (req,res) => {
    // const method = req.method 
    // console.log(req.method )
    
    //登录
    if(req.method  === 'POST' && req.path === '/api/login'){
        const {username,password} = req.body
        // console.log(username,req.body)
        const result = login(username,password)
        return result.then (data => {
            if(data.username){
                //设置session
                req.session.username = data.username
                req.session.realname = data.realname
                console.log('session',req.session);
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }
    //登录验证
    

}

module.exports = handleUserRouter 