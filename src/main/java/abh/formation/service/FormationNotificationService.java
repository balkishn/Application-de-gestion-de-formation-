package abh.formation.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import abh.formation.dto.FormationDTO;
import abh.formation.dto.FormationNotificationDTO;
import abh.formation.model.Formation;
import abh.formation.model.FormationNotification;
import abh.formation.model.Utilisateur;
import abh.formation.repository.FormationNotificationRepository;
import abh.formation.repository.FormationRepository;
import abh.formation.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FormationNotificationService {

    private final FormationRepository formationRepository;
    private final FormationNotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EmailService emailService;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        syncTodayNotifications();
    }

    @Scheduled(fixedDelay = 60000)
    public void scheduledSync() {
        syncTodayNotifications();
    }

    public void syncTodayNotifications() {
        formationRepository.findAll().stream()
            .filter(this::isStartingToday)
            .forEach(this::createNotificationIfNeeded);
    }

    public void publishNotificationIfNeeded(Formation formation) {
        if (formation == null || !isStartingToday(formation)) {
            return;
        }
        createNotificationIfNeeded(formation);
    }

    public List<FormationNotificationDTO> getRecentNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::toDto)
            .toList();
    }

    private void createNotificationIfNeeded(Formation formation) {
        if (formation == null || formation.getId() == null) {
            return;
        }

        if (!isStartingToday(formation) || notificationRepository.existsByFormationId(formation.getId())) {
            return;
        }

        String message = buildMessage(formation);
        FormationNotification notification = FormationNotification.builder()
            .formationId(formation.getId())
            .formationTitre(formation.getTitre())
            .formationDateDebut(formation.getDateDebut())
            .formationLieu(formation.getLieu())
            .formationDuree(formation.getDuree())
            .message(message)
            .build();

        notificationRepository.save(notification);
        sendNotificationEmails(formation, message);
        log.info("Formation notification created for formationId={} dateDebut={}", formation.getId(), formation.getDateDebut());
    }

    private void sendNotificationEmails(Formation formation, String message) {
        List<Utilisateur> recipients = utilisateurRepository.findAll().stream()
            .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
            .filter(user -> StringUtils.hasText(user.getEmail()))
            .toList();

        if (recipients.isEmpty()) {
            return;
        }

        FormationDTO dto = FormationDTO.builder()
            .id(formation.getId())
            .titre(formation.getTitre())
            .duree(formation.getDuree())
            .budget(formation.getBudget())
            .domaineId(formation.getDomaine() != null ? formation.getDomaine().getId() : null)
            .domaineLibelle(formation.getDomaine() != null ? formation.getDomaine().getLibelle() : null)
            .lieu(formation.getLieu())
            .dateDebut(formation.getDateDebut())
            .formateurId(formation.getFormateur() != null ? formation.getFormateur().getId() : null)
            .formateurNom(formation.getFormateur() != null ? formation.getFormateur().getNom() + " " + formation.getFormateur().getPrenom() : null)
            .build();

        for (Utilisateur recipient : recipients) {
            try {
                emailService.sendFormationStartingTodayEmail(recipient.getEmail(), dto, message);
            } catch (Exception ex) {
                log.warn("Failed to send formation notification email to {}: {}", recipient.getEmail(), ex.getMessage());
            }
        }
    }

    private boolean isStartingToday(Formation formation) {
        if (formation == null || !StringUtils.hasText(formation.getDateDebut())) {
            return false;
        }

        try {
            return LocalDate.parse(formation.getDateDebut()).isEqual(LocalDate.now());
        } catch (Exception ex) {
            log.warn("Invalid formation dateDebut={} for formationId={}", formation.getDateDebut(), formation.getId());
            return false;
        }
    }

    private String buildMessage(Formation formation) {
        StringBuilder builder = new StringBuilder();
        builder.append("La formation \"").append(formation.getTitre()).append("\" commence aujourd'hui.");
        if (StringUtils.hasText(formation.getLieu())) {
            builder.append(" Lieu: ").append(formation.getLieu()).append('.');
        }
        if (formation.getDuree() != null) {
            builder.append(" Durée: ").append(formation.getDuree()).append(" jour(s).");
        }
        if (formation.getDomaine() != null && StringUtils.hasText(formation.getDomaine().getLibelle())) {
            builder.append(" Domaine: ").append(formation.getDomaine().getLibelle()).append('.');
        }
        return builder.toString();
    }

    private FormationNotificationDTO toDto(FormationNotification notification) {
        return FormationNotificationDTO.builder()
            .id(notification.getId())
            .formationId(notification.getFormationId())
            .formationTitre(notification.getFormationTitre())
            .formationDateDebut(notification.getFormationDateDebut())
            .formationLieu(notification.getFormationLieu())
            .formationDuree(notification.getFormationDuree())
            .message(notification.getMessage())
            .createdAt(notification.getCreatedAt())
            .build();
    }
}