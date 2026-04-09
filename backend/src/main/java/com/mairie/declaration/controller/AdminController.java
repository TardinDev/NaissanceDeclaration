package com.mairie.declaration.controller;

import com.mairie.declaration.dto.response.ApiResponse;
import com.mairie.declaration.dto.response.StatsResponse;
import com.mairie.declaration.dto.response.UserResponse;
import com.mairie.declaration.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String role = body.get("role");
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Le rôle est obligatoire");
        }
        UserResponse response = userService.updateRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("Rôle mis à jour", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats() {
        StatsResponse stats = userService.getStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
