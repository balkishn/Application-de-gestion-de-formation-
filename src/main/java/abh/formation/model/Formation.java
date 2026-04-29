package abh.formation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "formation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Titre de la formation est obligatoire")
    private String titre;
    
    @Column(nullable = false)
    @Min(value = 1, message = "Durée doit être au moins 1 jour")
    private Integer duree; // en jours
    
    @Column(nullable = false)
    @DecimalMin(value = "0.0", inclusive = false, message = "Budget doit être supérieur à 0")
    private Double budget;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idDomaine", nullable = false)
    private Domaine domaine;
    
    @Column(name = "lieu")
    private String lieu;
    
    @Column(name = "date_debut")
    private String dateDebut; // Format: YYYY-MM-DD
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idFormateur", nullable = false)
    private Formateur formateur;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "formation_participant",
        joinColumns = @JoinColumn(name = "idFormation"),
        inverseJoinColumns = @JoinColumn(name = "idParticipant")
    )
    private List<Participant> participants;
}
