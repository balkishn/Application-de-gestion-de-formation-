package abh.formation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesOverviewDTO {
    private Long totalFormations;
    private Long totalParticipants;
    private Long totalFormateurs;
    private Long totalDomaines;
    private Double budgetTotal;
}
