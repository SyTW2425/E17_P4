import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ RouterLink, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent {

}
