import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NgClass} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';


interface Member {
  name: string,
  pictureUrl: string,
}

interface Role {
  roleName: string,
  members: Member[],
}

interface Team {
  year: string,
  teamPictureUrl: string,
  directionRoles: Role[],
  teamRoles: Role[],
}

@Component({
  selector: 'app-team',
  imports: [
    NgClass,
    TranslatePipe
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  teams: Team[] = [];
  selectedTeamIndex: number = 0;
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.getTeams();
  }
  onYearChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTeamIndex = parseInt(selectElement.value);
  }
  getTeams() {
    this.apiService.getTeams().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.teams = response.data;
        }
      }
    });
  }
  getTeamDescription(roleName: string): string {
    const descriptions: Record<string, string> = {
      'CONTRÔLE': 'L\'équipe contrôle développe les algorithmes et la logique de pilotage qui permettent au drone de voler de manière stable et précise. En essence, cette équipe développe le "cerveau" du drone qui décide comment réagir et manœuvrer.',
      'SYSTÈME EMBARQUÉ': 'L\'équipe système embarqué développe l\'électronique, sélectionne et intègre les capteurs. Elle assure l\'intégration de tous les composants électroniques du drone, et gère le lien critique entre les aspects physiques et algorithmes de contrôle.',
      'CHÂSSIS': 'L\'équipe châssis conçoit et fabrique la structure du drone. Elle optimise le poids, la résistance et l\'aérodynamisme pour assurer des performances optimales et une intégration parfaite de tous les composants.',
      'PROPULSION': 'L\'équipe propulsion développe et optimise le système de motorisation. Elle sélectionne les moteurs, hélices et contrôleurs pour maximiser l\'efficacité énergétique et les performances de vol.',
      'PAYLOAD': 'L\'équipe payload s\'occupe principalement de faire la recherche spécialisée pour les missions aux compétitions, de concevoir et fabriquer divers accessoires qui se font ajoutés au drone de base.'
    };

    const key = Object.keys(descriptions).find(k =>
      roleName.toUpperCase().includes(k.toUpperCase())
      ?? 'Description non disponible');

    return descriptions[key as keyof typeof descriptions] ?? 'Description non disponible';
  }
  getTeamColorClass(index: number): string {
    const colors = ['dark-blue yellow-text systeme-embarque', 'purple cream-text propulsion', 'orange dark-blue-text controle'];
    return colors[index % colors.length];
  }
}
