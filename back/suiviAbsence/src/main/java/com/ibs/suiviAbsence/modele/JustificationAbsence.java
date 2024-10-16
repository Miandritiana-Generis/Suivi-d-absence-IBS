package com.ibs.suiviAbsence.modele;

import java.sql.Timestamp;  

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Table(name="justification_absence")
@Entity
@NoArgsConstructor
public class JustificationAbsence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    int id_edt;
    @Column
    int id_classe_etudiant;
    @Column
    String description;
    @Column
    Timestamp date_time_debut;
    @Column
    Timestamp date_time_fin;
}
