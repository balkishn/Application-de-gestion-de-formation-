package abh.formation.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyIterable;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import abh.formation.dto.FormationDTO;
import abh.formation.model.Domaine;
import abh.formation.model.Formateur;
import abh.formation.model.Formation;
import abh.formation.model.Participant;
import abh.formation.repository.DomaineRepository;
import abh.formation.repository.FormateurRepository;
import abh.formation.repository.FormationRepository;
import abh.formation.repository.ParticipantRepository;

@ExtendWith(MockitoExtension.class)
class FormationServiceTest {

    @Mock
    private FormationRepository formationRepository;

    @Mock
    private DomaineRepository domaineRepository;

    @Mock
    private FormateurRepository formateurRepository;

    @Mock
    private ParticipantRepository participantRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private FormationNotificationService formationNotificationService;

    @InjectMocks
    private FormationService formationService;

    @Test
    void createFormation_sendsAssignmentEmailsToAllParticipantsWithEmail() {
        Domaine domaine = Domaine.builder().id(10).libelle("Informatique").build();
        Formateur formateur = Formateur.builder().id(7).nom("Diallo").prenom("Aminata").build();
        Participant participantOne = Participant.builder().id(1).prenom("Lina").nom("Benali").email("lina@example.com").build();
        Participant participantTwo = Participant.builder().id(2).prenom("Omar").nom("Khalil").email("omar@example.com").build();

        FormationDTO request = FormationDTO.builder()
            .titre("Spring Boot Avance")
            .duree(5)
            .budget(2500.0)
            .domaineId(domaine.getId())
            .formateurId(formateur.getId())
            .lieu("Salle 3")
            .dateDebut("2026-05-10")
            .participantIds(List.of(participantOne.getId(), participantTwo.getId()))
            .build();

        when(domaineRepository.findById(domaine.getId())).thenReturn(Optional.of(domaine));
        when(formateurRepository.findById(formateur.getId())).thenReturn(Optional.of(formateur));
        when(participantRepository.findAllById(anyIterable()))
            .thenReturn(List.of(participantOne, participantTwo));
        when(formationRepository.save(any(Formation.class))).thenAnswer(invocation -> {
            Formation formation = invocation.getArgument(0);
            formation.setId(99L);
            return formation;
        });

        Formation saved = formationService.createFormation(request);

        assertEquals(99L, saved.getId());

        ArgumentCaptor<FormationDTO> formationCaptor = ArgumentCaptor.forClass(FormationDTO.class);
        verify(emailService).sendFormationAssignmentEmail(eq("lina@example.com"), eq("Lina Benali"), formationCaptor.capture());
        verify(emailService).sendFormationAssignmentEmail(eq("omar@example.com"), eq("Omar Khalil"), any(FormationDTO.class));

        FormationDTO emailedFormation = formationCaptor.getValue();
        assertEquals("Spring Boot Avance", emailedFormation.getTitre());
        assertEquals("2026-05-10", emailedFormation.getDateDebut());
        assertEquals("Informatique", emailedFormation.getDomaineLibelle());
        assertEquals("Diallo Aminata", emailedFormation.getFormateurNom());
        assertEquals(List.of(1, 2), emailedFormation.getParticipantIds());

        verify(formationNotificationService).publishNotificationIfNeeded(saved);
    }

    @Test
    void createFormation_skipsAssignmentEmailForParticipantWithoutEmail() {
        Domaine domaine = Domaine.builder().id(10).libelle("Informatique").build();
        Formateur formateur = Formateur.builder().id(7).nom("Diallo").prenom("Aminata").build();
        Participant participant = Participant.builder().id(1).prenom("Lina").nom("Benali").email(" ").build();

        FormationDTO request = FormationDTO.builder()
            .titre("Spring Boot Avance")
            .duree(5)
            .budget(2500.0)
            .domaineId(domaine.getId())
            .formateurId(formateur.getId())
            .lieu("Salle 3")
            .dateDebut("2026-05-10")
            .participantIds(List.of(participant.getId()))
            .build();

        when(domaineRepository.findById(domaine.getId())).thenReturn(Optional.of(domaine));
        when(formateurRepository.findById(formateur.getId())).thenReturn(Optional.of(formateur));
        when(participantRepository.findAllById(anyIterable())).thenReturn(List.of(participant));
        when(formationRepository.save(any(Formation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        formationService.createFormation(request);

        verify(emailService, never()).sendFormationAssignmentEmail(any(), any(), any());
    }
}
