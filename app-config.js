/**
 * Configurazione frontend: puoi sovrascrivere apiBaseUrl creando/fornendo
 * un file app-config.js personalizzato o impostando window.APP_CONFIG prima di questo script.
 */
window.APP_CONFIG = window.APP_CONFIG || {
  // Usa backend locale in sviluppo, backend Render in produzione
  apiBaseUrl: window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://scalbnb-webservice.onrender.com'
};

