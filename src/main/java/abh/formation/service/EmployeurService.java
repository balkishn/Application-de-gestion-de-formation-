package abh.formation.service;

import abh.formation.model.Employeur;
import abh.formation.repository.EmployeurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmployeurService {
    
    private final EmployeurRepository employeurRepository;
    
    public Employeur createEmployeur(Employeur employeur) {
        if (employeurRepository.existsByNomemployeur(employeur.getNomemployeur())) {
            throw new RuntimeException("Employeur with this name already exists");
        }
        return employeurRepository.save(employeur);
    }
    
    public List<Employeur> getAllEmployeurs() {
        return employeurRepository.findAll();
    }
    
    public Employeur getEmployeurById(Integer id) {
        return employeurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employeur not found"));
    }
    
    public Employeur updateEmployeur(Integer id, Employeur employeur) {
        Employeur existing = employeurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employeur not found"));
        
        if (!existing.getNomemployeur().equals(employeur.getNomemployeur()) && 
            employeurRepository.existsByNomemployeur(employeur.getNomemployeur())) {
            throw new RuntimeException("Employeur with this name already exists");
        }
        
        existing.setNomemployeur(employeur.getNomemployeur());
        return employeurRepository.save(existing);
    }
    
    public void deleteEmployeur(Integer id) {
        employeurRepository.deleteById(id);
    }
}
