/**package abh.formation.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import abh.formation.dto.CreateUtilisateurRequest;
import abh.formation.dto.DomaineDTO;
import abh.formation.dto.FormateurDTO;
import abh.formation.dto.FormationDTO;
import abh.formation.dto.LoginRequest;
import abh.formation.dto.ParticipantDTO;
import abh.formation.model.Domaine;
import abh.formation.model.Employeur;
import abh.formation.model.Formateur;
import abh.formation.model.Participant;
import abh.formation.model.Profil;
import abh.formation.model.Role;
import abh.formation.model.Structure;
import abh.formation.model.Utilisateur;
import abh.formation.repository.DomaineRepository;
import abh.formation.repository.EmployeurRepository;
import abh.formation.repository.FormateurRepository;
import abh.formation.repository.FormationRepository;
import abh.formation.repository.ParticipantRepository;
import abh.formation.repository.ProfilRepository;
import abh.formation.repository.RoleRepository;
import abh.formation.repository.StructureRepository;
import abh.formation.repository.UtilisateurRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DisplayName("Controller integration tests")
class ControllerIntegrationTests {

    @LocalServerPort
    private int port;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DomaineRepository domaineRepository;

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private EmployeurRepository employeurRepository;

    @Autowired
    private StructureRepository structureRepository;

    @Autowired
    private ProfilRepository profilRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;
    private String responsableToken;
    private String simpleToken;

    @BeforeEach
    void setUp() throws Exception {
        cleanup();
        seedUsersAndRoles();
        seedReferenceData();
    }

    private void cleanup() {
        formationRepository.deleteAll();
        participantRepository.deleteAll();
        utilisateurRepository.deleteAll();
        formateurRepository.deleteAll();
        domaineRepository.deleteAll();
        employeurRepository.deleteAll();
        structureRepository.deleteAll();
        profilRepository.deleteAll();
        roleRepository.deleteAll();
    }

    private void seedUsersAndRoles() throws Exception {
        Role adminRole = roleRepository.save(Role.builder().nom("ADMINISTRATEUR").build());
        Role responsableRole = roleRepository.save(Role.builder().nom("RESPONSABLE").build());
        Role simpleRole = roleRepository.save(Role.builder().nom("SIMPLE_UTILISATEUR").build());

        utilisateurRepository.save(Utilisateur.builder()
                .login("admin_test")
                .password(passwordEncoder.encode("password123"))
                .role(adminRole)
            .isActive(true)
                .build());

        utilisateurRepository.save(Utilisateur.builder()
                .login("resp_test")
                .password(passwordEncoder.encode("password123"))
                .role(responsableRole)
            .isActive(true)
                .build());

        utilisateurRepository.save(Utilisateur.builder()
                .login("simple_test")
                .password(passwordEncoder.encode("password123"))
                .role(simpleRole)
            .isActive(true)
                .build());

        adminToken = loginAndGetToken("admin_test", "password123");
        responsableToken = loginAndGetToken("resp_test", "password123");
        simpleToken = loginAndGetToken("simple_test", "password123");
    }

    private void seedReferenceData() {
        domaineRepository.save(Domaine.builder().libelle("Informatique").build());
        employeurRepository.save(Employeur.builder().nomemployeur("Green Building").build());
        structureRepository.save(Structure.builder().libelle("Direction Centrale").build());
        profilRepository.save(Profil.builder().libelle("Gestionnaire").build());
    }

    private String baseUrl(String path) {
        return "http://localhost:" + port + path;
    }

    private String loginAndGetToken(String login, String password) throws Exception {
        LoginRequest request = new LoginRequest(login, password);
        HttpResponse<String> response = send("POST", "/auth/login", request, null);
        assertEquals(HttpStatus.OK.value(), response.statusCode());

        JsonNode root = objectMapper.readTree(response.body());
        String token = root.path("data").path("token").asText();
        assertTrue(token != null && !token.isBlank());
        return token;
    }

    private HttpResponse<String> send(String method, String path, Object body, String token) throws Exception {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl(path)))
                .header("Content-Type", "application/json");

        if (token != null && !token.isBlank()) {
            builder.header("Authorization", "Bearer " + token);
        }

        if ("POST".equals(method) || "PUT".equals(method)) {
            String payload = body == null ? "{}" : objectMapper.writeValueAsString(body);
            builder.method(method, HttpRequest.BodyPublishers.ofString(payload));
        } else {
            builder.method(method, HttpRequest.BodyPublishers.noBody());
        }

        return httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
    }

    private Formateur createFormateur() {
        Employeur employeur = employeurRepository.findAll().get(0);
        return formateurRepository.save(Formateur.builder()
                .nom("Dupont")
                .prenom("Marc")
                .email("marc@example.com")
                .tel(1234567890L)
                .type("interne")
                .employeur(employeur)
                .build());
    }

    private Participant createParticipant(String nom, String prenom, String email) {
        Structure structure = structureRepository.findAll().get(0);
        Profil profil = profilRepository.findAll().get(0);
        return participantRepository.save(Participant.builder()
                .nom(nom)
                .prenom(prenom)
                .email(email)
                .tel(777777777L)
                .structure(structure)
                .profil(profil)
                .build());
    }

    @Test
    void login_success_returns_token() {
        assertNotNull(adminToken);
        assertNotNull(responsableToken);
        assertNotNull(simpleToken);
    }

    @Test
    void login_invalid_credentials_returns_401() {
        HttpResponse<String> response;
        try {
            response = send("POST", "/auth/login", new LoginRequest("admin_test", "wrong"), null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.statusCode());
    }

    @Test
    void admin_can_create_user() {
        Integer simpleRoleId = roleRepository.findByNom("SIMPLE_UTILISATEUR").orElseThrow().getId();
        CreateUtilisateurRequest request = CreateUtilisateurRequest.builder()
                .login("created_by_admin")
                .password("pass123")
                .roleId(simpleRoleId)
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/utilisateurs", request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void responsable_cannot_create_admin_user() {
        Integer adminRoleId = roleRepository.findByNom("ADMINISTRATEUR").orElseThrow().getId();
        CreateUtilisateurRequest request = CreateUtilisateurRequest.builder()
                .login("illegal_admin")
                .password("pass123")
                .roleId(adminRoleId)
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/utilisateurs", request, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.statusCode());
    }

    @Test
    void simple_user_cannot_create_user() {
        Integer simpleRoleId = roleRepository.findByNom("SIMPLE_UTILISATEUR").orElseThrow().getId();
        CreateUtilisateurRequest request = CreateUtilisateurRequest.builder()
                .login("illegal_simple_create")
                .password("pass123")
                .roleId(simpleRoleId)
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/utilisateurs", request, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.statusCode());
    }

    @Test
    void simple_user_can_create_formation() {
        Domaine domaine = domaineRepository.findAll().get(0);
        Formateur formateur = createFormateur();

        FormationDTO request = FormationDTO.builder()
                .titre("Spring Formation")
                .duree(3)
                .budget(1000.0)
                .domaineId(domaine.getId())
                .formateurId(formateur.getId())
                .lieu("Salle A")
                .dateDebut("2026-05-01")
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/formations", request, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void responsable_can_create_formation() {
        Domaine domaine = domaineRepository.findAll().get(0);
        Formateur formateur = createFormateur();

        FormationDTO request = FormationDTO.builder()
                .titre("Denied Formation")
                .duree(2)
                .budget(500.0)
                .domaineId(domaine.getId())
                .formateurId(formateur.getId())
                .lieu("Salle B")
                .dateDebut("2026-05-02")
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/formations", request, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void formation_can_be_created_and_updated_with_participants() throws Exception {
        Domaine domaine = domaineRepository.findAll().get(0);
        Formateur formateur = createFormateur();
        Participant participantOne = createParticipant("Lina", "Benali", "lina@example.com");
        Participant participantTwo = createParticipant("Omar", "Khalil", "omar@example.com");

        FormationDTO createRequest = FormationDTO.builder()
                .titre("Formation Partagée")
                .duree(4)
                .budget(1200.0)
                .domaineId(domaine.getId())
                .formateurId(formateur.getId())
                .lieu("Salle C")
                .dateDebut("2026-06-10")
                .participantIds(List.of(participantOne.getId()))
                .build();

        HttpResponse<String> createResponse = send("POST", "/formations", createRequest, adminToken);
        assertEquals(HttpStatus.CREATED.value(), createResponse.statusCode());

        JsonNode createdRoot = objectMapper.readTree(createResponse.body());
        JsonNode createdData = createdRoot.path("data");
        Long formationId = createdData.path("id").asLong();
        assertEquals(1, createdData.path("participantCount").asInt());
        assertEquals(participantOne.getId().intValue(), createdData.path("participantIds").get(0).asInt());

        FormationDTO updateRequest = FormationDTO.builder()
                .titre("Formation Partagée Mise à Jour")
                .duree(5)
                .budget(1400.0)
                .domaineId(domaine.getId())
                .formateurId(formateur.getId())
                .lieu("Salle D")
                .dateDebut("2026-06-11")
                .participantIds(List.of(participantOne.getId(), participantTwo.getId()))
                .build();

        HttpResponse<String> updateResponse = send("PUT", "/formations/" + formationId, updateRequest, adminToken);
        assertEquals(HttpStatus.OK.value(), updateResponse.statusCode());

        JsonNode updatedRoot = objectMapper.readTree(updateResponse.body());
        JsonNode updatedData = updatedRoot.path("data");
        assertEquals(2, updatedData.path("participantCount").asInt());
        assertEquals(2, updatedData.path("participantIds").size());
    }

    @Test
    void responsable_can_create_participant() {
        Structure structure = structureRepository.findAll().get(0);
        Profil profil = profilRepository.findAll().get(0);

        ParticipantDTO request = ParticipantDTO.builder()
                .nom("Resp")
                .prenom("Participant")
                .email("resp.participant@example.com")
                .tel(777777777L)
                .structureId(structure.getId())
                .profilId(profil.getId())
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/participants", request, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void unauthenticated_access_to_formations_returns_401() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/formations", null, null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.statusCode());
    }

    @Test
    void simple_user_can_create_participant() {
        Structure structure = structureRepository.findAll().get(0);
        Profil profil = profilRepository.findAll().get(0);

        ParticipantDTO request = ParticipantDTO.builder()
                .nom("Ali")
                .prenom("Karim")
                .email("ali@example.com")
                .tel(555555555L)
                .structureId(structure.getId())
                .profilId(profil.getId())
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/participants", request, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void responsable_can_access_statistics() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/statistiques/overview", null, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void simple_user_cannot_access_statistics() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/statistiques/overview", null, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.statusCode());
    }

    @Test
    void admin_can_create_structure() {
        Structure request = Structure.builder()
                .libelle("Direction Regionale Ouest")
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/structures", request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void admin_can_get_all_structures() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/structures", null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void simple_user_cannot_create_structure() {
        Structure request = Structure.builder()
                .libelle("Direction Interdite Simple")
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/structures", request, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.statusCode());
    }

    @Test
    void responsable_can_get_structures() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/structures", null, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_update_structure() {
        Structure created = structureRepository.save(Structure.builder().libelle("Structure Temp").build());
        Structure request = Structure.builder().libelle("Structure Temp Updated").build();

        HttpResponse<String> response;
        try {
            response = send("PUT", "/structures/" + created.getId(), request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_delete_structure() {
        Structure created = structureRepository.save(Structure.builder().libelle("Structure To Delete").build());

        HttpResponse<String> response;
        try {
            response = send("DELETE", "/structures/" + created.getId(), null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_get_unknown_structure_returns_404() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/structures/999999", null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.NOT_FOUND.value(), response.statusCode());
    }

    @Test
    void admin_can_get_domaines() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/domaines", null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void simple_user_cannot_get_domaines() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/domaines", null, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.statusCode());
    }

    @Test
    void responsable_can_get_employeurs() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/employeurs", null, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_create_domaine() {
        DomaineDTO request = DomaineDTO.builder().libelle("Mecanique").build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/domaines", request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void admin_can_update_domaine() {
        Domaine created = domaineRepository.save(Domaine.builder().libelle("Temp Domaine").build());
        DomaineDTO request = DomaineDTO.builder().libelle("Temp Domaine Updated").build();

        HttpResponse<String> response;
        try {
            response = send("PUT", "/domaines/" + created.getId(), request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_delete_domaine() {
        Domaine created = domaineRepository.save(Domaine.builder().libelle("Delete Domaine").build());

        HttpResponse<String> response;
        try {
            response = send("DELETE", "/domaines/" + created.getId(), null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_get_unknown_domaine_returns_404() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/domaines/999999", null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.NOT_FOUND.value(), response.statusCode());
    }

    @Test
    void admin_can_create_profil() {
        Profil request = Profil.builder().libelle("Technicien Superieur").build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/profils", request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void admin_can_update_profil() {
        Profil created = profilRepository.save(Profil.builder().libelle("Profil Temp").build());
        Profil request = Profil.builder().libelle("Profil Temp Updated").build();

        HttpResponse<String> response;
        try {
            response = send("PUT", "/profils/" + created.getId(), request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_delete_profil() {
        Profil created = profilRepository.save(Profil.builder().libelle("Delete Profil").build());

        HttpResponse<String> response;
        try {
            response = send("DELETE", "/profils/" + created.getId(), null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_get_unknown_profil_returns_404() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/profils/999999", null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.NOT_FOUND.value(), response.statusCode());
    }

    @Test
    void simple_user_can_get_profils() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/profils", null, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_create_employeur() {
        Employeur request = Employeur.builder().nomemployeur("Employeur Test").build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/employeurs", request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void simple_user_can_create_employeur() {
        Employeur request = Employeur.builder().nomemployeur("Employeur Simple").build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/employeurs", request, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void admin_can_update_employeur() {
        Employeur created = employeurRepository.save(Employeur.builder().nomemployeur("Employeur Temp").build());
        Employeur request = Employeur.builder().nomemployeur("Employeur Temp Updated").build();

        HttpResponse<String> response;
        try {
            response = send("PUT", "/employeurs/" + created.getId(), request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void responsable_can_update_employeur() {
        Employeur created = employeurRepository.save(Employeur.builder().nomemployeur("Employeur Resp Temp").build());
        Employeur request = Employeur.builder().nomemployeur("Employeur Resp Updated").build();

        HttpResponse<String> response;
        try {
            response = send("PUT", "/employeurs/" + created.getId(), request, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_delete_employeur() {
        Employeur created = employeurRepository.save(Employeur.builder().nomemployeur("Employeur Delete").build());

        HttpResponse<String> response;
        try {
            response = send("DELETE", "/employeurs/" + created.getId(), null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void simple_user_can_delete_employeur() {
        Employeur created = employeurRepository.save(Employeur.builder().nomemployeur("Employeur Delete Simple").build());

        HttpResponse<String> response;
        try {
            response = send("DELETE", "/employeurs/" + created.getId(), null, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_get_unknown_employeur_returns_404() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/employeurs/999999", null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.NOT_FOUND.value(), response.statusCode());
    }

    @Test
    void simple_user_can_create_formateur() {
        Integer employeurId = employeurRepository.findAll().get(0).getId();
        FormateurDTO request = FormateurDTO.builder()
                .nom("Formateur")
                .prenom("Simple")
                .email("formateur.simple@example.com")
                .tel(1111111111L)
                .type("INTERNE")
                .employeurId(employeurId)
                .build();

        HttpResponse<String> response;
        try {
            response = send("POST", "/formateurs", request, simpleToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.CREATED.value(), response.statusCode());
    }

    @Test
    void admin_can_update_formateur() {
        Employeur employeur = employeurRepository.findAll().get(0);
        Formateur created = formateurRepository.save(Formateur.builder()
                .nom("Formateur")
                .prenom("Temp")
                .email("formateur.temp@example.com")
                .tel(2222222222L)
                .type("INTERNE")
                .employeur(employeur)
                .build());

        FormateurDTO request = FormateurDTO.builder()
                .nom("Formateur")
                .prenom("Updated")
                .email("formateur.updated@example.com")
                .tel(3333333333L)
                .type("INTERNE")
                .employeurId(employeur.getId())
                .build();

        HttpResponse<String> response;
        try {
            response = send("PUT", "/formateurs/" + created.getId(), request, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void admin_can_delete_formateur() {
        Employeur employeur = employeurRepository.findAll().get(0);
        Formateur created = formateurRepository.save(Formateur.builder()
                .nom("Formateur")
                .prenom("Delete")
                .email("formateur.delete@example.com")
                .tel(4444444444L)
                .type("INTERNE")
                .employeur(employeur)
                .build());

        HttpResponse<String> response;
        try {
            response = send("DELETE", "/formateurs/" + created.getId(), null, adminToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }

    @Test
    void responsable_can_get_formateurs() {
        HttpResponse<String> response;
        try {
            response = send("GET", "/formateurs", null, responsableToken);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        assertEquals(HttpStatus.OK.value(), response.statusCode());
    }
}
**/