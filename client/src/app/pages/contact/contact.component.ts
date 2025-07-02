import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  imports: [TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
    applicationFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfqeFzKtTs1Gu8A0cIj1ZfL6xKsYeRcA9_SSUQveQUg8WriiQ/viewform';

  redirectToForm(): void {
    window.open(this.applicationFormUrl);
  }
}
