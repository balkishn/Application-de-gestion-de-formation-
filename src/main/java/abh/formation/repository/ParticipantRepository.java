package abh.formation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import abh.formation.model.Participant;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    List<Participant> findByStructureId(Integer structureId);
    List<Participant> findByProfilId(Integer profilId);

    @Query("SELECT p.structure.libelle, COUNT(p) FROM Participant p GROUP BY p.structure.libelle ORDER BY p.structure.libelle")
    List<Object[]> countParticipantsByStructure();

    @Query("SELECT p.profil.libelle, COUNT(p) FROM Participant p GROUP BY p.profil.libelle ORDER BY p.profil.libelle")
    List<Object[]> countParticipantsByProfil();
}
