const { MongoClient } = require('mongodb');
let client = {} 

module.exports = function(uri, prop, opts) {
  return async function createMongodbConnection(req, res, next) {
//    console.log(process.env.NODE_TYPE, client, new Date())
    if (typeof client[prop] === 'undefined') {
      // Создаем новый пул подключений
      client[prop] = await MongoClient.connect(uri, opts)
      console.log(`Create connection pool for ${uri} - Prop: ${prop} Client: ${client} ${process.env.NODE_TYPE} PORT: ${process.env.PORT}`)
      console.dir(client)
    }
    req[prop] = client[prop].db()
    next()
  }
} 
