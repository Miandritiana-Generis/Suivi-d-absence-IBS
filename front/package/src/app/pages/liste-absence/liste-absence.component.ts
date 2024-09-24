import { Component, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PresenceService } from 'src/app/services/presence.service';
import { Absence } from 'src/app/modeles/Absence';
import { JustificationAbsenceService } from 'src/app/services/justification-absence.service';
import { AbstractControl } from '@angular/forms';

export interface productsData {
  id: number;
  imagePath: string;
  nom: string;
  prenom: string;
  cours: string;
  classe: string;
  enseignant: string;
  status: string;
}

const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-1.jpg',
    nom: 'Mark J. Freeman',
    prenom: 'English',
    cours: 'Management',
    classe: 'L2MDE',
    enseignant: 'Donald Hagenes',
    status: 'Justifié',
  },
  {
    id: 2,
    imagePath: 'assets/images/profile/user-2.jpg',
    nom: 'Andrew McDownland',
    prenom: 'Project Manager',
    cours: 'Management',
    classe: 'L2MDE',
    enseignant: 'Donald Hagenes',
    status: 'Non justifié',
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-3.jpg',
    nom: 'Christopher Jamil',
    prenom: 'Project Manager',
    cours: 'Management',
    classe: 'L2MDE',
    enseignant: 'Donald Hagenes',
    status: 'Non justifié',
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-4.jpg',
    nom: 'Nirav Joshi',
    prenom: 'Frontend Engineer',
    cours: 'Management',
    classe: 'L2MDE',
    enseignant: 'Donald Hagenes',
    status: 'Justifié',
  },
];

@Component({
  selector: 'app-liste-absence',
  standalone: false,
  templateUrl: './liste-absence.component.html',
})
export class AppListeAbsence {
  absents: Absence[] = [];
  totalElements = 0;
  totalPages = 0;
  page = 1;
  date: string;
  selectedAbsence: any;
  idEdt = 0;


  // Ajout des variables pour les champs du formulaire
  description: string = ''; 
  dateDebut: string = ''; 
  dateFin: string = '';


  constructor(
    public dialog: MatDialog,
    private presenceService: PresenceService,
    private justificationService: JustificationAbsenceService
  ) {
    const today = new Date();
    this.date = today.toISOString().split('T')[0];
    this.getAbsence();
  }

  displayedColumns: string[] = ['Etudiant', 'Cours', 'Classe', 'Enseignant', 'Justification', 'Modifier'];
  dataSource = ELEMENT_DATA;

  
  openModal(templateRef: TemplateRef<any>, absenceId: number, idEdt: number): void {
    this.selectedAbsence = absenceId;
    this.idEdt = idEdt;
    console.log("idAbsence :", absenceId);
    const dialogRef = this.dialog.open(templateRef, {
      width: '800px' 
    });

    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitJustification( this.description, this.dateDebut, this.dateFin);
        this.closeModal(dialogRef);
      }
    });
  }

  closeModal(dialogRef: MatDialogRef<any>): void {
    dialogRef.close();
  }


  
  submitJustification(description: string, dateDebut: string, dateFin: string) {
  
    if (!description || !dateDebut || !dateFin) {
      alert('Tous les champs sont obligatoires. Veuillez remplir la description, la date de début et la date de fin.');
      return; // Exit the function if validation fails
    }

    const absenceId = this.selectedAbsence;
    const idEdt = this.idEdt;

    // Formater les dates pour ne garder que la partie "date"
    const formattedDateDebut = dateDebut ? new Date(dateDebut).toISOString().split('T')[0] : null;
    const formattedDateFin = dateFin ? new Date(dateFin).toISOString().split('T')[0] : null;
  
    const justificationPayload = {
      id_edt : idEdt,
      id_classe_etudiant: absenceId,
      description: description,
      date_time_debut: formattedDateDebut,
      date_time_fin: formattedDateFin
    };
  
    console.log("justificationPayload: ", justificationPayload);
  
    this.justificationService.justifierDelegue(justificationPayload).subscribe(
      response => {
        console.log('Justification envoyée avec succès', response);
        window.location.reload();
        close();
      },
      error => {
        console.error('Erreur lors de l\'envoi de la justification', error);
        close();
      }
    );
  }
  
  onDateChange(type: string, event: any) {
    if (type === 'debut') {
      this.dateDebut = event.target.value;
      console.log('Date début mise à jour :', this.dateDebut);
    } else if (type === 'fin') {
      this.dateFin = event.target.value;
      console.log('Date fin mise à jour :', this.dateFin);
    }
  }
  
  
  
  public getAbsence() {
    this.presenceService.getAbsent(this.date, this.date, this.page).subscribe(
      success => {
        this.absents = success.content;
        this.totalElements = success.totalElements;
        this.totalPages = success.totalPages;
      },
      error => {
        
      }
    );
  }

 
  onEnter() {
    this.getAbsence();
  }
}
