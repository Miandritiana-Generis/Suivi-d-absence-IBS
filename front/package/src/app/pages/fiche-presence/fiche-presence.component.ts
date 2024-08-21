import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';

export interface productsData {
  id: number;
  imagePath: string;
  nom: string;
  prenom: string;
  hourRate: Date;
  status: string;
}

const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-1.jpg',
    nom: 'Mark J. ',
    prenom: 'Freeman',
    hourRate: new Date('2024-01-01T07:00:00'),
    status: 'Present',
  },
  {
    id: 2,
    imagePath: 'assets/images/profile/user-2.jpg',
    nom: 'Andrew ',
    prenom: 'McDownland Koto',
    hourRate: new Date('2024-01-01T07:05:00'),
    status: 'Absent',
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-3.jpg',
    nom: 'Christopher ',
    prenom: 'Jamil Rakoto',
    hourRate: new Date('2024-01-01T07:10:00'),
    status: 'Absent',
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-4.jpg',
    nom: 'Nirav Joshi',
    prenom: 'Rakotomana',
    hourRate: new Date('2024-01-01T07:11:00'),
    status: 'Present',
  },
];

@Component({
  selector: 'app-fiche-presence',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
    MatTableModule,
    CommonModule,
  ],
  templateUrl: './fiche-presence.component.html'
})
export class AppFichePresenceComponent {

  displayedColumns: string[] = ['nom', 'prenom', 'hArriver', 'status'];
  dataSource = ELEMENT_DATA;

}