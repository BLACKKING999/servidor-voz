require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import configuration
const connectDB = require('./config/db');
const { initializeFirebaseAdmin } = require('./config/firebase-config');

// Import routes
const surveyRoutes = require('./routes/surveyRoutes');
const userRoutes = require('./routes/userRoutes');
const responseRoutes = require('./routes/responseRoutes');

// Import middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración simplificada de CORS para desarrollo 
app.use(cors({
  origin: '*', // Permitir todas las solicitudes en modo desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar conexiones a servicios externos solo si están configuradas
if (process.env.FIREBASE_CONFIG) {
  try {
    initializeFirebaseAdmin();
    console.log('Firebase Admin SDK inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Firebase Admin SDK:', error);
    // No terminamos el proceso, permitimos que la API siga funcionando
  }
}

if (process.env.MONGODB_URI) {
  connectDB()
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => {
      console.error('Error al conectar a MongoDB:', err);
      // No terminamos el proceso, permitimos que la API siga funcionando
    });
} else {
  console.log('MongoDB no configurado. Algunas funcionalidades pueden no estar disponibles.');
}

// Endpoint de estado/salud de la API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: require('./package.json').version,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Documentación básica de la API
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'API del Sistema de Encuestas por Voz',
    version: require('./package.json').version,
    endpoints: {
      surveys: '/api/surveys',
      users: '/api/users',
      responses: '/api/responses',
      health: '/api/health'
    }
  });
});

// Routes
app.use('/api/surveys', surveyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/responses', responseRoutes);

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos desde la carpeta client/build
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Todas las rutas no reconocidas se dirigen al index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API en modo desarrollo');
  });
}

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
});
