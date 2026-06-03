var map = L.map('map', {
  zoomControl: false
}).setView([8.2377, -73.3560], 15);

L.control.zoom({
  position: 'topright'
}).addTo(map);

var base = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

var tratamientosLayer = L.layerGroup().addTo(map);
var textosLayer = L.layerGroup().addTo(map);

function colorPorTipo(tipo) {
  if (tipo === "BIC DEP") return "#7cc800";
  if (tipo === "BIC MUN") return "#b5e61d";
  if (tipo === "BIC NAL") return "#fff200";
  if (tipo === "tipologica") return "#ff9900";
  if (tipo === "valor arquitectonico") return "#ff6600";
  if (tipo === "predios sin valor") return "#ffffff";
  return "#cccccc";
}

function popupPatrimonial(feature) {
  var p = feature.properties;

  return `
    <h3>${p.Tipo || "Sin tipo"}</h3>
    <b>Descripción:</b> ${p.descripcion || "Sin información"}<br>
    <b>Criterio:</b> ${p.criterio || "Sin información"}<br>
    <b>Restricción:</b> ${p.restriccion || "Sin información"}<br>
    <b>Norma:</b> ${p.norma || "Sin información"}
  `;
}

fetch('data/tratamientos.geojson')
  .then(res => res.json())
  .then(data => {
    var capa = L.geoJSON(data, {
      style: function(feature) {
        return {
          color: "#333",
          weight: 1,
          fillColor: colorPorTipo(feature.properties.Tipo),
          fillOpacity: 0.65
        };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(popupPatrimonial(feature));
      }
    });

    tratamientosLayer.addLayer(capa);
    map.fitBounds(capa.getBounds());
  });

fetch('data/annotation.geojson')
  .then(res => res.json())
  .then(data => {
    var capa = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { opacity: 0 });
      },
      onEachFeature: function(feature, layer) {
        var texto = feature.properties.TextString || feature.properties.Text || feature.properties.Layer || "";
        layer.bindTooltip(texto, {
          permanent: true,
          direction: "center",
          className: "label-mapa"
        });
      }
    });

    textosLayer.addLayer(capa);
  });

document.getElementById("chkTratamientos").addEventListener("change", function() {
  if (this.checked) {
    map.addLayer(tratamientosLayer);
  } else {
    map.removeLayer(tratamientosLayer);
  }
});

document.getElementById("chkTextos").addEventListener("change", function() {
  if (this.checked) {
    map.addLayer(textosLayer);
  } else {
    map.removeLayer(textosLayer);
  }
});
