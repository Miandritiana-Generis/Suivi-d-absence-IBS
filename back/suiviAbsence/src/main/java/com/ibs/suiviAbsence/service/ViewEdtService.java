package com.ibs.suiviAbsence.service;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalTime;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ibs.suiviAbsence.modele.Edt;
import com.ibs.suiviAbsence.modele.Personne;
import com.ibs.suiviAbsence.modele.V_InfoFichePresence;
import com.ibs.suiviAbsence.modele.ViewEdt;
import com.ibs.suiviAbsence.repository.EdtRepository;
import com.ibs.suiviAbsence.repository.PersonneRepository;
import com.ibs.suiviAbsence.repository.V_InfoFichePresenceRepository;
import com.ibs.suiviAbsence.repository.ViewEdtRepository;
import com.ibs.suiviAbsence.repository.ViewLoginRepository;

@Service
public class ViewEdtService {

    @Autowired
    private ViewEdtRepository ViewEdtRepo;

    @Autowired
    private PersonneRepository personneRepo;
    @Autowired
    private EdtRepository edtRepository;
    @Autowired
    private V_InfoFichePresenceRepository v_iInfoFichePresenceRepository;

    @Autowired
    private ViewLoginRepository loginRepository;
    
    public Edt findEdtCourant(int idSalle,Date datedonner,Time time) {
        Edt viewEdt=null;

        List<Edt> listes = edtRepository.findAllByIdSalle(idSalle);
        if(!listes.isEmpty()){
            viewEdt=listes.get(0);
        }
        return viewEdt;
    }

    /**
     * cette methode permet d'afficher la liste des emplois du temps
     * @param idPersonne
     * @return
     */
    public List<ViewEdt> getEdt(int idPersonne) {
        List<ViewEdt> ViewEdt = new ArrayList<>();
        List<Personne> pat = personneRepo.estPAT(idPersonne);
        List<Personne> enseignant = personneRepo.estEnseignant(idPersonne);
        List<Personne> etudiant = personneRepo.estEtudiant(idPersonne);
        if (pat != null) {
            ViewEdt = ViewEdtRepo.findAll();
        }
        else if (enseignant != null) {
            ViewEdt = ViewEdtRepo.getEdtEnseignant(idPersonne);
        }
        else if (etudiant != null) {
            ViewEdt = ViewEdtRepo.getEdtDelegue(idPersonne);
        }
        return ViewEdt;
    }

    

    public List<V_InfoFichePresence> getInfoFichePresence(int id_salle, String heure, String date) {
        if (date == null || date.isEmpty()) {
            date = null;
        }
        if (heure == null || heure.isEmpty()) {
            heure = null;
        }
    
        
        List<V_InfoFichePresence> liste = v_iInfoFichePresenceRepository.getInfoFichePresence(id_salle, heure, date);
    
        if (liste.isEmpty()) {
            return liste;
        }
    
        
        Time heureDebut = liste.get(0).getDebut();
        Time heureFin = liste.get(0).getFin();
    
        
        LocalTime debutLocalTime = heureDebut.toLocalTime();
        LocalTime finLocalTime = heureFin.toLocalTime();
        
       
        LocalTime currentTime = LocalTime.now();
        LocalTime debutMoins10Min = debutLocalTime.minusMinutes(10);
    
        
        if (currentTime.isAfter(debutMoins10Min) && currentTime.isBefore(finLocalTime)) {
            return liste;  // L'heure actuelle est dans la plage requise
        } else {
            throw new IllegalArgumentException("L'heure actuelle n'est pas dans la plage requise.");
        }
    }

    public boolean estAnnule(Integer idEdt) {
        boolean retour = false;
        Edt edt = edtRepository.getById(idEdt);
        if (edt.isEstAnnule()){
            retour = true;
        }
        return retour;
    }


    

    public List<V_InfoFichePresence> getInfoFichePresenceToday(int id_salle, String date) {
        if (date == null || date.isEmpty()) {
            date = null;
        }
        return v_iInfoFichePresenceRepository.getInfoFichePresenceToday(id_salle, date);
    }

}
