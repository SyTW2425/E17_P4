import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupplierManagerComponent }from './components/supplier/supplier.component'
import { RegisterComponent } from "./components/register/register.component";

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, SupplierManagerComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyInventoryHub';
}