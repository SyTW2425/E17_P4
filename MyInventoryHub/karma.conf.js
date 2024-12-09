// karma.conf.js
module.exports = function(config) {
    config.set({
      // Directorio base
      basePath: '',
  
      // Frameworks utilizados para los tests
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
  
      // Archivos y patrones de prueba
      files: [
        { pattern: './src/test.ts', watched: false }
      ],
  
      // Excluir archivos específicos
      exclude: [],
  
      // Preprocesadores para los archivos
      preprocessors: {
        './src/test.ts': ['@angular-devkit/build-angular']
      },
  
      // Reportes que se generarán durante las pruebas
      reporters: ['progress', 'kjhtml'],
  
      // Puerto del servidor de Karma
      port: 9876,
  
      // Habilitar / deshabilitar colores en la salida de la consola
      colors: true,
  
      // Nivel de log (puede ser: config.LOG_DISABLE, config.LOG_ERROR, config.LOG_WARN, config.LOG_INFO, config.LOG_DEBUG)
      logLevel: config.LOG_INFO,
  
      // Verificar cambios en los archivos y volver a ejecutar tests automáticamente
      autoWatch: true,
  
      // Navegadores a utilizar (ChromeHeadless para CI)
      browsers: ['ChromeHeadless'],
  
      // Modo de ejecución única (para CI)
      singleRun: true,
  
      // Número máximo de intentos para iniciar el navegador
      retryLimit: 3,
  
      // Tiempo de espera para iniciar el navegador
      browserDisconnectTimeout: 10000,
      browserDisconnectTolerance: 3,
      browserNoActivityTimeout: 30000,
  
      // Plugins necesarios para Karma
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
  
      // Configuración adicional para el navegador
      customLaunchers: {
        ChromeHeadlessCI: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--disable-gpu']
        }
      }
    });
  };
  