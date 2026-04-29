package abh.formation.repository;

import abh.formation.model.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StructureRepository extends JpaRepository<Structure, Integer> {
    boolean existsByLibelle(String libelle);
}
