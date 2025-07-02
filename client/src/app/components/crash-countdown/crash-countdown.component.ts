import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-crash-countdown',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './crash-countdown.component.html',
  styleUrls: ['./crash-countdown.component.css'],
  animations: [
    trigger("flip", [
      transition('* => *', [
        animate(".6s", keyframes([
          style({ transform: "rotateX(0deg)", offset: 0 }),
          style({ transform: "rotateX(-90deg)", offset: 0.5 }),
          style({ transform: "rotateX(-180deg)", offset: 1 }),
        ]))
      ])
    ])
  ]
})
export class CrashCountdownComponent implements OnInit, OnDestroy {
  lastCrashDate = new Date("2025-05-18T19:00:00");

  days: string = '00';
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';

  previousDays: string = '00';
  previousHours: string = '00';
  previousMinutes: string = '00';
  previousSeconds: string = '00';

  private timer: any;

  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getCrashData().subscribe((crashData) => {
      // @ts-ignore
      this.lastCrashDate = new Date(crashData.data[0].properties.Date?.date.start);
      this.updateTime();
    })
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateTime() {
    const now = new Date();
    const elapsed = Math.max(0, now.getTime() - this.lastCrashDate.getTime());

    this.previousDays = this.days;
    this.previousHours = this.hours;
    this.previousMinutes = this.minutes;
    this.previousSeconds = this.seconds;

    const totalSeconds = Math.floor(elapsed / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.days = days.toString().padStart(2, '0');
    this.hours = hours.toString().padStart(2, '0');
    this.minutes = minutes.toString().padStart(2, '0');
    this.seconds = seconds.toString().padStart(2, '0');
  }
}
