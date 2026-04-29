package abh.formation.service;

import abh.formation.dto.DashboardDataDTO;
import abh.formation.dto.KeyValueStatDTO;
import abh.formation.dto.StatistiquesOverviewDTO;
import abh.formation.repository.DomaineRepository;
import abh.formation.repository.FormateurRepository;
import abh.formation.repository.FormationRepository;
import abh.formation.repository.ParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatistiquesService {

    private final FormationRepository formationRepository;
    private final ParticipantRepository participantRepository;
    private final FormateurRepository formateurRepository;
    private final DomaineRepository domaineRepository;

    // ── Endpoint agrégé pour optimiser les performances ──
    public DashboardDataDTO getDashboardData() {
        return DashboardDataDTO.builder()
            .overview(getOverview())
            .formationsParDomaine(getFormationsParDomaine())
            .participantsParStructure(getParticipantsParStructure())
            .build();
    }

    public StatistiquesOverviewDTO getOverview() {
        Double totalBudget = formationRepository.getTotalBudget();
        return StatistiquesOverviewDTO.builder()
            .totalFormations(formationRepository.count())
            .totalParticipants(participantRepository.count())
            .totalFormateurs(formateurRepository.count())
            .totalDomaines(domaineRepository.count())
            .budgetTotal(totalBudget == null ? 0D : totalBudget)
            .build();
    }

    public List<KeyValueStatDTO> getFormationsParDomaine() {
        return mapPairs(formationRepository.countFormationsByDomaine());
    }

    public List<KeyValueStatDTO> getFormationsParAnnee() {
        return formationRepository.countFormationsByAnnee().stream()
            .map(row -> KeyValueStatDTO.builder()
                .label(String.valueOf(row[0]))
                .value((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    public List<KeyValueStatDTO> getParticipantsParStructure() {
        return mapPairs(participantRepository.countParticipantsByStructure());
    }

    public List<KeyValueStatDTO> getParticipantsParProfil() {
        return mapPairs(participantRepository.countParticipantsByProfil());
    }

    public List<KeyValueStatDTO> getFormateursParType() {
        return mapPairs(formateurRepository.countFormateursByType());
    }

    private List<KeyValueStatDTO> mapPairs(List<Object[]> rows) {
        return rows.stream()
            .map(row -> KeyValueStatDTO.builder()
                .label((String) row[0])
                .value((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }
}
