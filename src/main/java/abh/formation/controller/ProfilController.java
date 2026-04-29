package abh.formation.controller;

import abh.formation.dto.ApiResponse;
import abh.formation.model.Profil;
import abh.formation.service.ProfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profils")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProfilController {
    
    private final ProfilService profilService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Profil>> createProfil(@Valid @RequestBody Profil profil) {
        try {
            Profil created = profilService.createProfil(profil);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Profil created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
    public ResponseEntity<ApiResponse<List<Profil>>> getAllProfils() {
        List<Profil> profils = profilService.getAllProfils();
        return ResponseEntity.ok(ApiResponse.success(profils));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
    public ResponseEntity<ApiResponse<Profil>> getProfilById(@PathVariable Integer id) {
        try {
            Profil profil = profilService.getProfilById(id);
            return ResponseEntity.ok(ApiResponse.success(profil));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Profil>> updateProfil(
            @PathVariable Integer id,
            @Valid @RequestBody Profil profil) {
        try {
            Profil updated = profilService.updateProfil(id, profil);
            return ResponseEntity.ok(ApiResponse.success("Profil updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Void>> deleteProfil(@PathVariable Integer id) {
        try {
            profilService.deleteProfil(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Profil deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
