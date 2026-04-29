package abh.formation.service;

import abh.formation.model.Structure;
import abh.formation.repository.StructureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StructureService {
    
    private final StructureRepository structureRepository;
    
    public Structure createStructure(Structure structure) {
        if (structureRepository.existsByLibelle(structure.getLibelle())) {
            throw new RuntimeException("Structure with this name already exists");
        }
        return structureRepository.save(structure);
    }
    
    public List<Structure> getAllStructures() {
        return structureRepository.findAll();
    }
    
    public Structure getStructureById(Integer id) {
        return structureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Structure not found"));
    }
    
    public Structure updateStructure(Integer id, Structure structure) {
        Structure existing = structureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Structure not found"));
        
        if (!existing.getLibelle().equals(structure.getLibelle()) && 
            structureRepository.existsByLibelle(structure.getLibelle())) {
            throw new RuntimeException("Structure with this name already exists");
        }
        
        existing.setLibelle(structure.getLibelle());
        return structureRepository.save(existing);
    }
    
    public void deleteStructure(Integer id) {
        structureRepository.deleteById(id);
    }
}
