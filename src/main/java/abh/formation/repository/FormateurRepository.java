package abh.formation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import abh.formation.model.Formateur;

@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Integer> {
    List<Formateur> findByType(String type);
    List<Formateur> findByEmployeurId(Integer employeurId);

    @Query("SELECT f.type, COUNT(f) FROM Formateur f GROUP BY f.type ORDER BY f.type")
    List<Object[]> countFormateursByType();
}
