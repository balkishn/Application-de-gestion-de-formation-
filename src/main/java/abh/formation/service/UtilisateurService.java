package abh.formation.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import abh.formation.dto.CompleteFirstLoginRequest;
import abh.formation.dto.ForgotPasswordRequest;
import abh.formation.dto.LoginRequest;
import abh.formation.dto.LoginResponse;
import abh.formation.dto.ResetPasswordRequest;
import abh.formation.dto.RoleDTO;
import abh.formation.dto.UtilisateurDTO;
import abh.formation.model.Role;
import abh.formation.model.Utilisateur;
import abh.formation.repository.RoleRepository;
import abh.formation.repository.UtilisateurRepository;
import abh.formation.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UtilisateurService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    
    public LoginResponse login(LoginRequest loginRequest) {
        String identifier = normalizeIdentifier(loginRequest.getIdentifier());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                identifier,
                loginRequest.getPassword()
            )
        );
        
        Utilisateur utilisateur = findByIdentifier(identifier)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.TRUE.equals(utilisateur.getMustChangePassword())) {
            return LoginResponse.builder()
                .token(null)
                .username(utilisateur.getLogin())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().getNom())
                .userId(utilisateur.getId())
                .mustChangePassword(true)
                .build();
        }
        
        String token = jwtUtils.generateJwtToken(authentication);
        
        return LoginResponse.builder()
            .token(token)
            .username(utilisateur.getLogin())
            .email(utilisateur.getEmail())
            .role(utilisateur.getRole().getNom())
            .userId(utilisateur.getId())
            .mustChangePassword(false)
            .build();
    }
    
    public UtilisateurDTO createUtilisateur(String email, Integer roleId) {
        Utilisateur current = getCurrentAuthenticatedUser();
        if (!isAdmin(current) && !isResponsable(current)) {
            throw new IllegalArgumentException("Only admin or responsable can create users");
        }

        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email est obligatoire");
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (utilisateurRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RuntimeException("Role not found"));

        if (isResponsable(current) && !Role.USER.equals(role.getNom())) {
            throw new IllegalArgumentException("Responsable can only create simple users");
        }

        String temporaryPassword = generateTemporaryPassword();

        Utilisateur utilisateur = Utilisateur.builder()
            .login(null)
            .email(normalizedEmail)
            .password(passwordEncoder.encode(temporaryPassword))
            .role(role)
            .isActive(true)
            .mustChangePassword(true)
            .build();

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        emailService.sendInvitationEmail(normalizedEmail, temporaryPassword);
        return convertToDTO(saved);
    }
    
    private Utilisateur createUtilisateurEntity(String login, String password, Integer roleId) {
        if (utilisateurRepository.existsByLogin(login)) {
            throw new RuntimeException("Login already exists");
        }
        
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        
        Utilisateur utilisateur = Utilisateur.builder()
            .login(login)
            .password(passwordEncoder.encode(password))
            .role(role)
            .isActive(true)
            .build();
        
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur createFirstAdmin(String login, String password) {
        if (utilisateurRepository.count() > 0) {
            throw new RuntimeException("Admin registration is only available when no users exist.");
        }

        Role adminRole = roleRepository.findByNom(Role.ADMIN)
            .orElseGet(() -> roleRepository.save(Role.builder().nom(Role.ADMIN).build()));

        seedDefaultRoles();

        return createUtilisateurEntity(login, password, adminRole.getId());
    }

    public LoginResponse completeFirstLogin(CompleteFirstLoginRequest request) {
        String identifier = normalizeIdentifier(request.getIdentifier());

        if (!StringUtils.hasText(request.getLogin())) {
            throw new IllegalArgumentException("Le login est obligatoire");
        }

        if (!StringUtils.hasText(request.getNewPassword())) {
            throw new IllegalArgumentException("Le nouveau mot de passe est obligatoire");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }

        if (utilisateurRepository.existsByLogin(request.getLogin().trim())) {
            throw new IllegalArgumentException("Login already exists");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(identifier, request.getCurrentPassword())
        );

        Utilisateur utilisateur = findByIdentifier(identifier)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!Boolean.TRUE.equals(utilisateur.getMustChangePassword())) {
            throw new IllegalArgumentException("Ce compte a deja finalise sa premiere connexion");
        }

        utilisateur.setLogin(request.getLogin().trim());
        utilisateur.setPassword(passwordEncoder.encode(request.getNewPassword()));
        utilisateur.setMustChangePassword(false);
        utilisateurRepository.save(utilisateur);

        String roleAuthority = "ROLE_" + utilisateur.getRole().getNom().toUpperCase().replace(" ", "_");
        String token = jwtUtils.generateTokenFromUsername(utilisateur.getLogin(), roleAuthority);

        return LoginResponse.builder()
            .token(token)
            .username(utilisateur.getLogin())
            .email(utilisateur.getEmail())
            .role(utilisateur.getRole().getNom())
            .userId(utilisateur.getId())
            .mustChangePassword(false)
            .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (request == null || !StringUtils.hasText(request.getEmail())) {
            return;
        }

        String email = request.getEmail().trim().toLowerCase();
        utilisateurRepository.findByEmail(email).ifPresent(utilisateur -> {
            String token = UUID.randomUUID().toString();
            utilisateur.setResetToken(token);
            utilisateur.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(15));
            utilisateurRepository.save(utilisateur);
            emailService.sendResetPasswordEmail(email, token);
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (request == null || !StringUtils.hasText(request.getToken())) {
            throw new IllegalArgumentException("Token invalide");
        }

        if (!StringUtils.hasText(request.getNewPassword())) {
            throw new IllegalArgumentException("Le nouveau mot de passe est obligatoire");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }

        Utilisateur utilisateur = utilisateurRepository.findByResetToken(request.getToken())
            .orElseThrow(() -> new IllegalArgumentException("Token invalide ou expire"));

        if (utilisateur.getResetTokenExpiresAt() == null || utilisateur.getResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token invalide ou expire");
        }

        utilisateur.setPassword(passwordEncoder.encode(request.getNewPassword()));
        utilisateur.setResetToken(null);
        utilisateur.setResetTokenExpiresAt(null);
        utilisateurRepository.save(utilisateur);
    }

    private void seedDefaultRoles() {
        if (roleRepository.findByNom(Role.MANAGER).isEmpty()) {
            roleRepository.save(Role.builder().nom(Role.MANAGER).build());
        }
        if (roleRepository.findByNom(Role.USER).isEmpty()) {
            roleRepository.save(Role.builder().nom(Role.USER).build());
        }
    }
    
    public List<UtilisateurDTO> getAllUtilisateurs() {
        Utilisateur current = getCurrentAuthenticatedUser();
        if (isAdmin(current)) {
            return utilisateurRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        }

        if (isResponsable(current)) {
            return utilisateurRepository.findAll().stream()
                .filter(u -> isSimpleUser(u) || u.getId().equals(current.getId()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        }

        return List.of(convertToDTO(current));
    }

    public List<RoleDTO> getAvailableRoles() {
        Utilisateur current = getCurrentAuthenticatedUser();

        if (isAdmin(current)) {
            return roleRepository.findAll().stream()
                .map(role -> RoleDTO.builder()
                    .id(role.getId())
                    .nom(role.getNom())
                    .build())
                .collect(Collectors.toList());
        }

        if (isResponsable(current)) {
            return roleRepository.findByNom(Role.USER)
                .map(role -> List.of(RoleDTO.builder()
                    .id(role.getId())
                    .nom(role.getNom())
                    .build()))
                .orElse(List.of());
        }

        return List.of();
    }
    
    public UtilisateurDTO getUtilisateurById(Integer id) {
        Utilisateur current = getCurrentAuthenticatedUser();
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (isAdmin(current)) {
            return convertToDTO(utilisateur);
        }

        if (isResponsable(current) && (utilisateur.getId().equals(current.getId()) || isSimpleUser(utilisateur))) {
            return convertToDTO(utilisateur);
        }

        if (isSimpleUser(current) && utilisateur.getId().equals(current.getId())) {
            return convertToDTO(utilisateur);
        }

        throw new IllegalArgumentException("Unauthorized to view this user");
    }
    
    public UtilisateurDTO updateUtilisateur(Integer id, String login, String email) {
        Utilisateur current = getCurrentAuthenticatedUser();
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!canModify(current, utilisateur)) {
            throw new IllegalArgumentException("Unauthorized to modify this user");
        }
        
        if (StringUtils.hasText(login)
            && (utilisateur.getLogin() == null || !utilisateur.getLogin().equals(login.trim()))
            && utilisateurRepository.existsByLogin(login.trim())) {
            throw new RuntimeException("Login already exists");
        }

        if (StringUtils.hasText(email)
            && (utilisateur.getEmail() == null || !utilisateur.getEmail().equalsIgnoreCase(email.trim()))
            && utilisateurRepository.existsByEmail(email.trim().toLowerCase())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (StringUtils.hasText(login)) {
            utilisateur.setLogin(login.trim());
        }
        if (StringUtils.hasText(email)) {
            utilisateur.setEmail(email.trim().toLowerCase());
        }
        Utilisateur updated = utilisateurRepository.save(utilisateur);
        return convertToDTO(updated);
    }
    
    public void deleteUtilisateur(Integer id) {
        Utilisateur current = getCurrentAuthenticatedUser();
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (isAdmin(current)) {
            utilisateurRepository.delete(utilisateur);
            return;
        }

        if (isResponsable(current) && isSimpleUser(utilisateur)) {
            utilisateurRepository.delete(utilisateur);
            return;
        }

        throw new IllegalArgumentException("Unauthorized to delete this user");
    }
    
    private UtilisateurDTO convertToDTO(Utilisateur utilisateur) {
        return UtilisateurDTO.builder()
            .id(utilisateur.getId())
            .email(utilisateur.getEmail())
            .login(utilisateur.getLogin())
            .roleName(utilisateur.getRole().getNom())
            .isActive(utilisateur.getIsActive())
            .mustChangePassword(utilisateur.getMustChangePassword())
            .build();
    }

    private Utilisateur getCurrentAuthenticatedUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Current user is not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Utilisateur utilisateur) {
            return utilisateur;
        }

        if (principal instanceof String username) {
            return findByIdentifier(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        }

        throw new RuntimeException("Current user is not authenticated");
    }

    private boolean isAdmin(Utilisateur utilisateur) {
        return Role.ADMIN.equals(utilisateur.getRole().getNom());
    }

    private boolean isResponsable(Utilisateur utilisateur) {
        return Role.MANAGER.equals(utilisateur.getRole().getNom());
    }

    private boolean isSimpleUser(Utilisateur utilisateur) {
        return Role.USER.equals(utilisateur.getRole().getNom());
    }

    private boolean canModify(Utilisateur current, Utilisateur target) {
        if (isAdmin(current)) {
            return true;
        }

        if (isResponsable(current)) {
            return target.getId().equals(current.getId()) || isSimpleUser(target);
        }

        return isSimpleUser(current) && target.getId().equals(current.getId());
    }

    private String normalizeIdentifier(String identifier) {
        if (!StringUtils.hasText(identifier)) {
            throw new IllegalArgumentException("Identifier is required");
        }
        return identifier.trim();
    }

    private java.util.Optional<Utilisateur> findByIdentifier(String identifier) {
        String normalized = identifier.trim();
        return utilisateurRepository.findByLoginIgnoreCaseOrEmailIgnoreCase(normalized, normalized);
    }

    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12) + "A1!";
    }
}
