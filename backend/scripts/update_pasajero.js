const { pool } = require('../config/mysqlPool');
pool.query("UPDATE usuarios SET correo = 'kevincuesta0909@gmail.com' WHERE id_usuario = 1").then(()=>console.log("Updated to kevin")).finally(()=>process.exit(0));
