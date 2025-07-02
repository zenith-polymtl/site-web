import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEvents() {
    return this.http.get(`${this.apiUrl}/events`);
  }

  getCrashData() {
    return this.http.get(`${this.apiUrl}/crash`);
  }

  getTeams() {
    return this.http.get(`${this.apiUrl}/teams`);
  }

  getGallery() {
    return this.http.get(`${this.apiUrl}/gallery`);
  }
}
