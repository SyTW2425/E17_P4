import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupplierManagerComponent }from './components/supplier/supplier.component'
import { SignUpComponent } from './components/sign-up/sign-up.component';

@Component({
    selector: 'app-root',
    imports: [ SignUpComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyInventoryHub';
}