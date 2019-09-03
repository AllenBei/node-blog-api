const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const {SuccessModel,ErrorModel} = require('../model/resModel')

//统一登录验证函数
const loginCheck = (req) => {
    if(!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
    
}

const handleBlogRouter = (req,res) => {
    const method = req.method 
    const id = req.query.id
    //获取blog列表
    if(method === 'GET' && req.path === '/api/blog/list'){
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const result = getList(author,keyword)
        return result.then(listData => {
            return new SuccessModel (listData)
        })
    }

    //获取blog详情
    if(method === 'GET' && req.path === '/api/blog/detail'){
        // const detailData = getDetail(id)
        // return new SuccessModel(detailData)
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    //新建bolg
    if(method === 'POST' && req.path === '/api/blog/new'){

        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登录
            return loginCheckResult
        }

        req.body.author = req.session.username 
        const result = newBlog(req.body)
        // console.log(typeof(result),result)
        if(typeof(result)=="object"){
            return result.then(val => {
                if(typeof(val)!=='string'){
                    return new SuccessModel('更新成功')
                }else{
                    return new ErrorModel(val)
                }
            })
        }else{
            return new ErrorModel('更新失败')
        }
    }
    //更新
    if(method === 'POST' && req.path === '/api/blog/update'){

        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登录
            return loginCheckResult
        }

        const result = updateBlog(id,req.body)
        return result.then(val => {
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel("更新博客失败")
            }
        })
    }
    //删除bolg
    if(method === 'POST' && req.path === '/api/blog/del'){

        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登录
            return loginCheckResult
        }

        const author = req.session.username
        const result = delBlog(id,author)
        return result.then(val => {
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel("删除博客失败")
            }
        })
    }
}

module.exports = handleBlogRouter