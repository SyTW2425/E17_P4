import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupplierManagerComponent }from './components/supplier/supplier.component'
import { SignInComponent } from './components/sign-in/sign-in.component';

@Component({
    selector: 'app-root',
    imports: [ SignInComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyInventoryHub';
}