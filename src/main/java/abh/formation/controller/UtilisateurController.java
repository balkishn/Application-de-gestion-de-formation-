package abh.formation.controller;

import java.util.List;

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
import abh.formation.dto.CreateUtilisateurRequest;
import abh.formation.dto.RoleDTO;
import abh.formation.dto.UtilisateurDTO;
import abh.formation.service.UtilisateurService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UtilisateurController {
    
    private final UtilisateurService utilisateurService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<UtilisateurDTO>>> getAllUtilisateurs() {
        List<UtilisateurDTO> utilisateurs = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(ApiResponse.success(utilisateurs));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMINISTRATEUR') or hasRole('RESPONSABLE')")
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getAvailableRoles() {
        return ResponseEntity.ok(ApiResponse.success(utilisateurService.getAvailableRoles()));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR') or hasRole('RESPONSABLE')")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> createUtilisateur(@RequestBody CreateUtilisateurRequest request) {
        try {
            UtilisateurDTO created = utilisateurService.createUtilisateur(request.getEmail(), request.getRoleId());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created and invitation sent", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> getUtilisateurById(@PathVariable Integer id) {
        try {
            UtilisateurDTO utilisateur = utilisateurService.getUtilisateurById(id);
            return ResponseEntity.ok(ApiResponse.success(utilisateur));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR') or hasRole('RESPONSABLE') or hasRole('SIMPLE_UTILISATEUR')")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> updateUtilisateur(
            @PathVariable Integer id,
            @RequestBody UtilisateurDTO dto) {
        try {
            UtilisateurDTO updated = utilisateurService.updateUtilisateur(id, dto.getLogin(), dto.getEmail());
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR') or hasRole('RESPONSABLE')")
    public ResponseEntity<ApiResponse<Void>> deleteUtilisateur(@PathVariable Integer id) {
        try {
            utilisateurService.deleteUtilisateur(id);
            return ResponseEntity.ok(ApiResponse.successMessage("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
