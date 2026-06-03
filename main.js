fetch('data/tratamientos.geojson')
.then(response => response.json())
.then(data => {
  let capa = L.geoJSON(data, {
    style: function(feature) {
      return {
        color: "#444",
        weight: 1,
        fillColor: colorPorTipo(feature.properties.Tipo),
        fillOpacity: 0.75
      };
    },
    onEachFeature: function(feature, layer) {
      let p = feature.properties;
      layer.bindPopup(`
        <h3>${p.Tipo || "Sin información"}</h3>
        <b>Descripción:</b><br>${p.descripcion || ""}<br><br>
        <b>Criterio:</b><br>${p.criterio || ""}<br><br>
        <b>Restricción:</b><br>${p.restriccion || ""}<br><br>
        <b>Norma:</b><br>${p.norma || ""}
      `);
    }
  });
  capa.addTo(map);
  map.fitBounds(capa.getBounds());
})
.catch(error => {
  console.log("Error cargando GeoJSON:", error);
});
