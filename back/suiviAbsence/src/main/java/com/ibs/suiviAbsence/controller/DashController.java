package com.ibs.suiviAbsence.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibs.suiviAbsence.modele.Niveau;
import com.ibs.suiviAbsence.modele.ViewClasseDetail;
import com.ibs.suiviAbsence.modele.ViewListeAbsentTotalH;
import com.ibs.suiviAbsence.modele.ViewTauxAbsencePresence;
import com.ibs.suiviAbsence.service.DashService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
public class DashController {

    @Autowired
    DashService dashService;

    @GetMapping("/liste-classe")
    public ResponseEntity<List<ViewClasseDetail>> getListeClassse()
    {
        List<ViewClasseDetail> listeClasse = dashService.findViewClasseDetails();
        return ResponseEntity.ok(listeClasse);
    }

    @GetMapping("/totalAbsence")
    public long getAbsences(@RequestParam(required = false) String date, @RequestParam(required = false) Integer idClasse) {
        return dashService.getAbsenceCount(date, idClasse);
    }

    @GetMapping("/liste-niveau")
    public ResponseEntity<List<Niveau>> getListeNiveau(){
        List<Niveau> val = dashService.findNiveau();
        return ResponseEntity.ok(val);
    }

    @GetMapping("/taux-absence-presence")
    public List<ViewTauxAbsencePresence> getTauxAbsencePresence(
            @RequestParam(required = false) String monthYear,
            @RequestParam(required = false) Integer idClasse,
            @RequestParam(required = false) Integer idNiveau) {
        return dashService.getTauxAbsencePresence(monthYear, idClasse, idNiveau);
    }

    @GetMapping("/total-heure-absence")
    public List<ViewListeAbsentTotalH> getAbsentTotalH(
        @RequestParam(required = false) String monthYear
    ) {
        // Check if monthYear is null
        if (monthYear == null) {
            // Get current month and year in 'YYYY-MM' format
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
            monthYear = LocalDate.now().format(formatter);
        }
        
        return dashService.getAbsentTotalH(monthYear);
    }
}