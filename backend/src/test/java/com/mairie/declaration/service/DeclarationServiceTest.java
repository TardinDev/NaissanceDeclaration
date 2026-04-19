package com.mairie.declaration.service;

import com.mairie.declaration.dto.request.DeclarationRequest;
import com.mairie.declaration.dto.request.ReviewRequest;
import com.mairie.declaration.dto.response.DeclarationResponse;
import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.entity.enums.DeclarationStatus;
import com.mairie.declaration.entity.enums.Role;
import com.mairie.declaration.exception.ResourceNotFoundException;
import com.mairie.declaration.mapper.DeclarationMapper;
import com.mairie.declaration.repository.DeclarationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeclarationServiceTest {

    @Mock
    private DeclarationRepository declarationRepository;

    @Mock
    private DeclarationMapper declarationMapper;

    @InjectMocks
    private DeclarationService declarationService;

    private User citizen;

    @BeforeEach
    void setUp() {
        citizen = User.builder()
                .id(1L)
                .email("alice@example.com")
                .firstName("Alice")
                .lastName("Dupont")
                .role(Role.CITIZEN)
                .build();
    }

    @Test
    @DisplayName("create() retourne une déclaration en DRAFT avec une référence générée")
    void create_shouldPersistDraftWithReference() {
        DeclarationRequest request = buildValidRequest();
        when(declarationRepository.save(any(Declaration.class))).thenAnswer(inv -> {
            Declaration d = inv.getArgument(0);
            d.setId(42L);
            return d;
        });
        when(declarationMapper.toResponse(any(Declaration.class)))
                .thenAnswer(inv -> {
                    Declaration d = inv.getArgument(0);
                    return DeclarationResponse.builder()
                            .id(d.getId())
                            .reference(d.getReference())
                            .status(d.getStatus())
                            .build();
                });

        DeclarationResponse response = declarationService.create(request, citizen);

        assertThat(response.getId()).isEqualTo(42L);
        assertThat(response.getStatus()).isEqualTo(DeclarationStatus.DRAFT);
        assertThat(response.getReference()).startsWith("DN-");
    }

    @Test
    @DisplayName("submit() refuse une déclaration qui n'est pas un brouillon")
    void submit_shouldRejectIfNotDraft() {
        Declaration declaration = Declaration.builder()
                .id(10L)
                .status(DeclarationStatus.SUBMITTED)
                .createdBy(citizen)
                .build();
        when(declarationRepository.findById(10L)).thenReturn(Optional.of(declaration));

        assertThatThrownBy(() -> declarationService.submit(10L, citizen))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("brouillons");
    }

    @Test
    @DisplayName("getById() lève ResourceNotFoundException si l'id n'existe pas")
    void getById_shouldThrowIfMissing() {
        when(declarationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> declarationService.getById(99L, citizen))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("review() approuve et positionne l'agent + la date de traitement")
    void review_shouldApproveAndStampAgent() {
        User agent = User.builder().id(2L).firstName("Bob").lastName("Agent").role(Role.AGENT).build();
        Declaration declaration = Declaration.builder()
                .id(11L)
                .status(DeclarationStatus.SUBMITTED)
                .createdBy(citizen)
                .build();
        when(declarationRepository.findById(11L)).thenReturn(Optional.of(declaration));
        when(declarationRepository.save(any(Declaration.class))).thenAnswer(inv -> inv.getArgument(0));
        when(declarationMapper.toResponse(any(Declaration.class)))
                .thenAnswer(inv -> DeclarationResponse.builder()
                        .id(((Declaration) inv.getArgument(0)).getId())
                        .status(((Declaration) inv.getArgument(0)).getStatus())
                        .build());

        ReviewRequest review = new ReviewRequest();
        review.setApproved(true);
        review.setComment("Dossier conforme");

        DeclarationResponse response = declarationService.review(11L, review, agent);

        assertThat(response.getStatus()).isEqualTo(DeclarationStatus.APPROVED);
        assertThat(declaration.getProcessedBy()).isEqualTo(agent);
        assertThat(declaration.getProcessingDate()).isNotNull();
    }

    @Test
    @DisplayName("getApprovedDeclarationForPdf() refuse si la déclaration n'est pas approuvée")
    void pdf_shouldRejectNonApproved() {
        Declaration declaration = Declaration.builder()
                .id(12L)
                .status(DeclarationStatus.SUBMITTED)
                .createdBy(citizen)
                .build();
        when(declarationRepository.findById(12L)).thenReturn(Optional.of(declaration));

        assertThatThrownBy(() -> declarationService.getApprovedDeclarationForPdf(12L, citizen))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("approuvées");
    }

    private DeclarationRequest buildValidRequest() {
        DeclarationRequest request = new DeclarationRequest();
        request.setChildLastName("Martin");
        request.setChildFirstNames("Léa");
        request.setChildBirthDate(LocalDate.of(2026, 1, 15));
        request.setChildBirthPlace("Paris");
        request.setChildGender("F");
        request.setMotherLastName("Martin");
        request.setMotherFirstNames("Claire");
        request.setDeclarantLastName("Martin");
        request.setDeclarantFirstNames("Jean");
        request.setDeclarantQuality("Père");
        return request;
    }
}
