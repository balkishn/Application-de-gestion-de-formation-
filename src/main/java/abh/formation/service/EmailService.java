package abh.formation.service;

import abh.formation.dto.FormationDTO;

public interface EmailService {
    void sendInvitationEmail(String toEmail, String temporaryPassword);
    void sendResetPasswordEmail(String toEmail, String resetToken);
    void sendFormationStartingTodayEmail(String toEmail, FormationDTO formation, String message);
    void sendFormationAssignmentEmail(String toEmail, String participantName, FormationDTO formation);
}
