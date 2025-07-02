import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-sponsors',
    imports: [
        TranslatePipe
    ],
  templateUrl: './sponsors.component.html',
  styleUrl: './sponsors.component.css'
})
export class SponsorsComponent {
  openMailClient() {
    window.location.href = 'mailto:zenith.polymtl@gmail.com';
  }
}
