/**
 * import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

 */
  import { bootstrapApplication } from '@angular/platform-browser';
  import { provideRouter } from '@angular/router';
  import { AppComponent } from './app/app.component';
  import { appConfig } from './app/app.config';
  import { routes } from './app/app.routes';
  
  bootstrapApplication(AppComponent, {
    ...appConfig, // Mantén la configuración existente
    providers: [
      provideRouter(routes), // Añade las rutas al array de proveedores
    ],
  }).catch((err) => console.error(err));
  