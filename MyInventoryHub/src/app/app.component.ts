import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BatchListComponent } from './components/batch/batch-list/batch-list.component';
import { ProductManagerComponent } from './components/product/product-manager/product-manager.component';
import { SupplierManagerComponent }from './components/supplier-manager/supplier-manager.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BatchListComponent, ProductManagerComponent, SupplierManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyInventoryHub';
}
