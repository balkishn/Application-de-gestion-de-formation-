package abh.formation.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import abh.formation.dto.ApiResponse;
import abh.formation.dto.FormationDTO;
import abh.formation.service.FormationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/formations")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
public class FormationController {
    
    private final FormationService formationService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<FormationDTO>> createFormation(@Valid @RequestBody FormationDTO dto) {
        try {
            var formation = formationService.createFormation(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Formation created successfully", 
                    formationService.convertFormationToDTO(formation)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<FormationDTO>>> getAllFormations() {
        List<FormationDTO> formations = formationService.getAllFormations();
        return ResponseEntity.ok(ApiResponse.success(formations));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FormationDTO>> getFormationById(@PathVariable Long id) {
        try {
            FormationDTO formation = formationService.getFormationById(id);
            return ResponseEntity.ok(ApiResponse.success(formation));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FormationDTO>> updateFormation(
            @PathVariable Long id,
            @Valid @RequestBody FormationDTO dto) {
        try {
            FormationDTO updated = formationService.updateFormation(id, dto);
            return ResponseEntity.ok(ApiResponse.success("Formation updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFormation(@PathVariable Long id) {
        try {
            formationService.deleteFormation(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Formation deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/domaine/{domaineId}")
    public ResponseEntity<ApiResponse<List<FormationDTO>>> getFormationsByDomaine(
            @PathVariable Integer domaineId) {
        List<FormationDTO> formations = formationService.getFormationsByDomaine(domaineId);
        return ResponseEntity.ok(ApiResponse.success(formations));
    }
    
    @GetMapping("/annee/{annee}")
    public ResponseEntity<ApiResponse<List<FormationDTO>>> getFormationsByAnnee(
            @PathVariable Integer annee) {
        List<FormationDTO> formations = formationService.getFormationsByAnnee(annee);
        return ResponseEntity.ok(ApiResponse.success(formations));
    }
    @GetMapping("/active-completion")
    public ResponseEntity<List<Map<String, Object>>> getActiveFormationsCompletion() {
    return ResponseEntity.ok(formationService.getActiveFormationsCompletion());
}
}
