package abh.formation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurDTO {
    private Integer id;
    private String email;
    private String login;
    private String roleName;
    private Boolean isActive;
    private Boolean mustChangePassword;
}
