var map = L.map('map').setView([8.2377,-73.3560],15);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
 attribution:'© OpenStreetMap'
}).addTo(map);

function colorPorTipo(tipo){

 if(tipo==="BIC DEP") return "#7cc800";

 if(tipo==="BIC MUN") return "#b5e61d";

 if(tipo==="BIC NAL") return "#fff200";

 if(tipo==="tipologica") return "#ff9900";

 if(tipo==="valor arquitectonico") return "#ff6600";

 if(tipo==="predios sin valor") return "#d9d2e9";

 return "#cccccc";
}

fetch('data/Patrimonio_cultural_json.json')
.then(response=>response.json())
.then(data=>{

 let capa=L.geoJSON(data,{

   style:function(feature){

      return{
        color:"#444",
        weight:1,
        fillColor:colorPorTipo(feature.properties.Tipo),
        fillOpacity:0.75
      }

   },

   onEachFeature:function(feature,layer){

      let p=feature.properties;

      layer.bindPopup(`
      <h3>${p.Tipo || "Sin información"}</h3>

      <b>Descripción:</b><br>
      ${p.descripcion || ""}<br><br>

      <b>Criterio:</b><br>
      ${p.criterio || ""}<br><br>

      <b>Restricción:</b><br>
      ${p.restriccion || ""}<br><br>

      <b>Norma:</b><br>
      ${p.norma || ""}
      `);

   }

 });

 capa.addTo(map);

 map.fitBounds(capa.getBounds());

})
.catch(error=>{

 console.log(error);

});
