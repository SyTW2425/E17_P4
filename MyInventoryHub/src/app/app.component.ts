import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupplierManagerComponent }from './components/supplier/supplier.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SupplierManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyInventoryHub';
}