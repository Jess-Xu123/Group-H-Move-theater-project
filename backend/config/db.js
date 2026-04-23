require('dotenv').config()
const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (sql, values = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await pool.query(sql, values)
            resolve(result)
        } catch(error) {
            console.error("Database Query Error:", error);
            reject(error.message)
        }
    })
}

module.exports = {query};