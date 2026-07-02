const fs = require('fs');
const path = require('path');
const { pool } = require('../config/mysqlPool');

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'migration_admin_modules.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        // Split by ';' to run multiple statements
        const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
        
        for (const stmt of statements) {
            console.log(`Executing: ${stmt.substring(0, 50)}...`);
            await pool.query(stmt);
        }
        
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit(0);
    }
}

runMigration();
