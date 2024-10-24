package com.ibs.suiviAbsence.modele;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="v_absent_detail_total_h_par_matiere")
public class ViewAbsentDetailTotalHMatiere {
    
    @Column(name = "id_annee_scolaire")
    private int idAnneeScolaire;

    @Id
    @Column(name = "id_etudiant")
    private int idEtudiant;

    @Column
    private String photo;

    @Column
    private String nom;

    @Column 
    private String prenom;

    @Column
    private String classe;

    @Column
    private String matiere;

    @Column(name = "total_heure_absence")
    private String totalHeureAbsence;
    
}
