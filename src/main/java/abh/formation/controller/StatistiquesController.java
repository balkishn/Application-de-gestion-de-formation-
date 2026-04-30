package abh.formation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import abh.formation.dto.ApiResponse;
import abh.formation.dto.KeyValueStatDTO;
import abh.formation.dto.StatistiquesOverviewDTO;
import abh.formation.service.StatistiquesService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/statistiques")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasRole('ADMINISTRATEUR') or hasRole('RESPONSABLE')")
public class StatistiquesController {

    private final StatistiquesService statistiquesService;

    // ── Endpoint agrégé pour performance (chargement d'une seule requête au lieu de 3) ──
    @GetMapping("/dashboard-data")
    public ResponseEntity<ApiResponse<Object>> getDashboardData() {
        return ResponseEntity.ok(ApiResponse.success(statistiquesService.getDashboardData()));
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<StatistiquesOverviewDTO>> getOverview() {
        return ResponseEntity.ok(ApiResponse.success(statistiquesService.getOverview()));
    }

    @GetMapping("/formations-par-domaine")
    public ResponseEntity<ApiResponse<List<KeyValueStatDTO>>> getFormationsParDomaine() {
        return ResponseEntity.ok(ApiResponse.success(statistiquesService.getFormationsParDomaine()));
    }

    @GetMapping("/formations-par-annee")
    public ResponseEntity<ApiResponse<List<KeyValueStatDTO>>> getFormationsParAnnee() {
        return ResponseEntity.ok(ApiResponse.success(statistiquesService.getFormationsParAnnee()));
    }

    @GetMapping("/participants-par-structure")
    public ResponseEntity<ApiResponse<List<KeyValueStatDTO>>> getParticipantsParStructure() {
        return ResponseEntity.ok(ApiResponse.success(statistiquesService.getParticipantsParStructure()));
    }

    @GetMapping("/participants-par-profil")
    public ResponseEntity<ApiResponse<List<KeyValueStatDTO>>> getParticipantsParProfil() {
        return ResponseEntity.ok(ApiResponse.success(statistiquesService.getParticipantsParProfil()));
    }

    @GetMapping("/formateurs-par-type")
    public ResponseEntity<ApiResponse<List<KeyValueStatDTO>>> getFormateursParType() {
        return ResponseEntity.ok(ApiResponse.success(statistiquesService.getFormateursParType()));
    }
}
