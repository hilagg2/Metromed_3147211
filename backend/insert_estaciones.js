const { Pool } = require('pg');
require('dotenv').config({path: './.env'});
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const estaciones = [
    [1, 'Estación Niquía', 'BAJO'], [2, 'Estación Bello', 'MEDIO'], [3, 'Estación Madera', 'ALTO'],
    [4, 'Estación Acevedo', 'BAJO'], [5, 'Estación Tricentenario', 'MEDIO'], [6, 'Estación Caribe', 'ALTO'],
    [7, 'Estación Universidad', 'MEDIO'], [8, 'Estación Hospital', 'BAJO'], [9, 'Estación Prado', 'ALTO'],
    [10, 'Estación Parque Berrío', 'MEDIO'], [11, 'Estación San Antonio', 'ALTO'], [12, 'Estación Alpujarra', 'MEDIO'],
    [13, 'Estación Exposiciones', 'BAJO'], [14, 'Estación Industriales', 'ALTO'], [15, 'Estación Poblado', 'MEDIO'],
    [16, 'Estación Aguacatala', 'BAJO'], [17, 'Estación Ayurá', 'MEDIO'], [18, 'Estación Envigado', 'ALTO'],
    [19, 'Estación Itagüí', 'BAJO'], [20, 'Estación Sabaneta', 'MEDIO'], [21, 'Estación La Estrella', 'ALTO'],
    [22, 'Estación Caldas', 'BAJO'], [23, 'Estación Aranjuez', 'MEDIO'], [24, 'Estación Manrique', 'ALTO'],
    [25, 'Estación Santa Cruz', 'BAJO'], [26, 'Estación Acevedo Norte', 'MEDIO'], [27, 'Estación Buenos Aires', 'ALTO'],
    [28, 'Estación Castilla', 'BAJO'], [29, 'Estación 12 de Octubre', 'MEDIO'], [30, 'Estación Tetuan', 'ALTO'],
    [31, 'Estación Robledo', 'BAJO'], [32, 'Estación San Javier', 'MEDIO'], [33, 'Estación Santa Lucía', 'ALTO'],
    [34, 'Estación El Volador', 'BAJO'], [35, 'Estación Belén', 'MEDIO'], [36, 'Estación Nueva Villa de Aburrá', 'ALTO'],
    [37, 'Estación El Poblado Sur', 'BAJO'], [38, 'Estación Guayabal', 'MEDIO'], [39, 'Estación Estadio', 'ALTO'],
    [40, 'Estación Suramericana', 'BAJO'], [41, 'Estación Nutibara', 'MEDIO'], [42, 'Estación Cisneros', 'ALTO'],
    [43, 'Estación Berrio Norte', 'BAJO'], [44, 'Estación Miraflores', 'MEDIO'], [45, 'Estación Villa Hermosa', 'ALTO'],
    [46, 'Estación Buenos Aires Norte', 'BAJO'], [47, 'Estación Campo Valdés', 'MEDIO'], [48, 'Estación Alejandro Echavarría', 'ALTO'],
    [49, 'Estación Oriente', 'BAJO'], [50, 'Estación Doce de Octubre Norte', 'MEDIO'], [51, 'Estación Floresta', 'ALTO'],
    [52, 'Estación Santa Elena', 'BAJO'], [53, 'Estación Moravia', 'MEDIO'], [54, 'Estación La Macarena', 'ALTO'],
    [55, 'Estación Caicedo', 'BAJO'], [56, 'Estación Girardot', 'MEDIO'], [57, 'Estación Perpetuo Socorro', 'ALTO'],
    [58, 'Estación Loreto', 'BAJO'], [59, 'Estación Cuarta Brigada', 'MEDIO'], [60, 'Estación Cerro Nutibara', 'ALTO'],
    [61, 'Estación San Diego', 'BAJO'], [62, 'Estación Parque Norte', 'MEDIO'], [63, 'Estación Universidad Pontificia Bolivariana', 'ALTO'],
    [64, 'Estación Centro Administrativo La Alpujarra', 'BAJO'], [65, 'Estación Teatro Pablo Tobón Uribe', 'MEDIO'],
    [66, 'Estación Plazuela Nutibara', 'ALTO'], [67, 'Estación Centro', 'BAJO'], [68, 'Estación La Candelaria', 'MEDIO'],
    [69, 'Estación Villanueva', 'ALTO'], [70, 'Estación Copacabana', 'BAJO'], [71, 'Estación Girardota', 'MEDIO'],
    [72, 'Estación Barbosa', 'ALTO'], [73, 'Estación Santo Domingo', 'BAJO'], [74, 'Estación Popular', 'MEDIO'],
    [75, 'Estación Granizal', 'ALTO'], [76, 'Estación Andalucía', 'BAJO'], [77, 'Estación Villa Sierra', 'MEDIO'],
    [78, 'Estación La Aurora', 'ALTO'], [79, 'Estación San Cristóbal', 'BAJO'], [80, 'Estación El Mirador', 'MEDIO'],
    [81, 'Estación Juan XXIII', 'ALTO'], [82, 'Estación Vallejuelos', 'BAJO'], [83, 'Estación La Frontera', 'MEDIO'],
    [84, 'Estación Zamora', 'ALTO'], [85, 'Estación Arví', 'BAJO'], [86, 'Estación Picacho', 'MEDIO'],
    [87, 'Estación Cristo Rey', 'ALTO'], [88, 'Estación 20 de Julio', 'BAJO'], [89, 'Estación La Paz', 'MEDIO'],
    [90, 'Estación El Salvador', 'ALTO'], [91, 'Estación Enciso', 'BAJO'], [92, 'Estación Ayacucho', 'MEDIO'],
    [93, 'Estación Manzanares', 'ALTO'], [94, 'Estación Campo Alegre', 'BAJO'], [95, 'Estación Llanaditas', 'MEDIO'],
    [96, 'Estación Los Alpes', 'ALTO'], [97, 'Estación San Antonio de Prado', 'BAJO'], [98, 'Estación Bethel', 'MEDIO'],
    [99, 'Estación Altavista', 'ALTO'], [100, 'Estación La Magnolia', 'BAJO'], [101, 'Estación Pajarito', 'MEDIO']
];

async function insert() {
  await pgPool.query(`CREATE TABLE IF NOT EXISTS estaciones (
      id_estacion INT PRIMARY KEY,
      nombre_estacion VARCHAR(100) NOT NULL,
      nivel_congestion VARCHAR(10) NOT NULL,
      ultima_actualizacion TIMESTAMP NOT NULL DEFAULT NOW()
  )`);
  
  for (const [id, nombre, nivel] of estaciones) {
    try {
      await pgPool.query(
        'INSERT INTO estaciones (id_estacion, nombre_estacion, nivel_congestion) VALUES ($1, $2, $3) ON CONFLICT (id_estacion) DO NOTHING',
        [id, nombre, nivel]
      );
    } catch (e) {
      console.error(e);
    }
  }
  console.log('Insertadas ' + estaciones.length + ' estaciones.');
  process.exit(0);
}
insert();
