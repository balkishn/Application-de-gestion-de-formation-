package abh.formation.repository;

import abh.formation.model.Employeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeurRepository extends JpaRepository<Employeur, Integer> {
    boolean existsByNomemployeur(String nomemployeur);
}
