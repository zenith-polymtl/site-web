import {Component, HostListener, AfterViewInit} from '@angular/core';
import {RouterLink, RouterLinkActive, Router, NavigationEnd} from '@angular/router';
import {filter} from "rxjs";
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    LanguageSwitcherComponent,
    TranslateModule
],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  ticking = false;
  route: string = '';
  isMobileMenuOpen = false;

  constructor(router: Router) {
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.route = event.urlAfterRedirects;
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => this.updateOnScroll());
      this.ticking = true;
    }
  }

  ngAfterViewInit() {
    this.updateOnScroll();
  }

  updateOnScroll() {
    this.parallaxEffect();
    this.handleStickyNav();
    this.ticking = false;
  }

  parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallaxImage = document.getElementById('parallaxImage');
    const headerLogo = document.getElementById('headerLogo');

    const imageRate = scrolled * -1;
    if (parallaxImage) {
      parallaxImage.style.transform = `translateY(${imageRate}px)`;
    }

    const logoRate = scrolled * -0.2;
    if (headerLogo) {
      headerLogo.style.transform = `translate(-50%, -50%) translateY(${logoRate}px)`;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Optional: Lock body scroll when mobile menu is open
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }
  
  handleStickyNav() {
    const headerNav = document.getElementById('headerNav');
    const siteHeader = document.getElementById('siteHeader');
    const scrolled = window.pageYOffset;
    // @ts-ignore
    const headerHeight = siteHeader?.offsetHeight - 50;

    if (headerNav) {
      if (scrolled >= headerHeight) {
        headerNav.classList.add('sticky');
      } else {
        headerNav.classList.remove('sticky');
      }
    }
  }
}
