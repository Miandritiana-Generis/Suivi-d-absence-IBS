import { CommonModule, Time } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EdtService } from 'src/app/services/edt.service';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FichePresenceService } from 'src/app/services/fiche-presence.service';
import Swal from 'sweetalert2';

export interface ProductsData {
  id: number;
  imagePath: string;
  nom: string;
  prenom: string;
  hourRate: Date | null;
  status: string;
  salle: string;
  matiere : string;
  enseignant : string;
  classe : string;
  id_edt : string;
  id_classe_etudiant : string;
  date : Date;
  fin : Time;
  debut : Time;
  id_personne : number;
  id_salle : number;
}

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
    MatChipsModule,
    CommonModule,
    // HttpClientModule,
  ],
  templateUrl: './fiche-presence.component.html'
})
export class AppFichePresenceComponent {
  listeFichePresence: any[] = [];
  id_salle = 25;
  heure = "";
  date = "";
  id_edt = "1";
  message: string = ''; 
  retour : any;
  estAnnule: boolean | null = null;
  estValideProf: boolean = false;
  estValideDelegue: boolean = false;
  retourDelegue : string = '';
  retourProf : string = '';


  displayedColumns: string[] = ['nom', 'prenom', 'hArriver', 'status'];
  displayedColumnsAnnuler: string[] = ['nom', 'prenom', 'hArriver'];
  dataSource: ProductsData[] = [];
  apiUrl: any;
  isLoading: boolean = false;

  isIdPatValid: boolean = true;

  constructor(private edtService: EdtService, private http: HttpClient ,private route:ActivatedRoute, private fichePresenceService : FichePresenceService) {
   this.route.queryParamMap.subscribe(params => {
      this.id_edt = params.get('id_edt')!;
      this.getListFichePresence(this.id_salle ,this.heure, this.date,this.id_edt);
      
    });
    
  }


  ngOnInit() {
    this.checkIfAnnule(parseInt(this.id_edt));
    this.checkIfPAT();
  }

  getListFichePresence(id_salle: number, heure: string, date: string, idEdt : string): void {

    if(idEdt != null){

      const salle = localStorage.getItem("salle");
      id_salle = parseInt(salle || "0", 10);

      const personne = parseInt(localStorage.getItem("id")|| "0", 10);
      
      const idPat = localStorage.getItem("idPat");

      this.edtService.getInfoFichePresence(id_salle, heure, date, idEdt).subscribe(
        (response: { data: any[]; retour: boolean }) => {
          // Vérification que 'data' est bien un tableau
          const data = response.data;
          this.retour = response.retour;
          const l= this.retour.split(";");
          this.retourProf = l[0];
          this.retourDelegue = l[1];
          

          if (Array.isArray(data)) {
            // Si 'data' est un tableau, le mapper pour créer listeFichePresence
            this.listeFichePresence = data.map(item => ({
              id: item.id,
              // If the photo exists, format it correctly to ensure it's treated as an absolute URL
              imagePath: 'http:\\'+item.photo,
              // ? item.photo
              //     .replace('\\\\192.168.1.8\\bevazaha$', 'http://192.168.1.8/bevazaha$')
              //     .replace(/\\/g, '/') // Ensure backslashes are converted to forward slashes
              // : 'assets/images/profile/default-user.jpg',        
              nom: item.nom,
              prenom: item.prenom,
              hourRate: item.heure_arrive ? item.heure_arrive : 'N/A', // Garder hourRate comme chaîne
              status: item.status ? (item.status === true ? 'Present' : 'Absent') : 'Absent',
              salle: item.salle,
              matiere: item.matiere,
              enseignant: item.enseignant,
              classe: item.classe,
              id_edt: item.id_edt,
              id_classe_etudiant : item.id_classe_etudiant,
              date : item.date,
              fin : item.fin,
              debut : item.debut,
              id_personne : item.id_personne,
              id_salle : item.id_salle
            }));
            // this.dataSource = this.listeFichePresence;
          } else {
            // Si la réponse n'est pas un tableau, afficher un message d'erreur
            console.error("La réponse n'est pas un tableau valide:", response);
            this.listeFichePresence = [];
          }        

          // this.dataSource = this.listeFichePresence;
          

          if (this.listeFichePresence.some(item => item.id_personne === personne) || idPat) {
            
            this.dataSource = this.listeFichePresence;
            console.log("Données transformées:", this.listeFichePresence);
            
          }else{
            this.listeFichePresence = [];
          }
          
          this.dataSource = this.listeFichePresence;

        },
        (error: any) => {
          console.error("Erreur lors de l'appel à l'API:", error);
        }
      );
    }else{
      window.location.href = 'http://localhost:4400/programme';
    }
  }

  sendFichePresenceData(): void {
    this.isLoading = true;
    const dataToSend = this.listeFichePresence;
    this.edtService.sendFichePresenceDataService(dataToSend).subscribe(
      (response: any) => {
        window.location.href = 'http://127.0.0.1:5000/';
        this.isLoading = false;
      },
      (error: any) => {
        alert("Tsy mety lasa le data");
        console.error('Error sending data:', error);
      }
    );
  }


