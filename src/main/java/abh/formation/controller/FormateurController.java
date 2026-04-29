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
import abh.formation.dto.FormateurDTO;
import abh.formation.service.FormateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/formateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
public class FormateurController {
    
    private final FormateurService formateurService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<FormateurDTO>> createFormateur(@Valid @RequestBody FormateurDTO dto) {
        try {
            FormateurDTO created = formateurService.createFormateur(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Formateur created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<FormateurDTO>>> getAllFormateurs() {
        List<FormateurDTO> formateurs = formateurService.getAllFormateurs();
        return ResponseEntity.ok(ApiResponse.success(formateurs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FormateurDTO>> getFormateurById(@PathVariable Integer id) {
        try {
            FormateurDTO formateur = formateurService.getFormateurById(id);
            return ResponseEntity.ok(ApiResponse.success(formateur));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FormateurDTO>> updateFormateur(
            @PathVariable Integer id,
            @Valid @RequestBody FormateurDTO dto) {
        try {
            FormateurDTO updated = formateurService.updateFormateur(id, dto);
            return ResponseEntity.ok(ApiResponse.success("Formateur updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFormateur(@PathVariable Integer id) {
        try {
            formateurService.deleteFormateur(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Formateur deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<FormateurDTO>>> getFormateursByType(@PathVariable String type) {
        List<FormateurDTO> formateurs = formateurService.getFormateursByType(type);
        return ResponseEntity.ok(ApiResponse.success(formateurs));
    }
}
