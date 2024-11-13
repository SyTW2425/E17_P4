import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { ProductManagerComponent } from './components/product-manager/product-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BatchListComponent, ProductManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyInventoryHub';
}
