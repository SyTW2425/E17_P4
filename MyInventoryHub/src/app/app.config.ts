import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import {ButtonModule} from 'primeng/button'
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
/*export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch())]
};*/

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Esto permite registrar múltiples interceptores si es necesario
    },
    provideAnimations(),
    provideAnimationsAsync(),
    providePrimeNG({ 
        theme: {
            preset: Aura,
            options: {
              darkModeSelector: '.my-app-dark'
          }
        },
        translation: {
          startsWith: 'Empieza con',
          contains: 'Contiene',
          notContains: 'No contiene',
          endsWith: 'Termina con',
          equals: 'Igual a',
          notEquals: 'Diferente de',
          noFilter: 'Sin filtro',
          lt: 'Menor que',
          lte: 'Menor o igual que',
          gt: 'Mayor que',
          gte: 'Mayor o igual que',
          dateIs: 'Fecha es',
          dateIsNot: 'Fecha no es',
          dateBefore: 'Fecha antes de',
          dateAfter: 'Fecha después de',
          clear: 'Limpiar',
          apply: 'Aplicar',
          matchAll: 'Coincidir todo',
          matchAny: 'Coincidir cualquier',
          addRule: 'Añadir regla',
          removeRule: 'Eliminar regla',
          accept: 'Aceptar',
          reject: 'Rechazar'
      }
    })
  ],
};