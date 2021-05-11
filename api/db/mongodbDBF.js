const db = 'patients_dbf';
const conf = { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 10 };
const host = 'mongodb://10.6.0.159:27017/';
const client = require('mongodb').MongoClient;

function connection(req, res, next) {
    client.connect(host, conf, (err, connect) => {
    	if (err) { throw err };
        req.dbf = connect.db(db);
        next();
    })
}

module.exports = connection;
