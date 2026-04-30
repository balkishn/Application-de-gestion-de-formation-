package abh.formation.controller;

import abh.formation.dto.ApiResponse;
import abh.formation.model.Employeur;
import abh.formation.service.EmployeurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employeurs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
public class EmployeurController {
    
    private final EmployeurService employeurService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<Employeur>> createEmployeur(@Valid @RequestBody Employeur employeur) {
        try {
            Employeur created = employeurService.createEmployeur(employeur);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employeur created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Employeur>>> getAllEmployeurs() {
        List<Employeur> employeurs = employeurService.getAllEmployeurs();
        return ResponseEntity.ok(ApiResponse.success(employeurs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employeur>> getEmployeurById(@PathVariable Integer id) {
        try {
            Employeur employeur = employeurService.getEmployeurById(id);
            return ResponseEntity.ok(ApiResponse.success(employeur));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Employeur>> updateEmployeur(
            @PathVariable Integer id,
            @Valid @RequestBody Employeur employeur) {
        try {
            Employeur updated = employeurService.updateEmployeur(id, employeur);
            return ResponseEntity.ok(ApiResponse.success("Employeur updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployeur(@PathVariable Integer id) {
        try {
            employeurService.deleteEmployeur(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Employeur deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
