package abh.formation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import abh.formation.model.Utilisateur;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Optional<Utilisateur> findByLogin(String login);
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findByLoginIgnoreCaseOrEmailIgnoreCase(String login, String email);
    Optional<Utilisateur> findByResetToken(String resetToken);
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);
}
