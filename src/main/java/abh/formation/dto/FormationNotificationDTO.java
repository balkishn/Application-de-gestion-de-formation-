package abh.formation.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationNotificationDTO {
    private Long id;
    private Long formationId;
    private String formationTitre;
    private String formationDateDebut;
    private String formationLieu;
    private Integer formationDuree;
    private String message;
    private LocalDateTime createdAt;
}