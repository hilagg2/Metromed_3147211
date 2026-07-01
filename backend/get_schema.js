const { pool } = require('./config/database');

async function checkSchema() {
    try {
        const [rows] = await pool.query('SHOW COLUMNS FROM usuarios');
        console.log(rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
checkSchema();
