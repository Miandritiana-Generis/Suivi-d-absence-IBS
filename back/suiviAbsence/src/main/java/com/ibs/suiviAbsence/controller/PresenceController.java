package com.ibs.suiviAbsence.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibs.suiviAbsence.dto.PresenceInsertDTO;
import com.ibs.suiviAbsence.modele.DetailPresence;
import com.ibs.suiviAbsence.modele.V_InfoFichePresence;
import com.ibs.suiviAbsence.service.ViewEdtService;
import com.ibs.suiviAbsence.modele.Presence;
import com.ibs.suiviAbsence.repository.DetailPresenceRepository;
import com.ibs.suiviAbsence.repository.V_InfoFichePresenceRepository;
import com.ibs.suiviAbsence.service.PresenceService;


@RestController
@RequestMapping("/presences")
public class PresenceController {
    @Autowired
    PresenceService presenceService;
    @Autowired
    DetailPresenceRepository detailPresenceRepository;
    @Autowired
    V_InfoFichePresenceRepository v_InfoFichePresence;
    
    @PostMapping
    public ResponseEntity insert(@RequestBody PresenceInsertDTO presenceInsertDTO){
        //recupererPresence
        Presence presence= presenceService.recupererPresence(presenceInsertDTO.getIdEdt());
        //Controlle de valeur,
        presenceService.controlleInsertPrensence(presence.getId(), presenceInsertDTO.getIdClasseEtudiant());
        //insertPrensenceDetail
        DetailPresence detailPresence= new DetailPresence(presence.getId(),presenceInsertDTO.getIdClasseEtudiant(),presenceInsertDTO.getTempsArriver());
        detailPresence=detailPresenceRepository.save(detailPresence);
        return ResponseEntity.ok(detailPresence);
    }
    @Autowired
    private ViewEdtService edtService;

    @GetMapping
    public ResponseEntity<List<V_InfoFichePresence>> getInfoFichePresence(
    @RequestParam(value = "id_salle", required = false) Integer idSalle,
    @RequestParam(value = "date", required = false) String date,
    @RequestParam(value = "heure", required = false) String heure,
    @RequestParam(value = "id_edt", required = false) Integer idEdt) {

    List<V_InfoFichePresence> result;

    if (idEdt != null) {
        result = v_InfoFichePresence.getInfoFichePresenceWithEdt(idEdt);
    } else if (idSalle != null) {
        if (date == null || date.isEmpty()) {
            date = null;
        }
        if (heure == null || heure.isEmpty()) {
            heure = null;
        }
        result = edtService.getInfoFichePresence(idSalle, heure, date);
    } else {
        return ResponseEntity.badRequest().body(null); // Si ni id_salle ni id_edt n'est fourni
    }

    return ResponseEntity.ok(result);
}

    

    @GetMapping("today")
    public ResponseEntity<List<V_InfoFichePresence>> getInfoFichePresenceToday(
        @RequestParam("id_salle") int id_salle,
        @RequestParam(value = "date", required = false) String date) {

    if (date == null || date.isEmpty()) {
        date = null;
    }

    List<V_InfoFichePresence> result = edtService.getInfoFichePresenceToday(id_salle, date);
    return ResponseEntity.ok(result);
    }


    @PutMapping("validerProf")
    public ResponseEntity validerProf(@RequestParam int idEdt) {
        
            presenceService.validerProf(idEdt);

            return ResponseEntity.ok("Validation effectuée pour idEdt : " + idEdt);
       
    }

    @PutMapping("validerDelegue")
    public ResponseEntity validerDelegue(@RequestParam int idEdt) {
        try {
            presenceService.validerDelegue(idEdt);

            return ResponseEntity.ok("Validation effectuée pour idEdt : " + idEdt);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Aucune entrée trouvée pour idEdt : " + idEdt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la validation de la fiche de présence.");
        }
    }
    





}
