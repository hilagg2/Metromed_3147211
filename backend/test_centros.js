const fetch = require('node-fetch');

async function testCentros() {
    try {
        const res = await fetch('http://localhost:5000/api/apoyo/centros?lat=6.2442&lon=-75.5812');
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Error fetching:", e.message);
    }
}
testCentros();
