package com.mairie.declaration.controller;

import com.mairie.declaration.dto.request.DeclarationRequest;
import com.mairie.declaration.dto.request.ReviewRequest;
import com.mairie.declaration.dto.response.ApiResponse;
import com.mairie.declaration.dto.response.DeclarationResponse;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.service.DeclarationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/declarations")
@RequiredArgsConstructor
public class DeclarationController {

    private final DeclarationService declarationService;

    @PostMapping
    public ResponseEntity<ApiResponse<DeclarationResponse>> create(
            @Valid @RequestBody DeclarationRequest request,
            @AuthenticationPrincipal User citizen
    ) {
        DeclarationResponse response = declarationService.create(request, citizen);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Déclaration créée", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<DeclarationResponse>>> getMyDeclarations(
            @AuthenticationPrincipal User citizen
    ) {
        List<DeclarationResponse> declarations = declarationService.getMyDeclarations(citizen);
        return ResponseEntity.ok(ApiResponse.success(declarations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeclarationResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        DeclarationResponse response = declarationService.getById(id, user);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DeclarationResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody DeclarationRequest request,
            @AuthenticationPrincipal User citizen
    ) {
        DeclarationResponse response = declarationService.update(id, request, citizen);
        return ResponseEntity.ok(ApiResponse.success("Déclaration mise à jour", response));
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<DeclarationResponse>> submit(
            @PathVariable Long id,
            @AuthenticationPrincipal User citizen
    ) {
        DeclarationResponse response = declarationService.submit(id, citizen);
        return ResponseEntity.ok(ApiResponse.success("Déclaration soumise", response));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<DeclarationResponse>>> getPending() {
        List<DeclarationResponse> declarations = declarationService.getPendingDeclarations();
        return ResponseEntity.ok(ApiResponse.success(declarations));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<DeclarationResponse>>> getAll() {
        List<DeclarationResponse> declarations = declarationService.getAllDeclarations();
        return ResponseEntity.ok(ApiResponse.success(declarations));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<ApiResponse<DeclarationResponse>> review(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User agent
    ) {
        DeclarationResponse response = declarationService.review(id, request, agent);
        return ResponseEntity.ok(ApiResponse.success("Déclaration traitée", response));
    }
}
