<template>
    <div class="container mt-5">
      <!-- Botones de acción -->
      <div class="d-flex justify-content-between mb-4 flex-wrap gap-3">
        <button class="btn btn-primary shadow-sm mb-2" @click="openRouteDialog">
          <i class="bi bi-plus-lg me-2"></i>Agregar Ruta
        </button>
        <button class="btn btn-success" @click="ReadRoute">
          <i class="bi bi-save me-2"></i>Ver Rutas
        </button>
      </div>
  
      <!-- Mapa principal (visible al cargar la página) -->
      <div id="mainMap" class="map-container shadow-sm mb-4" style="height: 500px;"></div>
  
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
  
          <!-- Mapa en el Modal (solo se inicializa cuando se abre el modal) -->
          <div id="modalMap" class="map-container shadow-sm mb-4" style="height: 400px;"></div>
  
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
        mainMap: null,   // Mapa principal
        modalMap: null,  // Mapa dentro del modal
        drawnItems: null,
        drawControl: null,
      };
    },
    methods: {
      // Al abrir el modal, inicializamos el mapa del modal
      openRouteDialog() {
        const dialog = document.getElementById("routeDialog");
        dialog.showModal();
        this.initModalMap();  // Inicializamos el mapa solo en el modal
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
  
      // Inicializamos el mapa principal cuando se carga la página
      initMainMap() {
        if (this.mainMap) {
          this.mainMap.invalidateSize();
          return;
        }
  
        this.mainMap = L.map('mainMap', {
          center: [17.9869, -92.9303],
          zoom: 12,
          zoomControl: true,
        });
  
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(this.mainMap);
      },
  
      // Inicializamos el mapa dentro del modal cuando se abre
      initModalMap() {
        if (this.modalMap) {
          this.modalMap.invalidateSize();
          return;
        }
  
        this.modalMap = L.map('modalMap', {
          center: [17.9869, -92.9303],
          zoom: 12,
          zoomControl: true,
        });
  
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(this.modalMap);
  
        this.drawnItems = new L.FeatureGroup();
        this.modalMap.addLayer(this.drawnItems);
  
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
  
        this.modalMap.addControl(this.drawControl);
  
        this.modalMap.on(L.Draw.Event.CREATED, (e) => {
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
  
      ReadRoute() {
  axios.get('http://localhost:3000/api/getroutes')
    .then(response => {
      let routes = response.data.routes;

      if (!Array.isArray(routes)) {
        routes = [routes];
      }

      // Parseamos las coordenadas y las corregimos
      this.routes = routes.map(route => {
        return {
          ...route,
          coordenadas: JSON.parse(route.coordenadas)[0] // Aquí accedemos al primer array dentro del array principal
        };
      });

      // Ahora accedes a las coordenadas directamente
      this.routes.forEach(route => {
        console.log(route.coordenadas);  // Esto ya debería darte el array de coordenadas
      });
    })
    .catch(error => {
      console.error('Error al obtener las rutas:', error);
    });
}

    },
  
    mounted() {
      this.initMainMap();  // Inicializamos el mapa principal cuando la página carga
    },
  });
  </script>
  
  
  
  <style scoped>
  /* Contenedor principal */
  .container {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(to bottom right, #42a5f5, #66bb6a);
    font-family: 'Poppins', sans-serif;
    padding: 2rem;
  }
  
  /* Botones de acción principales */
  .d-flex {
    gap: 15px;
  }
  
  .btn-primary {
    padding: 12px 25px;
    border-radius: 25px;
    border: none;
    background-color: #64b5f6;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.3s;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  .btn-primary:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  /* Diálogo de ruta */
  .route-dialog {
    width: 90%;
    max-width: 900px;
    border: none;
    border-radius: 15px;
    background: white;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  /* Encabezado del diálogo */
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: linear-gradient(to right, #42a5f5, #66bb6a);
    color: white;
  }
  
  .dialog-header h3 {
    font-size: 1.8rem;
    margin: 0;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  .btn-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .btn-close:hover {
    transform: scale(1.2);
  }
  
  /* Cuerpo del diálogo */
  .dialog-body {
    padding: 2rem;
  }
  
  /* Grupo de formulario */
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    font-size: 1.2rem;
    color: #42a5f5;
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  .form-control {
    padding: 12px 20px;
    border-radius: 12px;
    border: 2px solid #64b5f6;
    font-size: 1.1rem;
    transition: border-color 0.3s;
  }
  
  .form-control:focus {
    border-color: #66bb6a;
    outline: none;
    box-shadow: 0 0 8px rgba(102, 187, 106, 0.3);
  }
  
  /* Contenedor del mapa */
  .map-container {
    width: 100%;
    height: 450px;
    border-radius: 15px;
    border: 2px solid #64b5f6;
    background: #f0f4f8;
  }
  
  /* Botones del diálogo */
  .dialog-buttons {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }
  
  .btn-outline-secondary {
    padding: 12px 25px;
    border-radius: 25px;
    border: 2px solid #64b5f6;
    background: transparent;
    color: #64b5f6;
    font-weight: bold;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.3s;
  }
  
  .btn-danger {
    padding: 12px 25px;
    border-radius: 25px;
    border: none;
    background-color: #ffb74d;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.3s;
  }
  
  .btn-success {
    padding: 12px 25px;
    border-radius: 25px;
    border: none;
    background-color: #81c784;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.3s;
  }
  
  .btn-outline-secondary:hover,
  .btn-danger:hover,
  .btn-success:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  /* Overrides de Leaflet */
  .leaflet-container {
    background: #f0f4f8;
  }
  
  .leaflet-control-draw {
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  </style>