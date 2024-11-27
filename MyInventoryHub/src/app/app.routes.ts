/**
 * Por defecto
import { Routes } from '@angular/router';

export const routes: Routes = [];
 */

// para probar landing page
import { Routes } from '@angular/router';
import { AboutComponent } from './components/pages/landing-page/about/about.component';
import { ContactComponent } from './components/pages/landing-page/contact/contact.component';
import { FaqComponent } from './components/pages/landing-page/faq/faq.component';
import { IndexComponent } from './components/pages/landing-page/index/index.component';
import LayoutComponent from './shared/components/layout/layout.component';
import DashboardComponent from './business/dashboard/dashboard.component';
import ProfileComponent from './business/profile/profile.component';
import TablesComponent from './business/tables/tables.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'dashboard', component: LayoutComponent,
    children: [
        {
            path: '',
            component: DashboardComponent
        },
        {
            path: 'profile',
            component: ProfileComponent
        },
        {
            path: 'tables',
            component: TablesComponent
        }
    ]
   },
  { path: '**', redirectTo: '' } // Redirección en caso de ruta no encontrada
];

/*
export const routes: Routes  = [
  {path: '', component: IndexComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'faq', component: FaqComponent },
      { path: '**', redirectTo: '' } // Redirección en caso de ruta no encontrada
    ]
  }
];
*/