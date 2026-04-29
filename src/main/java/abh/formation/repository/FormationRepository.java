package abh.formation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import abh.formation.model.Formation;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByDomaineId(Integer domaineId);
    List<Formation> findByDateDebutStartingWith(String anneePrefix);
    List<Formation> findByFormateurId(Integer formateurId);

    @Query("SELECT COALESCE(SUM(f.budget), 0) FROM Formation f")
    Double getTotalBudget();

    @Query("SELECT f.domaine.libelle, COUNT(f) FROM Formation f GROUP BY f.domaine.libelle ORDER BY f.domaine.libelle")
    List<Object[]> countFormationsByDomaine();

    @Query("SELECT SUBSTRING(f.dateDebut, 1, 4), COUNT(f) FROM Formation f WHERE f.dateDebut IS NOT NULL AND LENGTH(f.dateDebut) >= 4 GROUP BY SUBSTRING(f.dateDebut, 1, 4) ORDER BY SUBSTRING(f.dateDebut, 1, 4)")
    List<Object[]> countFormationsByAnnee();
}
