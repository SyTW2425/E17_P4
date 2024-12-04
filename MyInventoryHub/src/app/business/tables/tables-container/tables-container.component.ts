import { Component } from '@angular/core';
import TablesComponent from '../tables.component';
import WarehouseManagerComponent from '../../warehouses/warehouses.component';

@Component({
  selector: 'app-tables-container',
  standalone: true,
  imports: [TablesComponent, WarehouseManagerComponent],
  templateUrl: './tables-container.component.html',
  styleUrl: './tables-container.component.css'
})
export class TablesContainerComponent {

}
