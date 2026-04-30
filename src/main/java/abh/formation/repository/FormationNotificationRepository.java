package abh.formation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import abh.formation.model.FormationNotification;

@Repository
public interface FormationNotificationRepository extends JpaRepository<FormationNotification, Long> {
    boolean existsByFormationId(Long formationId);

    Optional<FormationNotification> findByFormationId(Long formationId);

    List<FormationNotification> findAllByOrderByCreatedAtDesc();
}