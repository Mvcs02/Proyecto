<template>
    <div class="container mt-5">
      <!-- Botones de acción -->
      <div class="d-flex justify-content-between mb-4 flex-wrap gap-3">
        <button class="btn btn-primary shadow-sm mb-2" @click="openRouteDialog">
          <i class="bi bi-plus-lg me-2"></i>Agregar Ruta
        </button>
      </div>
  
      <!-- Modal de agregar ruta -->
      <dialog id="routeDialog" class="route-dialog animate__animated animate__fadeIn">
        <div class="dialog-header">
          <h3 class="mb-0">Agregar Nueva Ruta</h3>
          <button class="btn-close" @click="closeRouteDialog" aria-label="Cerrar"></button>
        </div>
        
        <div class="dialog-body">
          <div class="form-group mb-4">
            <label for="rutaNombre" class="form-label">Nombre de la Ruta:</label>
            <input 
              type="text" 
              id="rutaNombre"
              class="form-control shadow-sm" 
              v-model="rutaNombre" 
              placeholder="Ingresa el nombre de la ruta"
            />
          </div>
  
          <!-- Mapa -->
          <div id="mapRoute" class="map-container shadow-sm mb-4"></div>
  
          <div class="dialog-buttons">
            <button class="btn btn-outline-secondary" @click="closeRouteDialog">
              <i class="bi bi-x-lg me-2"></i>Cancelar
            </button>
            <button class="btn btn-danger" @click="clearRoute">
              <i class="bi bi-trash me-2"></i>Limpiar
            </button>
            <button class="btn btn-success" @click="saveRoute">
              <i class="bi bi-save me-2"></i>Guardar
            </button>
          </div>
        </div>
      </dialog>
    </div>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-draw/dist/leaflet.draw.css';
  import 'leaflet-draw';
  import { defineComponent } from 'vue';
  import axios from 'axios'; 
  
  export default defineComponent({
    data() {
      return {
        rutaNombre: '',
        mapRoute: null,
        drawnItems: null,
        drawControl: null,
      };
    },
    methods: {
      openRouteDialog() {
        const dialog = document.getElementById("routeDialog");
        dialog.showModal();
        this.initRouteMap();
      },
      closeRouteDialog() {
        const dialog = document.getElementById("routeDialog");
        dialog.classList.add('animate__fadeOut');
        setTimeout(() => {
          dialog.close();
          dialog.classList.remove('animate__fadeOut');
          this.clearRoute();
        }, 300);
      },
      initRouteMap() {
        if (this.mapRoute) {
          this.mapRoute.invalidateSize();
          return;
        }
  
        this.mapRoute = L.map('mapRoute', {
          center: [17.9869, -92.9303],
          zoom: 12,
          zoomControl: true,
        });
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(this.mapRoute);
  
        this.drawnItems = new L.FeatureGroup();
        this.mapRoute.addLayer(this.drawnItems);
  
        this.drawControl = new L.Control.Draw({
          position: 'topleft',
          draw: {
            polyline: {
              shapeOptions: {
                color: '#007bff',
                weight: 4,
                opacity: 0.8,
              },
            },
            polygon: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
          },
          edit: {
            featureGroup: this.drawnItems,
            remove: true,
          },
        });
  
        this.mapRoute.addControl(this.drawControl);
  
        this.mapRoute.on(L.Draw.Event.CREATED, (e) => {
          this.drawnItems.addLayer(e.layer);
        });
      },
      saveRoute() {
        if (!this.rutaNombre.trim()) {
          alert('Por favor, ingresa un nombre para la ruta.');
          return;
        }
  
        const coordinates = [];
        this.drawnItems.eachLayer((layer) => {
          if (layer instanceof L.Polyline) {
            coordinates.push(
              layer.getLatLngs().map((latlng) => ({ lat: latlng.lat, lng: latlng.lng }))
            );
          }
        });
  
        if (coordinates.length === 0) {
          alert('Por favor, dibuja una ruta en el mapa.');
          return;
        }
  
        const newRoute = { name: this.rutaNombre, coordinates };
        this.saveRouteToBackend(newRoute);
      },
      async saveRouteToBackend(route) {
      try {
        // Enviar los datos al backend
        const response = await axios.post('http://localhost:3000/api/registerroute', route);
        console.log('Ruta guardada:', response.data);
        alert('¡Ruta guardada con éxito!');
        this.rutaNombre = '';
        this.drawnItems.clearLayers();
        this.closeRouteDialog();
      } catch (error) {
        console.error('Error al guardar la ruta:', error);
        alert('Hubo un error al guardar la ruta. Intenta nuevamente.');
      }
    },
    clearRoute() {
      this.drawnItems?.clearLayers();
    },
  },
});
  </script>
  
  <style scoped>
  .route-dialog {
    width: 90%;
    max-width: 900px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    background: #fff;
    overflow: hidden;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #eee;
  }
  
  .dialog-body {
    padding: 2rem;
  }
  
  .map-container {
    width: 100%;
    height: 450px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  }
  
  .dialog-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .form-control {
    border-radius: 8px;
    padding: 0.75rem 1rem;
  }
  
  .form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  /* Leaflet override */
  .leaflet-container {
    background: #f8f9fa;
  }
  
  .leaflet-control-draw {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  </style>