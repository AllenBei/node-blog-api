const fs = require('fs')
const path = require('path')

//一个读写拆成三个函数，可以学习下


//写日志
function writeLog(writeStream,log) {
    writeStream.write(log + '\n')
}

//生成 write stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname,'../','../','logs',fileName)
    const writeStream = fs.createWriteStream(fullFileName,{
        flags:'a'
    })
    return writeStream
}

const accessWriteStream = createWriteStream('access.log')

function access(log) {
    writeLog(accessWriteStream,log)
}

module.exports = {
    access
}