package abh.formation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private Long tel;
    private Integer structureId;
    private String structureLibelle; //added to include the structure name in the DTO
    private Integer profilId;
    private String profilLibelle; //added to include the profile name in the DTO
}
