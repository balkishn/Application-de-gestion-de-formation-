package abh.formation.repository;

import abh.formation.model.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Integer> {
    boolean existsByLibelle(String libelle);
}
