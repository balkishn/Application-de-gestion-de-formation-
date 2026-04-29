package abh.formation.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import abh.formation.dto.FormationDTO;
import abh.formation.model.Domaine;
import abh.formation.model.Formateur;
import abh.formation.model.Formation;
import abh.formation.model.Participant;
import abh.formation.repository.DomaineRepository;
import abh.formation.repository.FormateurRepository;
import abh.formation.repository.FormationRepository;
import abh.formation.repository.ParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FormationService {

    public static final String FORMATIONS_ALL_CACHE = "formations-all";
    public static final String FORMATION_BY_ID_CACHE = "formation-by-id";
    public static final String FORMATIONS_BY_DOMAINE_CACHE = "formations-by-domaine";
    public static final String FORMATIONS_BY_ANNEE_CACHE = "formations-by-annee";
    
    private final FormationRepository formationRepository;
    private final DomaineRepository domaineRepository;
    private final FormateurRepository formateurRepository;
    private final ParticipantRepository participantRepository;
    private final EmailService emailService;
    private final FormationNotificationService formationNotificationService;
    
    @Caching(evict = {
        @CacheEvict(value = FORMATIONS_ALL_CACHE, allEntries = true),
        @CacheEvict(value = FORMATIONS_BY_DOMAINE_CACHE, allEntries = true),
        @CacheEvict(value = FORMATIONS_BY_ANNEE_CACHE, allEntries = true),
        @CacheEvict(value = FORMATION_BY_ID_CACHE, allEntries = true)
    })
    public Formation createFormation(FormationDTO dto) {
        Domaine domaine = domaineRepository.findById(dto.getDomaineId())
            .orElseThrow(() -> new RuntimeException("Domaine not found"));
        
        Formateur formateur = formateurRepository.findById(dto.getFormateurId())
            .orElseThrow(() -> new RuntimeException("Formateur not found"));
        
        Formation formation = Formation.builder()
            .titre(dto.getTitre())
            .duree(dto.getDuree())
            .budget(dto.getBudget())
            .domaine(domaine)
            .lieu(dto.getLieu())
            .dateDebut(dto.getDateDebut())
            .formateur(formateur)
            .participants(resolveParticipants(dto.getParticipantIds()))
            .build();
        
        Formation saved = formationRepository.save(formation);
        notifyAssignedParticipants(saved);
        formationNotificationService.publishNotificationIfNeeded(saved);
        return saved;
    }
    
    @Cacheable(FORMATIONS_ALL_CACHE)
    public List<FormationDTO> getAllFormations() {
        return formationRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Cacheable(value = FORMATION_BY_ID_CACHE, key = "#id")
    public FormationDTO getFormationById(Long id) {
        Formation formation = formationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Formation not found"));
        return convertToDTO(formation);
    }
    
    @Caching(evict = {
        @CacheEvict(value = FORMATIONS_ALL_CACHE, allEntries = true),
        @CacheEvict(value = FORMATIONS_BY_DOMAINE_CACHE, allEntries = true),
        @CacheEvict(value = FORMATIONS_BY_ANNEE_CACHE, allEntries = true),
        @CacheEvict(value = FORMATION_BY_ID_CACHE, key = "#id")
    })
    public FormationDTO updateFormation(Long id, FormationDTO dto) {
        Formation formation = formationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Formation not found"));
        
        Domaine domaine = domaineRepository.findById(dto.getDomaineId())
            .orElseThrow(() -> new RuntimeException("Domaine not found"));
        
        Formateur formateur = formateurRepository.findById(dto.getFormateurId())
            .orElseThrow(() -> new RuntimeException("Formateur not found"));
        
        formation.setTitre(dto.getTitre());
        formation.setDuree(dto.getDuree());
        formation.setBudget(dto.getBudget());
        formation.setDomaine(domaine);
        formation.setLieu(dto.getLieu());
        formation.setDateDebut(dto.getDateDebut());
        formation.setFormateur(formateur);
        if (dto.getParticipantIds() != null) {
            formation.setParticipants(resolveParticipants(dto.getParticipantIds()));
        }
        
        Formation updated = formationRepository.save(formation);
        formationNotificationService.publishNotificationIfNeeded(updated);
        return convertToDTO(updated);
    }
    
    @Caching(evict = {
        @CacheEvict(value = FORMATIONS_ALL_CACHE, allEntries = true),
        @CacheEvict(value = FORMATIONS_BY_DOMAINE_CACHE, allEntries = true),
        @CacheEvict(value = FORMATIONS_BY_ANNEE_CACHE, allEntries = true),
        @CacheEvict(value = FORMATION_BY_ID_CACHE, key = "#id")
    })
    public void deleteFormation(Long id) {
        formationRepository.deleteById(id);
    }
    
    @Cacheable(value = FORMATIONS_BY_DOMAINE_CACHE, key = "#domaineId")
    public List<FormationDTO> getFormationsByDomaine(Integer domaineId) {
        return formationRepository.findByDomaineId(domaineId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Cacheable(value = FORMATIONS_BY_ANNEE_CACHE, key = "#annee")
    public List<FormationDTO> getFormationsByAnnee(Integer annee) {
        return formationRepository.findByDateDebutStartingWith(String.valueOf(annee))
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public FormationDTO convertFormationToDTO(Formation formation) {
        return convertToDTO(formation);
    }

    private void notifyAssignedParticipants(Formation formation) {
        FormationDTO formationDto = convertToDTO(formation);
        List<Participant> participants = formation.getParticipants();
        if (participants == null || participants.isEmpty()) {
            return;
        }

        for (Participant participant : participants) {
            if (participant == null || !StringUtils.hasText(participant.getEmail())) {
                continue;
            }

            try {
                emailService.sendFormationAssignmentEmail(
                    participant.getEmail(),
                    buildParticipantDisplayName(participant),
                    formationDto
                );
            } catch (Exception ex) {
                log.warn("Failed to send formation assignment email to {}: {}", participant.getEmail(), ex.getMessage());
            }
        }
    }
    
    private FormationDTO convertToDTO(Formation formation) {
        return FormationDTO.builder()
            .id(formation.getId())
            .titre(formation.getTitre())
            .duree(formation.getDuree())
            .budget(formation.getBudget())
            .domaineId(formation.getDomaine().getId())
            .domaineLibelle(formation.getDomaine().getLibelle())
            .lieu(formation.getLieu())
            .dateDebut(formation.getDateDebut())
            .formateurId(formation.getFormateur().getId())
            .formateurNom(formation.getFormateur().getNom() + " " + formation.getFormateur().getPrenom())
            .participantCount(formation.getParticipants() != null ? formation.getParticipants().size() : 0)
            .participantIds(formation.getParticipants() == null ? List.of() : formation.getParticipants().stream()
                .map(Participant::getId)
                .toList())
            .build();
    }

    private String buildParticipantDisplayName(Participant participant) {
        String prenom = participant.getPrenom() == null ? "" : participant.getPrenom().trim();
        String nom = participant.getNom() == null ? "" : participant.getNom().trim();
        String fullName = (prenom + " " + nom).trim();
        return fullName.isEmpty() ? "Participant" : fullName;
    }

    private List<Participant> resolveParticipants(List<Integer> participantIds) {
        if (participantIds == null || participantIds.isEmpty()) {
            return new ArrayList<>();
        }

        Set<Integer> uniqueParticipantIds = new LinkedHashSet<>(participantIds);
        List<Participant> participants = participantRepository.findAllById(uniqueParticipantIds);
        if (participants.size() != uniqueParticipantIds.size()) {
            throw new RuntimeException("One or more participants not found");
        }

        return participants;
    }
    public List<Map<String, Object>> getActiveFormationsCompletion() {
    LocalDate today = LocalDate.now();
    
    return formationRepository.findAll().stream()
        .filter(f -> f.getDateDebut() != null && !f.getDateDebut().isBlank())
        .map(f -> {
            LocalDate start = LocalDate.parse(f.getDateDebut());
            LocalDate end = start.plusDays(f.getDuree());
            
            // exclude finished formations
            if (!end.isAfter(today)) return null;
            
            int completionPct;
            if (today.isBefore(start)) {
                completionPct = 0; // not started yet
            } else {
                long elapsed = ChronoUnit.DAYS.between(start, today);
                completionPct = (int) Math.round((elapsed * 100.0) / f.getDuree());
                completionPct = Math.min(completionPct, 99); // cap at 99 if still running
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("id", f.getId());
            result.put("label", f.getTitre());
            result.put("val", completionPct);
            result.put("domaine", f.getDomaine().getLibelle());
            result.put("dateDebut", f.getDateDebut());
            result.put("duree", f.getDuree());
            return result;
        })
        .filter(Objects::nonNull)
        .collect(Collectors.toList());
}
}
