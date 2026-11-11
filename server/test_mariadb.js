const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

async function test() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 5000
        });
        
        console.log("CONNECTED TO MARIADB!");
        const [rows] = await db.execute("SHOW TABLES");
        console.log(rows);
        db.end();
    } catch (e) {
        console.log("FAILED TO CONNECT:");
        console.log(e.stack);
    }
}
test();
