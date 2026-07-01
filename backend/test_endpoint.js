const fetch = require('node-fetch'); // This might not be installed, better use native HTTP or fetch if Node >= 18.
// Node 18+ has native fetch. Let's assume Node 18+.

async function testEndpoint() {
    try {
        const res = await fetch('http://localhost:5000/api/apoyo/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensaje: 'hola' })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Error fetching:", e.message);
    }
}
testEndpoint();
