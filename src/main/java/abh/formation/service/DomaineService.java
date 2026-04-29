package abh.formation.service;

import abh.formation.dto.DomaineDTO;
import abh.formation.model.Domaine;
import abh.formation.repository.DomaineRepository;
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
public class DomaineService {
    
    private final DomaineRepository domaineRepository;
    
    public Domaine createDomaine(DomaineDTO dto) {
        if (domaineRepository.existsByLibelle(dto.getLibelle())) {
            throw new RuntimeException("Domaine with this name already exists");
        }
        
        Domaine domaine = Domaine.builder()
            .libelle(dto.getLibelle())
            .build();
        
        return domaineRepository.save(domaine);
    }
    
    public List<DomaineDTO> getAllDomaines() {
        return domaineRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public DomaineDTO getDomaineById(Integer id) {
        Domaine domaine = domaineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Domaine not found"));
        return convertToDTO(domaine);
    }
    
    public DomaineDTO updateDomaine(Integer id, DomaineDTO dto) {
        Domaine domaine = domaineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Domaine not found"));
        
        if (!domaine.getLibelle().equals(dto.getLibelle()) && 
            domaineRepository.existsByLibelle(dto.getLibelle())) {
            throw new RuntimeException("Domaine with this name already exists");
        }
        
        domaine.setLibelle(dto.getLibelle());
        Domaine updated = domaineRepository.save(domaine);
        return convertToDTO(updated);
    }
    
    public void deleteDomaine(Integer id) {
        domaineRepository.deleteById(id);
    }
    
    public DomaineDTO convertDomaineToDTO(Domaine domaine) {
        return convertToDTO(domaine);
    }
    
    private DomaineDTO convertToDTO(Domaine domaine) {
        return DomaineDTO.builder()
            .id(domaine.getId())
            .libelle(domaine.getLibelle())
            .build();
    }
}
