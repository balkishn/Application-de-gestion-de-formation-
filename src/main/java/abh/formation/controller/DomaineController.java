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
import abh.formation.dto.DomaineDTO;
import abh.formation.service.DomaineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/domaines")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DomaineController {
    
    private final DomaineService domaineService;
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @PostMapping
    public ResponseEntity<ApiResponse<DomaineDTO>> createDomaine(@Valid @RequestBody DomaineDTO dto) {
        try {
            var domaine = domaineService.createDomaine(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Domaine created successfully", 
                    domaineService.convertDomaineToDTO(domaine)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<DomaineDTO>>> getAllDomaines() {
        List<DomaineDTO> domaines = domaineService.getAllDomaines();
        return ResponseEntity.ok(ApiResponse.success(domaines));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DomaineDTO>> getDomaineById(@PathVariable Integer id) {
        try {
            DomaineDTO domaine = domaineService.getDomaineById(id);
            return ResponseEntity.ok(ApiResponse.success(domaine));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DomaineDTO>> updateDomaine(
            @PathVariable Integer id,
            @Valid @RequestBody DomaineDTO dto) {
        try {
            DomaineDTO updated = domaineService.updateDomaine(id, dto);
            return ResponseEntity.ok(ApiResponse.success("Domaine updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDomaine(@PathVariable Integer id) {
        try {
            domaineService.deleteDomaine(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Domaine deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
