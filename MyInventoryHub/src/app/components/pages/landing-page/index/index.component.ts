import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ RouterLink, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent {

}
