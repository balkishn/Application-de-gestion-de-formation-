package abh.formation.controller;

import abh.formation.dto.ApiResponse;
import abh.formation.model.Structure;
import abh.formation.service.StructureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/structures")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StructureController {
    
    private final StructureService structureService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Structure>> createStructure(@Valid @RequestBody Structure structure) {
        try {
            Structure created = structureService.createStructure(structure);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Structure created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
    public ResponseEntity<ApiResponse<List<Structure>>> getAllStructures() {
        List<Structure> structures = structureService.getAllStructures();
        return ResponseEntity.ok(ApiResponse.success(structures));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
    public ResponseEntity<ApiResponse<Structure>> getStructureById(@PathVariable Integer id) {
        try {
            Structure structure = structureService.getStructureById(id);
            return ResponseEntity.ok(ApiResponse.success(structure));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Structure>> updateStructure(
            @PathVariable Integer id,
            @Valid @RequestBody Structure structure) {
        try {
            Structure updated = structureService.updateStructure(id, structure);
            return ResponseEntity.ok(ApiResponse.success("Structure updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Void>> deleteStructure(@PathVariable Integer id) {
        try {
            structureService.deleteStructure(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Structure deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
}
