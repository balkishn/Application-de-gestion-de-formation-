package abh.formation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true)
    private String nom;
    
    public static final String ADMIN = "ADMINISTRATEUR";
    public static final String MANAGER = "RESPONSABLE";
    public static final String USER = "SIMPLE UTILISATEUR";
}
