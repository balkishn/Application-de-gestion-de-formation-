package abh.formation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUtilisateurRequest {
    private String email;
    private String login;
    private String password;
    private Integer roleId;
}