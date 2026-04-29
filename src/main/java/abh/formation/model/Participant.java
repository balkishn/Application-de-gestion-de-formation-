package abh.formation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "participant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    @NotBlank(message = "Nom du participant est obligatoire")
    private String nom;
    
    @Column(nullable = false)
    @NotBlank(message = "Prénom du participant est obligatoire")
    private String prenom;
    
    @Column(nullable = false)
    @Email(message = "Email doit être valide")
    private String email;
    
    @Column(nullable = false)
    @Digits(integer = 10, fraction = 0, message = "Téléphone doit contenir que des chiffres")
    private Long tel;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idStructure", nullable = false)
    private Structure structure;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idProfil", nullable = false)
    private Profil profil;
}
