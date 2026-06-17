const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        const sql = fs.readFileSync('./database/metromedd (2).sql', 'utf8');
        
        // Extract INSERT INTO statements
        const inserts = sql.match(/INSERT INTO `[^`]+` \([^)]+\) VALUES\s*[\s\S]*?(?=;);/g) || [];
        
        console.log(`Se encontraron ${inserts.length} sentencias INSERT.`);
        
        for (let insert of inserts) {
            // Clean MySQL syntax: remove backticks
            insert = insert.replace(/`/g, '"');
            
            // Execute the insert
            try {
                await pgPool.query(insert);
                console.log('Insert ejecutado.');
            } catch (err) {
                console.error('Error ejecutando insert:', err.message);
                // Print first 100 chars of the insert for context
                console.error(insert.substring(0, 100) + '...');
            }
        }
        
        console.log('Migración de datos completada.');
    } catch (e) {
        console.error('Error general:', e);
    } finally {
        pgPool.end();
    }
}

migrate();
