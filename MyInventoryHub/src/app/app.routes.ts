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
import { ProfileComponent } from './business/profile/profile.component';
import TablesComponent from './business/tables/tables.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordComponent } from './business/password/password.component';
import { EmployeesComponent } from './business/employees/employees.component';
import { SuppliersComponent } from './business/supplier/supplier.component';
import { AlertsComponent } from './business/alerts/alerts.component'
import { StatisticsComponent } from './business/statistics/statistics.component';

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
    path: 'tables',
    component: LayoutComponent,
    children: [{ path: '', component: TablesComponent }],
  },
  {
    path: 'password',
    component: LayoutComponent,
    children: [{ path: '', component: PasswordComponent }],
  },
  {
    path: 'employees',
    component: LayoutComponent,
    children: [{ path: '', component: EmployeesComponent }],
  },
  {
    path: 'suppliers',
    component: LayoutComponent,
    children: [{ path: '', component: SuppliersComponent}],
  },
  {
    path: 'alerts',
    component: LayoutComponent,
    children: [{ path: '', component: AlertsComponent }],
  },
  {
    path: 'statistics',
    component: LayoutComponent,
    children: [{ path: '', component: StatisticsComponent }],
  },
  { path: 'signin', component: SignInComponent },
  { path: 'register', component: RegisterComponent },
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