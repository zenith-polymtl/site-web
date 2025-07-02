import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  currentLang: string = 'fr';
  constructor(private translate: TranslateService) {
    const browserLang = navigator.language.split('-')[0];
    this.currentLang = browserLang === 'fr' ? 'fr' : 'en';
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);
  }

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'en' ? 'fr' : 'en';
    this.translate.use(this.currentLang);
  }
}
