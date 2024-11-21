import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [ RouterLink, RouterModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FaqComponent {

}
