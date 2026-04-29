package abh.formation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompleteFirstLoginRequest {
    private String identifier;
    private String currentPassword;
    private String login;
    private String newPassword;
    private String confirmPassword;
}
