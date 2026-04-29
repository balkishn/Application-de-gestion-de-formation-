package abh.formation.dto;

import java.util.List;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationDTO {
    private Long id;
    private String titre;
    private Integer duree;
    private Double budget;
    private Integer domaineId;
    private String domaineLibelle;
    private String lieu;
    private String dateDebut;
    private Integer formateurId;
    private String formateurNom;
    private Integer participantCount;
    private List<Integer> participantIds;
}
