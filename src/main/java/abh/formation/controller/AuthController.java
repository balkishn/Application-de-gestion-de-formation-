package abh.formation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import abh.formation.dto.AdminRegistrationRequest;
import abh.formation.dto.ApiResponse;
import abh.formation.dto.CompleteFirstLoginRequest;
import abh.formation.dto.ForgotPasswordRequest;
import abh.formation.dto.LoginRequest;
import abh.formation.dto.LoginResponse;
import abh.formation.dto.ResetPasswordRequest;
import abh.formation.service.UtilisateurService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class AuthController {
    
    private final UtilisateurService utilisateurService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = utilisateurService.login(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/complete-first-login")
    public ResponseEntity<ApiResponse<LoginResponse>> completeFirstLogin(@RequestBody CompleteFirstLoginRequest request) {
        try {
            LoginResponse response = utilisateurService.completeFirstLogin(request);
            return ResponseEntity.ok(ApiResponse.success("First login completed", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        utilisateurService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("If the account exists, a reset email has been sent", "OK"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            utilisateurService.resetPassword(request);
            return ResponseEntity.ok(ApiResponse.success("Password reset successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register-admin")
    public ResponseEntity<ApiResponse<String>> registerAdmin(@RequestBody AdminRegistrationRequest request) {
        try {
            utilisateurService.createFirstAdmin(request.getLogin(), request.getPassword());
            return ResponseEntity.ok(ApiResponse.success("Admin user created successfully", request.getLogin()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<String>> validateToken() {
        return ResponseEntity.ok(ApiResponse.success("Token is valid"));
    }
}
