package abh.formation.controller;

import abh.formation.dto.ApiResponse;
import abh.formation.dto.ParticipantDTO;
import abh.formation.service.ParticipantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/participants")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'RESPONSABLE', 'SIMPLE_UTILISATEUR')")
public class ParticipantController {
    
    private final ParticipantService participantService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<ParticipantDTO>> createParticipant(@Valid @RequestBody ParticipantDTO dto) {
        try {
            var participant = participantService.createParticipant(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Participant created successfully", 
                    participantService.convertParticipantToDTO(participant)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ParticipantDTO>>> getAllParticipants() {
        List<ParticipantDTO> participants = participantService.getAllParticipants();
        return ResponseEntity.ok(ApiResponse.success(participants));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParticipantDTO>> getParticipantById(@PathVariable Integer id) {
        try {
            ParticipantDTO participant = participantService.getParticipantById(id);
            return ResponseEntity.ok(ApiResponse.success(participant));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ParticipantDTO>> updateParticipant(
            @PathVariable Integer id,
            @Valid @RequestBody ParticipantDTO dto) {
        try {
            ParticipantDTO updated = participantService.updateParticipant(id, dto);
            return ResponseEntity.ok(ApiResponse.success("Participant updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteParticipant(@PathVariable Integer id) {
        try {
            participantService.deleteParticipant(id);
            return ResponseEntity.ok(ApiResponse.successMessage("Participant deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/structure/{structureId}")
    public ResponseEntity<ApiResponse<List<ParticipantDTO>>> getParticipantsByStructure(
            @PathVariable Integer structureId) {
        List<ParticipantDTO> participants = participantService.getParticipantsByStructure(structureId);
        return ResponseEntity.ok(ApiResponse.success(participants));
    }
}
