package abh.formation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import abh.formation.dto.ApiResponse;
import abh.formation.dto.FormationNotificationDTO;
import abh.formation.service.FormationNotificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {

    private final FormationNotificationService notificationService;

    @GetMapping("/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<FormationNotificationDTO>>> getRecentNotifications() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getRecentNotifications()));
    }
}