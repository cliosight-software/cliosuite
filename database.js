

const mysql = require('mysql2');
const dbConnection = mysql.createPool({
	connectionLimit: 10,
    socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`, // GCP MYSQL HOST NAME
    //host     : process.env.CLOUD_SQL_CONNECTION_NAME, 
    user     : process.env.CLOUD_SQL_USERNAME,        // MYSQL USERNAME
    password : process.env.CLOUD_SQL_PASSWORD,    // MYSQL PASSWORD
    database : process.env.CLOUD_SQL_DATABASE_NAME      // MYSQL DB NAME
}).promise();
module.exports = dbConnection;
