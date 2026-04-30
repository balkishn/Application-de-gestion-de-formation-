package abh.formation.service;

import abh.formation.model.Profil;
import abh.formation.repository.ProfilRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProfilService {
    
    private final ProfilRepository profilRepository;
    
    public Profil createProfil(Profil profil) {
        if (profilRepository.existsByLibelle(profil.getLibelle())) {
            throw new RuntimeException("Profil with this name already exists");
        }
        return profilRepository.save(profil);
    }
    
    public List<Profil> getAllProfils() {
        return profilRepository.findAll();
    }
    
    public Profil getProfilById(Integer id) {
        return profilRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil not found"));
    }
    
    public Profil updateProfil(Integer id, Profil profil) {
        Profil existing = profilRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil not found"));
        
        if (!existing.getLibelle().equals(profil.getLibelle()) && 
            profilRepository.existsByLibelle(profil.getLibelle())) {
            throw new RuntimeException("Profil with this name already exists");
        }
        
        existing.setLibelle(profil.getLibelle());
        return profilRepository.save(existing);
    }
    
    public void deleteProfil(Integer id) {
        profilRepository.deleteById(id);
    }
}
