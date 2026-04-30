package abh.formation.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "formateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formateur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    @NotBlank(message = "Nom du formateur est obligatoire")
    private String nom;
    
    @Column(nullable = false)
    @NotBlank(message = "Prénom du formateur est obligatoire")
    private String prenom;
    
    @Column(nullable = false)
    @Email(message = "Email doit être valide")
    private String email;
    
    @Column(nullable = false)
    @Digits(integer = 10, fraction = 0, message = "Téléphone doit contenir que des chiffres")
    private Long tel;
    
    @Column(nullable = false)
    @NotBlank(message = "Type de formateur est obligatoire")
    private String type; // INTERNE ou EXTERNE
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idEmployeur")
    private Employeur employeur; // Nullable for external trainers

    public static final String INTERNE = "INTERNE";
    public static final String EXTERNE = "EXTERNE";
}
