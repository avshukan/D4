const db = 'patients_dbf';
const conf = { useNewUrlParser: true };
const host = 'mongodb://10.6.0.159:27017/';
const client = require('mongodb').MongoClient;

function connection(req, res, next) {
    client.connect(host, conf, (err, connect) => {
    	console.log('----------------------->', err, connect);
        req.dbf = connect.db(db);
        next();
    })
}

module.exports = connection;
