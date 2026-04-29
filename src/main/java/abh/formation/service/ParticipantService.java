package abh.formation.service;

import abh.formation.dto.ParticipantDTO;
import abh.formation.model.Participant;
import abh.formation.model.Profil;
import abh.formation.model.Structure;
import abh.formation.repository.ParticipantRepository;
import abh.formation.repository.ProfilRepository;
import abh.formation.repository.StructureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ParticipantService {
    
    private final ParticipantRepository participantRepository;
    private final StructureRepository structureRepository;
    private final ProfilRepository profilRepository;
    
    public Participant createParticipant(ParticipantDTO dto) {
        Structure structure = structureRepository.findById(dto.getStructureId())
            .orElseThrow(() -> new RuntimeException("Structure not found"));
        
        Profil profil = profilRepository.findById(dto.getProfilId())
            .orElseThrow(() -> new RuntimeException("Profil not found"));
        
        Participant participant = Participant.builder()
            .nom(dto.getNom())
            .prenom(dto.getPrenom())
            .email(dto.getEmail())
            .tel(dto.getTel())
            .structure(structure)
            .profil(profil)
            .build();
        
        return participantRepository.save(participant);
    }
    
    public List<ParticipantDTO> getAllParticipants() {
        return participantRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public ParticipantDTO getParticipantById(Integer id) {
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Participant not found"));
        return convertToDTO(participant);
    }
    
    public ParticipantDTO updateParticipant(Integer id, ParticipantDTO dto) {
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Participant not found"));
        
        Structure structure = structureRepository.findById(dto.getStructureId())
            .orElseThrow(() -> new RuntimeException("Structure not found"));
        
        Profil profil = profilRepository.findById(dto.getProfilId())
            .orElseThrow(() -> new RuntimeException("Profil not found"));
        
        participant.setNom(dto.getNom());
        participant.setPrenom(dto.getPrenom());
        participant.setEmail(dto.getEmail());
        participant.setTel(dto.getTel());
        participant.setStructure(structure);
        participant.setProfil(profil);
        
        Participant updated = participantRepository.save(participant);
        return convertToDTO(updated);
    }
    
    public void deleteParticipant(Integer id) {
        participantRepository.deleteById(id);
    }
    
    public List<ParticipantDTO> getParticipantsByStructure(Integer structureId) {
        return participantRepository.findByStructureId(structureId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public ParticipantDTO convertParticipantToDTO(Participant participant) {
        return convertToDTO(participant);
    }
    
    private ParticipantDTO convertToDTO(Participant participant) {
        return ParticipantDTO.builder()
            .id(participant.getId())
            .nom(participant.getNom())
            .prenom(participant.getPrenom())
            .email(participant.getEmail())
            .tel(participant.getTel())
            .structureId(participant.getStructure().getId())
            .structureLibelle(participant.getStructure().getLibelle())
            .profilId(participant.getProfil().getId())
            .profilLibelle(participant.getProfil().getLibelle())
            .build();
    }
}
