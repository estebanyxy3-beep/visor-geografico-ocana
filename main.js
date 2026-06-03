var map = L.map('map').setView([8.2377, -73.3560], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

console.log("Leaflet cargó bien");
