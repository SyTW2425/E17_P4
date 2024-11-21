import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ RouterLink, RouterModule ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent {

}
