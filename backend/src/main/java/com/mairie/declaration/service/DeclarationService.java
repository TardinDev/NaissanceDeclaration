package com.mairie.declaration.service;

import com.mairie.declaration.dto.request.DeclarationRequest;
import com.mairie.declaration.dto.request.ReviewRequest;
import com.mairie.declaration.dto.response.DeclarationResponse;
import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.entity.enums.DeclarationStatus;
import com.mairie.declaration.exception.ResourceNotFoundException;
import com.mairie.declaration.mapper.DeclarationMapper;
import com.mairie.declaration.repository.DeclarationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeclarationService {

    private final DeclarationRepository declarationRepository;
    private final DeclarationMapper declarationMapper;

    @Transactional
    public DeclarationResponse create(DeclarationRequest request, User citizen) {
        Declaration declaration = Declaration.builder()
                .reference(generateReference())
                .childLastName(request.getChildLastName())
                .childFirstNames(request.getChildFirstNames())
                .childBirthDate(request.getChildBirthDate())
                .childBirthPlace(request.getChildBirthPlace())
                .childGender(request.getChildGender())
                .fatherLastName(request.getFatherLastName())
                .fatherFirstNames(request.getFatherFirstNames())
                .fatherBirthDate(request.getFatherBirthDate())
                .fatherNationality(request.getFatherNationality())
                .fatherProfession(request.getFatherProfession())
                .fatherAddress(request.getFatherAddress())
                .motherLastName(request.getMotherLastName())
                .motherFirstNames(request.getMotherFirstNames())
                .motherBirthDate(request.getMotherBirthDate())
                .motherNationality(request.getMotherNationality())
                .motherProfession(request.getMotherProfession())
                .motherAddress(request.getMotherAddress())
                .declarantLastName(request.getDeclarantLastName())
                .declarantFirstNames(request.getDeclarantFirstNames())
                .declarantQuality(request.getDeclarantQuality())
                .status(DeclarationStatus.DRAFT)
                .createdBy(citizen)
                .build();

        Declaration saved = declarationRepository.save(declaration);
        return declarationMapper.toResponse(saved);
    }

    public DeclarationResponse getById(Long id, User currentUser) {
        Declaration declaration = findDeclarationById(id);
        validateAccess(declaration, currentUser);
        return declarationMapper.toResponse(declaration);
    }

    public List<DeclarationResponse> getMyDeclarations(User citizen) {
        return declarationMapper.toResponseList(
                declarationRepository.findByCreatedByOrderByCreatedAtDesc(citizen)
        );
    }

    @Transactional
    public DeclarationResponse update(Long id, DeclarationRequest request, User citizen) {
        Declaration declaration = findDeclarationById(id);

        if (!declaration.getCreatedBy().getId().equals(citizen.getId())) {
            throw new IllegalArgumentException("Vous ne pouvez modifier que vos propres déclarations");
        }
        if (declaration.getStatus() != DeclarationStatus.DRAFT) {
            throw new IllegalStateException("Seuls les brouillons peuvent être modifiés");
        }

        declaration.setChildLastName(request.getChildLastName());
        declaration.setChildFirstNames(request.getChildFirstNames());
        declaration.setChildBirthDate(request.getChildBirthDate());
        declaration.setChildBirthPlace(request.getChildBirthPlace());
        declaration.setChildGender(request.getChildGender());
        declaration.setFatherLastName(request.getFatherLastName());
        declaration.setFatherFirstNames(request.getFatherFirstNames());
        declaration.setFatherBirthDate(request.getFatherBirthDate());
        declaration.setFatherNationality(request.getFatherNationality());
        declaration.setFatherProfession(request.getFatherProfession());
        declaration.setFatherAddress(request.getFatherAddress());
        declaration.setMotherLastName(request.getMotherLastName());
        declaration.setMotherFirstNames(request.getMotherFirstNames());
        declaration.setMotherBirthDate(request.getMotherBirthDate());
        declaration.setMotherNationality(request.getMotherNationality());
        declaration.setMotherProfession(request.getMotherProfession());
        declaration.setMotherAddress(request.getMotherAddress());
        declaration.setDeclarantLastName(request.getDeclarantLastName());
        declaration.setDeclarantFirstNames(request.getDeclarantFirstNames());
        declaration.setDeclarantQuality(request.getDeclarantQuality());

        Declaration saved = declarationRepository.save(declaration);
        return declarationMapper.toResponse(saved);
    }

    @Transactional
    public DeclarationResponse submit(Long id, User citizen) {
        Declaration declaration = findDeclarationById(id);

        if (!declaration.getCreatedBy().getId().equals(citizen.getId())) {
            throw new IllegalArgumentException("Vous ne pouvez soumettre que vos propres déclarations");
        }
        if (declaration.getStatus() != DeclarationStatus.DRAFT) {
            throw new IllegalStateException("Seuls les brouillons peuvent être soumis");
        }

        declaration.setStatus(DeclarationStatus.SUBMITTED);
        declaration.setDeclarationDate(LocalDateTime.now());

        Declaration saved = declarationRepository.save(declaration);
        return declarationMapper.toResponse(saved);
    }

    public List<DeclarationResponse> getPendingDeclarations() {
        return declarationMapper.toResponseList(
                declarationRepository.findByStatusInOrderByCreatedAtAsc(
                        List.of(DeclarationStatus.SUBMITTED, DeclarationStatus.IN_REVIEW))
        );
    }

    public List<DeclarationResponse> getAllDeclarations() {
        return declarationMapper.toResponseList(
                declarationRepository.findAllByOrderByCreatedAtDesc()
        );
    }

    public Declaration getApprovedDeclarationForPdf(Long id, User currentUser) {
        Declaration declaration = findDeclarationById(id);
        validateAccess(declaration, currentUser);
        if (declaration.getStatus() != DeclarationStatus.APPROVED) {
            throw new IllegalStateException("Seules les déclarations approuvées peuvent être téléchargées en PDF");
        }
        return declaration;
    }

    @Transactional
    public DeclarationResponse review(Long id, ReviewRequest request, User agent) {
        Declaration declaration = findDeclarationById(id);

        if (declaration.getStatus() != DeclarationStatus.SUBMITTED
                && declaration.getStatus() != DeclarationStatus.IN_REVIEW) {
            throw new IllegalStateException("Cette déclaration ne peut pas être traitée dans son état actuel");
        }

        declaration.setStatus(request.getApproved() ? DeclarationStatus.APPROVED : DeclarationStatus.REJECTED);
        declaration.setAgentComment(request.getComment());
        declaration.setProcessedBy(agent);
        declaration.setProcessingDate(LocalDateTime.now());

        Declaration saved = declarationRepository.save(declaration);
        return declarationMapper.toResponse(saved);
    }

    private Declaration findDeclarationById(Long id) {
        return declarationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Déclaration non trouvée avec l'id : " + id));
    }

    private void validateAccess(Declaration declaration, User user) {
        boolean isOwner = declaration.getCreatedBy().getId().equals(user.getId());
        boolean isAgentOrAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_AGENT") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAgentOrAdmin) {
            throw new IllegalArgumentException("Vous n'avez pas accès à cette déclaration");
        }
    }

    private String generateReference() {
        String year = String.valueOf(Year.now().getValue());
        String unique = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "DN-" + year + "-" + unique;
    }
}
