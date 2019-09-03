const mysql = require('mysql')
const {MYSQL_CONF} =require('../config/db')

//创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

//开始连接
con.connect()

//执行SQL函数
function exec(sql) {
    const promise = new Promise((resolve,reject)=>{
        con.query(sql,(err,result) => {
            if(err){
                console.error(err)
                return
            }
            // console.log(`数据库的返回：${result}`)
            resolve(result)
        })
    })
    return promise
}

module.exports = {
    exec,
    escape:mysql.escape
}