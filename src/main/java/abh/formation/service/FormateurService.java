package abh.formation.service;

import abh.formation.dto.FormateurDTO;
import abh.formation.model.Employeur;
import abh.formation.model.Formateur;
import abh.formation.repository.EmployeurRepository;
import abh.formation.repository.FormateurRepository;
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
public class FormateurService {
    
    private final FormateurRepository formateurRepository;
    private final EmployeurRepository employeurRepository;
    
    public FormateurDTO createFormateur(FormateurDTO dto) {
        Employeur employeur = null;
        if (Formateur.EXTERNE.equals(dto.getType()) && dto.getEmployeurId() == null) {
            throw new RuntimeException("Le nom de l'employeur est obligatoire pour un formateur externe");
        }

        if (dto.getEmployeurId() != null) {
            if (Formateur.INTERNE.equals(dto.getType())) {
                throw new RuntimeException("Un formateur interne ne doit pas être rattaché à un employeur");
            }
            employeur = employeurRepository.findById(dto.getEmployeurId())
                .orElseThrow(() -> new RuntimeException("Employeur not found"));
        }
        
        Formateur formateur = Formateur.builder()
            .nom(dto.getNom())
            .prenom(dto.getPrenom())
            .email(dto.getEmail())
            .tel(dto.getTel())
            .type(dto.getType())
            .employeur(employeur)
            .build();
        
        Formateur savedFormateur = formateurRepository.save(formateur);
        return convertToDTO(savedFormateur);
    }
    
    public List<FormateurDTO> getAllFormateurs() {
        return formateurRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public FormateurDTO getFormateurById(Integer id) {
        Formateur formateur = formateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Formateur not found"));
        return convertToDTO(formateur);
    }
    
    public FormateurDTO updateFormateur(Integer id, FormateurDTO dto) {
        Formateur formateur = formateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Formateur not found"));
        
        Employeur employeur = null;
        if (Formateur.EXTERNE.equals(dto.getType()) && dto.getEmployeurId() == null) {
            throw new RuntimeException("Le nom de l'employeur est obligatoire pour un formateur externe");
        }

        if (dto.getEmployeurId() != null) {
            if (Formateur.INTERNE.equals(dto.getType())) {
                throw new RuntimeException("Un formateur interne ne doit pas être rattaché à un employeur");
            }
            employeur = employeurRepository.findById(dto.getEmployeurId())
                .orElseThrow(() -> new RuntimeException("Employeur not found"));
        }
        
        formateur.setNom(dto.getNom());
        formateur.setPrenom(dto.getPrenom());
        formateur.setEmail(dto.getEmail());
        formateur.setTel(dto.getTel());
        formateur.setType(dto.getType());
        formateur.setEmployeur(employeur);
        
        Formateur updated = formateurRepository.save(formateur);
        return convertToDTO(updated);
    }
    
    public void deleteFormateur(Integer id) {
        formateurRepository.deleteById(id);
    }
    
    public List<FormateurDTO> getFormateursByType(String type) {
        return formateurRepository.findByType(type)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    private FormateurDTO convertToDTO(Formateur formateur) {
        return FormateurDTO.builder()
            .id(formateur.getId())
            .nom(formateur.getNom())
            .prenom(formateur.getPrenom())
            .email(formateur.getEmail())
            .tel(formateur.getTel())
            .type(formateur.getType())
            .employeurId(formateur.getEmployeur() != null ? formateur.getEmployeur().getId() : null)
            .employeurNom(formateur.getEmployeur() != null ? formateur.getEmployeur().getNomemployeur() : null)
            .build();
    }
}
