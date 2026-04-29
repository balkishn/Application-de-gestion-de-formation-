package abh.formation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDataDTO {
    private StatistiquesOverviewDTO overview;
    private List<KeyValueStatDTO> formationsParDomaine;
    private List<KeyValueStatDTO> participantsParStructure;
}
