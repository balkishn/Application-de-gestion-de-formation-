package abh.formation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import abh.formation.dto.FormationDTO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username:balkis.hanafi@gmail.com}")
    private String mailFrom;

    @Override
    public void sendInvitationEmail(String toEmail, String temporaryPassword) {
        String subject = "Invitation - Plateforme Formation";
        String body = """
            Bienvenue sur la plateforme de formation.

            Votre identifiant de connexion est votre email: %s
            Mot de passe temporaire: %s

            A la premiere connexion, vous devrez choisir un login et un nouveau mot de passe.
            Lien de connexion: %s
            """.formatted(toEmail, temporaryPassword, frontendBaseUrl);

        sendEmail(toEmail, subject, body);
    }

    @Override
    public void sendResetPasswordEmail(String toEmail, String resetToken) {
        String resetLink = frontendBaseUrl + "/reset-password?token=" + resetToken;
        String subject = "Reinitialisation de mot de passe";
        String body = """
            Vous avez demande une reinitialisation de mot de passe.

            Cliquez sur ce lien pour definir un nouveau mot de passe:
            %s

            Ce lien expire dans 15 minutes.
            """.formatted(resetLink);

        sendEmail(toEmail, subject, body);
    }

    @Override
    public void sendFormationStartingTodayEmail(String toEmail, FormationDTO formation, String message) {
        String subject = "Formation qui commence aujourd'hui: " + formation.getTitre();
        String body = """
            Une formation commence aujourd'hui sur la plateforme.

            Titre: %s
            Date de début: %s
            Durée: %s jour(s)
            Lieu: %s
            Domaine: %s

            %s

            Connectez-vous pour consulter les détails sur la plateforme: %s/dashboard/formations
            """.formatted(
            formation.getTitre(),
            formation.getDateDebut() == null ? "Non renseignee" : formation.getDateDebut(),
            formation.getDuree() == null ? "Non renseignee" : formation.getDuree(),
            formation.getLieu() == null ? "Non renseigne" : formation.getLieu(),
            formation.getDomaineLibelle() == null ? "Non renseigne" : formation.getDomaineLibelle(),
            message,
            frontendBaseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    @Override
    public void sendFormationAssignmentEmail(String toEmail, String participantName, FormationDTO formation) {
        String subject = "Affectation a une formation: " + formation.getTitre();
        String body = """
            Bonjour %s,

            Vous avez ete affecte(e) a une nouvelle formation.

            Titre: %s
            Date de debut: %s
            Duree: %s jour(s)
            Lieu: %s
            Domaine: %s
            Formateur: %s

            """.formatted(
            participantName == null || participantName.isBlank() ? "Participant" : participantName,
            formation.getTitre() == null ? "Non renseignee" : formation.getTitre(),
            formation.getDateDebut() == null ? "Non renseignee" : formation.getDateDebut(),
            formation.getDuree() == null ? "Non renseignee" : formation.getDuree(),
            formation.getLieu() == null ? "Non renseigne" : formation.getLieu(),
            formation.getDomaineLibelle() == null ? "Non renseigne" : formation.getDomaineLibelle(),
            formation.getFormateurNom() == null ? "Non renseigne" : formation.getFormateurNom()
            
        );

        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (mailFrom != null && !mailFrom.isBlank()) {
                message.setFrom(mailFrom);
            }
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (RuntimeException ex) {
            // Fallback to logs so the auth flow still works in dev environments without SMTP.
            log.warn("Email send failed, falling back to logs. TO={} SUBJECT={} ERROR={}", toEmail, subject, ex.getMessage());
            log.info("EMAIL TO={} SUBJECT={} BODY={}", toEmail, subject, body);
        }
    }
}
