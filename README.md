# API del Sistema de Encuestas por Voz

Este servidor está configurado como una API independiente que puede desplegarse en diferentes plataformas, separada del cliente frontend.

## Configuración

1. Crea un archivo `.env` basado en `.env.example` con tus configuraciones:
   ```
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales y configuraciones:
   - `PORT`: Puerto donde se ejecutará la API (ej. 5000)
   - `ALLOWED_ORIGINS`: Lista de dominios separados por comas que pueden acceder a la API (para CORS)
   - `MONGODB_URI`: URL de conexión a MongoDB
   - Credenciales de Firebase (si se utilizan)

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## Endpoints de la API

- **`GET /api`**: Información básica de la API y listado de endpoints disponibles
- **`GET /api/health`**: Comprobación del estado de la API (health check)

### Encuestas
- **`GET /api/surveys`**: Obtener todas las encuestas
- **`POST /api/surveys`**: Crear una nueva encuesta
- **`GET /api/surveys/:id`**: Obtener una encuesta específica
- **`PUT /api/surveys/:id`**: Actualizar una encuesta
- **`DELETE /api/surveys/:id`**: Eliminar una encuesta

### Usuarios
- **`GET /api/users`**: Obtener todos los usuarios
- **`POST /api/users`**: Crear un nuevo usuario
- **`GET /api/users/:id`**: Obtener un usuario específico
- **`PUT /api/users/:id`**: Actualizar un usuario
- **`DELETE /api/users/:id`**: Eliminar un usuario

### Respuestas
- **`GET /api/responses`**: Obtener todas las respuestas
- **`POST /api/responses`**: Crear una nueva respuesta
- **`GET /api/responses/:id`**: Obtener una respuesta específica
- **`GET /api/responses/survey/:surveyId`**: Obtener respuestas para una encuesta específica

## Opciones de Despliegue

### Render.com

1. Agrega un `render.yaml` en el directorio raíz:
   ```yaml
   services:
     - type: web
       name: encuesta-backend
       env: node
       region: oregon
       plan: free
       buildCommand: cd server && npm install
       startCommand: cd server && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
         - key: ALLOWED_ORIGINS
           value: https://tu-frontend.netlify.app
   ```

2. Conecta tu repositorio a Render.com y despliega automáticamente

### Heroku

1. Crea un archivo `Procfile` en la carpeta del servidor:
   ```
   web: npm start
   ```

2. Configura tu aplicación en Heroku:
   ```bash
   heroku create
   git push heroku main
   ```

3. Configura las variables de entorno en la dashboard de Heroku o mediante CLI:
   ```bash
   heroku config:set ALLOWED_ORIGINS=https://tu-frontend.netlify.app
   ```

### Railway

Railway detectará automáticamente el archivo package.json y su comando start. Solo necesitas configurar las variables de entorno en la plataforma.

## Conexión desde el Frontend

En tu aplicación cliente (React), actualiza la URL base de la API:

```javascript
// En tu archivo de configuración del cliente
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

Y asegúrate de incluir la variable de entorno en tu despliegue de frontend:
```
REACT_APP_API_URL=https://tu-api-url.com/api
```
