import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('preferredLanguage');
    
    if (savedLang && ['en', 'fr'].includes(savedLang)) {
      this.translate.use(savedLang);
    } else {

      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang?.match(/en|fr/) ? browserLang : 'fr');
    }
  }
}
