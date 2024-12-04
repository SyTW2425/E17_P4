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
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RegisterComponent } from './components/register/register.component';
import WarehouseManagementComponent from './business/warehouses/warehouses.component';
import { TablesContainerComponent } from './business/tables/tables-container/tables-container.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [{ path: '', component: DashboardComponent }],
  },
  {
    path: 'profile',
    component: LayoutComponent,
    children: [{ path: '', component: ProfileComponent }],
  },
  {
    path: 'tables',  // Solo en esta ruta se cargan ambos componentes
    component: LayoutComponent,
    children: [
      { path: '', component: TablesContainerComponent }  // Componente contenedor para Tables y Warehouse
    ],
  },
  { path: 'signin', component: SignInComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }, // Redirección en caso de ruta no encontrada
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