  validerProf(idEdt: string): void {
    const tokenValue = localStorage.getItem('token') || ''; // Ensure tokenValue is never null
  
    Swal.fire({
      title: 'Confirmer la validation',
      text: "Voulez-vous vraiment valider ce fiche de présence ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fichePresenceService.validerProf(idEdt, tokenValue).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Validation réussie.'
            }).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            const errorResponse = JSON.parse(error.error);
            const errorMessage = errorResponse.erreurs && errorResponse.erreurs.length > 0 
              ? errorResponse.erreurs[0].messageErreur 
              : `Une erreur est survenue: ${error.message}`;
  
            let alertTitle = 'Erreur';
            let alertText = errorMessage;
  
            // Handle specific HTTP error codes
            switch (error.status) {
              case 400:
                alertText = errorMessage;
                break;
              case 401:
                alertText = 'Erreur 401: Non autorisé. Veuillez vous reconnecter.';
                break;
              case 403:
                alertText = 'Erreur 403: Accès refusé. Vous n\'avez pas les droits pour cette action.';
                break;
            }
  
            Swal.fire({
              icon: 'error',
              title: alertTitle,
              text: alertText
            });
          }
        });
      }
    });
  }





  validerDelegue(idEdt: string): void {
    const tokenValue = localStorage.getItem('token') || '';
  
    if (tokenValue) {
      Swal.fire({
        title: 'Confirmer la validation',
        text: "Voulez-vous vraiment valider ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result.isConfirmed) {
          this.fichePresenceService.validerDelegue(idEdt, tokenValue).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Validation réussie.'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              const errorMessage = JSON.parse(error.error).erreurs[0].messageErreur;
              
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: errorMessage
              });
            }
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Token manquant ou action annulée.'
      });
    }
  }
  
  checkIfAnnule(idEdt: number): void {
    this.fichePresenceService.estAnnule(idEdt).subscribe(
      (response: any) => {
        this.estAnnule = response.estAnnule;
      },
      (error) => {
        console.error('Erreur lors de la vérification:', error);
      }
    );
  }

  // public checkIfEsrValideProf(idEdt: number): void {
  //   this.fichePresenceService.estValiderProf(idEdt).subscribe(
  //     (response: any) => {
  //       this.estValideProf = response.prof;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la vérification:', error);
  //     }
  //   );
  // }

  // private checkIfEsrValideDelegue(idEdt: number): void {
  //   this.fichePresenceService.estValiderDelegue(idEdt).subscribe(
  //     (response: any) => {
  //       this.estValideDelegue = response.delegue;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la vérification:', error);
  //     }
  //   );
  // }

  presenceManuelle(idEdt: number, idClasseEtudiant: number): void {
    const idEnseignant = localStorage.getItem('idEnseignant');
    const idPat = localStorage.getItem('idPat');
    
    if (idEnseignant && idEnseignant !== '0' || idPat && idPat !== '0') {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous voulez marquer cet étudiant comme présent?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result) => {
        if (result.isConfirmed) {
          const tempsArriver = new Date().toLocaleTimeString('en-GB'); // Current time in HH:mm:ss format
  
          this.fichePresenceService.presence(idEdt, idClasseEtudiant, tempsArriver).subscribe(
            (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Présence enregistrée avec succès!',
              });
  
              var index = this.listeFichePresence.findIndex(student => student.id_classe_etudiant === idClasseEtudiant);
              this.listeFichePresence[index].status = 'Present';
              this.listeFichePresence[index].hourRate = response.tempsArriver;
  
            },
            (error) => {
              console.error('Error:', error);
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Échec de l\'enregistrement de la présence.',
              });
            }
          );
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Autorisation refusée',
        text: 'Vous n\'êtes pas autorisé à faire la présence manuellement',
      });
    }
  }


  checkIfPAT(): boolean {
    const idPat = localStorage.getItem("idPat");
    
    if (idPat !== undefined && idPat !== "0") {
      this.isIdPatValid = true;
      return true;
    }else{
      this.isIdPatValid = false;
      return false;
    }
  }


  isDisplayFichePresence(): boolean {
    
    return this.isCurrentTimeWithinRange(
      this.listeFichePresence[0]?.date,
      this.listeFichePresence[0]?.debut,
      this.listeFichePresence[0]?.fin,
      this.listeFichePresence[0].id_salle
    );
  }


  isCurrentTimeWithinRange(date: string, debut: string, fin: string, id_salle: number): boolean {
    const salle = localStorage.getItem('salle');
    const currentDateTime = new Date();
  
    // Parse debut and fin times as Date objects
    const startTime = new Date(`${date}T${debut}`);
    const endTime = new Date(`${date}T${fin}`);
  
    // Subtract 15 minutes from startTime
    startTime.setMinutes(startTime.getMinutes() - 15);
  
    // Check if salle matches and current time is within adjusted startTime and endTime
    if (salle !== id_salle.toString() || currentDateTime < startTime || currentDateTime > endTime) {
      return false;
    }

    // if (salle !== id_salle.toString()) {
    //   return false;
    // }
  
    return true;
  }
  



  


}
