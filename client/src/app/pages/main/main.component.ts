import { Component, OnInit } from '@angular/core';
import { CrashCountdownComponent } from '../../components/crash-countdown/crash-countdown.component';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TranslateModule } from '@ngx-translate/core';


export interface EventProperty {
  date: string;
  location: string;
  name: string;
}

export interface EventItem {
  id: string;
  nonReadableDate: string;
  properties: EventProperty;
}

@Component({
  selector: 'app-main',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CrashCountdownComponent,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  events: EventItem[] = [];

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.getEvents();
  }

  toggleFaq(event: Event): void {
    const questionElement = event.currentTarget as HTMLElement;
    const answerElement = questionElement.nextElementSibling as HTMLElement;

    const allQuestions = document.querySelectorAll('.faq-question');
    allQuestions.forEach(q => {
      if (q !== questionElement) {
        q.classList.remove('active');
        (q.nextElementSibling as HTMLElement)?.classList.remove('active');
      }
    });

    questionElement.classList.toggle('active');
    answerElement?.classList.toggle('active');
  }

  getEvents() {
    this.apiService.getEvents().subscribe({
      next: (response: any) => {
        this.events = response.data.map((event: any) => ({
          id: event.id,
          nonReadableDate: event.properties.Date?.date.start,
          properties: {
            date: event.properties.Date?.date.start ? this.datePipe.transform(new Date(event.properties.Date?.date.start), 'yyyy-MM-dd', 'UTC') : 'Date non spécifiée',
            location: event.properties.Emplacement?.rich_text?.[0]?.plain_text || 'Emplacement non spécifié',
            name: event.properties.Nom?.title?.[0]?.plain_text || 'Nom non spécifié'
          }
        })).sort((a: any, b: any) => {
          return b.nonReadableDate.localeCompare(a.nonReadableDate);
        });
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.events = [];
      }
    });
  }
}
