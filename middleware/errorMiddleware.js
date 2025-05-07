/**
 * Error handling middleware
 */

// Not Found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Si el código de estado es 200, cambiarlo a 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Establecer el código de estado
  res.status(statusCode);
  
  // Devolver la respuesta JSON con el mensaje de error
  res.json({
    message: err.message,
    // Solo mostrar el stack trace en desarrollo
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler }; 