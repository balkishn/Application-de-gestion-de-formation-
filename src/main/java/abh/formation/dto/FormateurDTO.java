package abh.formation.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormateurDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private Long tel;
    private String type;
    private Integer employeurId;
    private String employeurNom;
}
