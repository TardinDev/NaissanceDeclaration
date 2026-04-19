package com.mairie.declaration.controller;

import com.mairie.declaration.dto.request.DeclarationRequest;
import com.mairie.declaration.dto.request.ReviewRequest;
import com.mairie.declaration.dto.response.ApiResponse;
import com.mairie.declaration.dto.response.DeclarationResponse;
import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.service.BirthCertificatePdfService;
import com.mairie.declaration.service.DeclarationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/declarations")
@RequiredArgsConstructor
@Tag(name = "Déclarations", description = "Gestion des déclarations de naissance")
@SecurityRequirement(name = "bearerAuth")
public class DeclarationController {

    private final DeclarationService declarationService;
    private final BirthCertificatePdfService pdfService;

    @PostMapping
    @Operation(summary = "Créer une déclaration (citoyen)")
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
    @Operation(summary = "Lister mes déclarations")
    public ResponseEntity<ApiResponse<List<DeclarationResponse>>> getMyDeclarations(
            @AuthenticationPrincipal User citizen
    ) {
        List<DeclarationResponse> declarations = declarationService.getMyDeclarations(citizen);
        return ResponseEntity.ok(ApiResponse.success(declarations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une déclaration")
    public ResponseEntity<ApiResponse<DeclarationResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        DeclarationResponse response = declarationService.getById(id, user);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un brouillon")
    public ResponseEntity<ApiResponse<DeclarationResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody DeclarationRequest request,
            @AuthenticationPrincipal User citizen
    ) {
        DeclarationResponse response = declarationService.update(id, request, citizen);
        return ResponseEntity.ok(ApiResponse.success("Déclaration mise à jour", response));
    }

    @PatchMapping("/{id}/submit")
    @Operation(summary = "Soumettre une déclaration")
    public ResponseEntity<ApiResponse<DeclarationResponse>> submit(
            @PathVariable Long id,
            @AuthenticationPrincipal User citizen
    ) {
        DeclarationResponse response = declarationService.submit(id, citizen);
        return ResponseEntity.ok(ApiResponse.success("Déclaration soumise", response));
    }

    @GetMapping("/pending")
    @Operation(summary = "Déclarations à traiter (agent)")
    public ResponseEntity<ApiResponse<List<DeclarationResponse>>> getPending() {
        List<DeclarationResponse> declarations = declarationService.getPendingDeclarations();
        return ResponseEntity.ok(ApiResponse.success(declarations));
    }

    @GetMapping("/all")
    @Operation(summary = "Toutes les déclarations (admin)")
    public ResponseEntity<ApiResponse<List<DeclarationResponse>>> getAll() {
        List<DeclarationResponse> declarations = declarationService.getAllDeclarations();
        return ResponseEntity.ok(ApiResponse.success(declarations));
    }

    @PatchMapping("/{id}/review")
    @Operation(summary = "Approuver ou rejeter une déclaration (agent)")
    public ResponseEntity<ApiResponse<DeclarationResponse>> review(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User agent
    ) {
        DeclarationResponse response = declarationService.review(id, request, agent);
        return ResponseEntity.ok(ApiResponse.success("Déclaration traitée", response));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Télécharger l'acte de naissance en PDF")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        Declaration declaration = declarationService.getApprovedDeclarationForPdf(id, user);
        byte[] pdf = pdfService.generate(declaration);

        String filename = "acte-naissance-" + declaration.getReference() + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(pdf);
    }
}
