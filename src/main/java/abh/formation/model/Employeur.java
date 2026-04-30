package abh.formation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "employeur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employeur {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Nom de l'employeur est obligatoire")
    private String nomemployeur;
}
