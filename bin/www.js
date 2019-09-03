//逻辑拆分： bin/www →  app  → router/blog → controller/blog        model
//            服务     总和     只关心路由      只关心数据          创建数据模型，以一个固定形式返回
const http = require('http');

const PORT = 6060
const serverHandle = require('../app.js')
const server = http.createServer(serverHandle)

server.listen(PORT)
// ${process.env.NODE_ENV}
console.log(`Server running at http://127.0.0.1:${PORT}/`);