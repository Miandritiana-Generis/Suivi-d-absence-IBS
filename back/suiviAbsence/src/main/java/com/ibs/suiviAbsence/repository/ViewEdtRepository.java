package com.ibs.suiviAbsence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ibs.suiviAbsence.modele.ViewEdt;

public interface ViewEdtRepository extends JpaRepository<ViewEdt, Integer>{

    @Query(value = "SELECT * from v_edt where id_enseignant = :id_enseignant", nativeQuery = true)
    public List<ViewEdt> getEdtEnseignant(@Param("id_enseignant") int id_enseignant);

    @Query(value = "SELECT * from v_edt where id_etudiant = :id_etudiant", nativeQuery = true)
    public List<ViewEdt> getEdtDelegue(@Param("id_etudiant") int id_etudiant);







}
