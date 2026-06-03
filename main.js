var map = L.map('map').setView([8.2377, -73.3560], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 19
}).addTo(map);

var capaPatrimonio = L.layerGroup().addTo(map);
var capaAnnotation = L.layerGroup().addTo(map);

function colorPorTipo(tipo) {
  tipo = (tipo || "").trim();

  if (tipo === "BIC DEP") return "#7cc800";
  if (tipo === "BIC MUN") return "#b5e61d";
  if (tipo === "BIC NAL") return "#fff200";
  if (tipo === "tipologica") return "#ff9900";
  if (tipo === "valor arquitectonico") return "#ff6600";
  if (tipo === "predios sin valor") return "#d9d2e9";

  return "#cccccc";
}

function popupPatrimonio(feature) {
  var p = feature.properties;

  return `
    <h3>${p.Tipo || "Sin información"}</h3>
    <b>Descripción:</b><br>${p.descripcio || "Sin información"}<br><br>
    <b>Criterio:</b><br>${p.criterio || "Sin información"}<br><br>
    <b>Restricción:</b><br>${p.restriccio || "Sin información"}<br><br>
    <b>Norma:</b><br>${p.norma || "Sin información"}
  `;
}

fetch('data/Patrimonio_cultural_json.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("No se encontró Patrimonio_cultural_json.json");
    }
    return response.json();
  })
  .then(data => {
    var geojson = L.geoJSON(data, {
      style: function(feature) {
        return {
          color: "#444",
          weight: 1,
          fillColor: colorPorTipo(feature.properties.Tipo),
          fillOpacity: 0.75
        };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(popupPatrimonio(feature));
      }
    });

    capaPatrimonio.addLayer(geojson);
    map.fitBounds(geojson.getBounds());
    console.log("Patrimonio cargado correctamente");
  })
  .catch(error => {
    console.error("Error cargando Patrimonio_cultural_json.json:", error);
  });

fetch('data/Annotation_json.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("No se encontró Annotation_json.json");
    }
    return response.json();
  })
  .then(data => {
    var annotation = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { opacity: 0 });
      },
      onEachFeature: function(feature, layer) {
        var p = feature.properties;
        var texto = p.TextString || p.Text || p.Layer || "";

        if (texto !== "") {
          layer.bindTooltip(texto, {
            permanent: true,
            direction: "center",
            className: "label-mapa"
          });
        }
      }
    });

    capaAnnotation.addLayer(annotation);
    console.log("Annotation cargado correctamente");
  })
  .catch(error => {
    console.error("Error cargando Annotation_json.json:", error);
  });

document.getElementById("chkPatrimonio").addEventListener("change", function() {
  if (this.checked) {
    map.addLayer(capaPatrimonio);
  } else {
    map.removeLayer(capaPatrimonio);
  }
});

document.getElementById("chkAnnotation").addEventListener("change", function() {
  if (this.checked) {
    map.addLayer(capaAnnotation);
  } else {
    map.removeLayer(capaAnnotation);
  }
});
