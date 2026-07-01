require('dotenv').config();
const { generarRespuesta } = require('./services/geminiService');

async function testGemini() {
    console.log('Probando conexión con Gemini...');
    console.log('API Key configurada:', process.env.GEMINI_API_KEY ? 'Sí (Oculta por seguridad)' : 'No');
    
    try {
        const resultado = await generarRespuesta('Hola, ¿cómo estás?', [], 'Línea 106');
        console.log('\n✅ Conexión exitosa. Respuesta de Gemini:');
        console.log(resultado);
    } catch (error) {
        console.error('\n❌ Error al conectar con Gemini:');
        console.error(error);
    }
}

testGemini();
