package abh.formation.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "formation_notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormationNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "formation_id", nullable = false, unique = true)
    private Long formationId;

    @Column(name = "formation_titre", nullable = false)
    private String formationTitre;

    @Column(name = "formation_date_debut", nullable = false)
    private String formationDateDebut;

    @Column(name = "formation_lieu")
    private String formationLieu;

    @Column(name = "formation_duree")
    private Integer formationDuree;

    @Column(nullable = false, length = 1000)
    private String message;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}