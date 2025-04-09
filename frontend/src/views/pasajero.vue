<template>
  <div class="pasajero-container">
    <h2>Soy Pasajero</h2>
    <p>Contenido de la vista pasajero.</p>
    <div id="map" class="map"></div>
    <button @click="generarSimulacion" class="simular-btn">Generar Simulación</button>
  </div>
</template>

<script>
import L from 'leaflet'; // Asegúrate que tengas leaflet instalado

export default {
  name: 'Pasajero',
  data() {
    return {
      map: null,
      marker: null,
      ruta: [],
      simulacionActiva: false,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // Coordenadas de Villahermosa, Tabasco
      const villahermosaCoords = [17.9874, -92.9290];
      
      this.map = L.map('map').setView(villahermosaCoords, 13); // Villahermosa

      // Estilo personalizado del mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Marker de la parada en Villahermosa
      this.marker = L.marker(villahermosaCoords).addTo(this.map)
        .bindPopup('Parada en Villahermosa')
        .openPopup();
    },

    generarSimulacion() {
      if (!this.map || this.simulacionActiva) {
        console.log('Ya está activa la simulación o el mapa no está listo.');
        return;
      }

      this.simulacionActiva = true;

      // Creamos una ruta aleatoria de 5 puntos
      const puntosRuta = [];
      let lat = 17.9874;
      let lng = -92.9290;
      
      // Generamos 5 puntos de ruta aleatoria cerca de Villahermosa
      for (let i = 0; i < 5; i++) {
        lat += (Math.random() - 0.5) * 0.01; // Desplazamiento aleatorio
        lng += (Math.random() - 0.5) * 0.01;
        puntosRuta.push([lat, lng]);
      }

      // Crear polilínea para la ruta
      const polyline = L.polyline(puntosRuta, { color: 'blue', weight: 4, opacity: 0.6 }).addTo(this.map);

      // Animar simulación
      this.moverSimulacion(puntosRuta);
    },

    moverSimulacion(puntosRuta) {
      let i = 0;
      const mover = () => {
        if (i < puntosRuta.length) {
          this.marker.setLatLng(puntosRuta[i]) // Mueve el marcador
            .bindPopup(`Punto ${i + 1}: ${puntosRuta[i].toString()}`)
            .openPopup();
          this.map.panTo(puntosRuta[i]); // Mueve el mapa a la posición

          i++;
          setTimeout(mover, 1000); // 1 segundo entre cada movimiento
        } else {
          console.log('Simulación finalizada');
          this.simulacionActiva = false; // Termina la simulación
        }
      };
      mover(); // Inicia el movimiento
    }
  }
};
</script>

<style scoped>
.pasajero-container {
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.map {
  height: 400px;
  width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.simular-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.simular-btn:hover {
  background-color: #0056b3;
}
</style>