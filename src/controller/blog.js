 const {exec} = require('../db/mysql')

 const getList = (author,keyword) => {
     // 1=1 起语法正确作用。因为 author和keyword不确定
      let sql = `select * from blogs where 1=1 `

      if(author){
          sql += ` and author = '${author}'`
      }

      if(keyword){
        sql += `and title like  '%${keyword}%'`
      }
      sql += `order by createtime desc;`
      
      //返回promise
      return exec(sql)

 }

 const getDetail = (id) => {
     const sql = `select * from blogs where id='${id}'`
     return exec(sql).then(rows => {
         return rows[0]
     })
 }

 const newBlog = (blogData = {}) => {``
    const {title,content,author} = blogData
    const createTime = Date.now()
    const sql = `
    insert into blogs (title,content,author,createTime)
    values ('${title}','${content}','${author}',${createTime});
    `
    if([title,content,author].includes(undefined)){
        return new Promise((resolve,reject)=>{
            resolve('参数错误')
        })
    }else{
        return exec(sql).then(insertData => {
        // let data = (JSON.stringify(insertData))
        // console.log(`insertData is ${data}`,insertData.insertId);
        return {
                id : insertData.insertId
            }
        })
    }
    
 }

 const updateBlog = (id,blogData = {}) => {
    const {title,content} = blogData
    
    const sql = `
    update blogs set title='${title}',content='${content}' where id = ${id}
    `
    if([title,content].includes(undefined)){
        return new Promise((resolve,reject)=>{
            resolve('参数错误')
        })
    }else{
        return exec(sql).then(updateData => {
            if(updateData.affectedRows > 0){
                return true
            }
            return false
        })
    }

}

const delBlog = (id,author) => {
    
    const sql = `
    delete from blogs where id = '${id}' and author = '${author}';
    `
        return exec(sql).then(delData => {
            if(delData.affectedRows > 0){
                return true
            }
            return false
        })
    

}

 module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
 }