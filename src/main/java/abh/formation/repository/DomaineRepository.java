package abh.formation.repository;

import abh.formation.model.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DomaineRepository extends JpaRepository<Domaine, Integer> {
    boolean existsByLibelle(String libelle);
}
