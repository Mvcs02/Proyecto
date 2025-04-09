<template>
  <div class="register-container">
    <h2>Registro de Usuario</h2>
    <form class="register-form" @submit.prevent="register">
      <div class="form-group">
        <label for="id_tipo_persona">Tipo de Persona</label>
        <select v-model="form.id_tipo_persona" required>
          <option value="" disabled>Seleccione una opción</option>
          <option value="1">Admin</option>
          <option value="2">Dueño</option>
          <option value="3">Chofer</option>
        </select>
      </div>
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input v-model="form.nombre" type="text" placeholder="Nombre" required />
      </div>
      <div class="form-group">
        <label for="apellido_pat">Apellido Paterno</label>
        <input v-model="form.apellido_pat" type="text" placeholder="Apellido Paterno" required />
      </div>
      <div class="form-group">
        <label for="apellido_mat">Apellido Materno</label>
        <input v-model="form.apellido_mat" type="text" placeholder="Apellido Materno" required />
      </div>
      <div class="form-group">
        <label for="sexo">Sexo</label>
        <input v-model="form.sexo" type="text" placeholder="Sexo" required />
      </div>
      <div class="form-group">
        <label for="fecha_nac">Fecha de Nacimiento</label>
        <input v-model="form.fecha_nac" type="date" required />
      </div>
      <div class="form-group">
        <label for="curp">CURP</label>
        <input v-model="form.curp" type="text" placeholder="CURP" required />
      </div>
      <div class="form-group">
        <label for="rfc">RFC</label>
        <input v-model="form.rfc" type="text" placeholder="RFC" required />
      </div>
      <button type="submit">Registrar</button>
    </form>
    <p v-if="message" :class="messageClass">{{ message }}</p>
    <div class="action-buttons">
      <button type="button" class="action-button" @click="goToHome">Volver a inicio</button>
      <button type="button" class="action-button" @click="goToLogin">Iniciar Sesión</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        id_tipo_persona: '',
        nombre: '',
        apellido_pat: '',
        apellido_mat: '',
        sexo: '',
        fecha_nac: '',
        curp: '',
        rfc: '',
      },
      message: '',
      messageClass: '',
    };
  },
  methods: {
    async register() {
      try {
        // Asegurar que id_tipo_persona sea número
        this.form.id_tipo_persona = Number(this.form.id_tipo_persona);

        const response = await axios.post('http://localhost:3000/api/register', this.form);
        this.message = response.data.message;
        this.messageClass = 'success';

        // Esperar un momento y redirigir al login
        setTimeout(() => {
          this.$router.push({ name: 'login' });
        }, 1500);
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.message = 'Hubo un error al registrar el usuario.';
        this.messageClass = 'error';
      }
    },
    goToLogin() {
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
/* Contenedor principal */
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #b3d9ff, #e6f7ff);
  font-family: 'Poppins', sans-serif;
}

/* Título */
h2 {
  font-size: 28px;
  color: #00509e;
  margin-bottom: 20px;
}

/* Formulario */
.register-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 900px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

/* Campos del formulario */
.form-group {
  display: flex;
  flex-direction: column;
  width: calc(50% - 15px);
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #003366;
  margin-bottom: 5px;
}

.form-group input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #80bfff;
  border-radius: 5px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: #0073e6;
  outline: none;
  box-shadow: 0px 0px 5px rgba(0, 115, 230, 0.5);
}

/* Select */
.form-group select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #80bfff;
  border-radius: 5px;
  background-color: #ffffff;
  color: #003366;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group select:focus {
  border-color: #0073e6;
  outline: none;
  box-shadow: 0px 0px 5px rgba(0, 115, 230, 0.5);
}

/* Botón de registrar */
button[type="submit"] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #0073e6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button[type="submit"]:hover {
  background-color: #005bb5;
  transform: scale(1.05);
}

/* Estilos para mensajes */
.success {
  color: #4caf50;
  font-weight: bold;
  margin-top: 10px;
}

.error {
  color: #f44336;
  font-weight: bold;
  margin-top: 10px;
}

/* Contenedor de botones de acción */
.action-buttons {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 900px;
  margin-top: 20px;
}

/* Estilo para cada botón de acción */
.action-button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  background-color: #0073e6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
  background-color: #005bb5;
  transform: scale(1.05);
}
</style>