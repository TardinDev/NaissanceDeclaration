package com.mairie.declaration.entity;

import com.mairie.declaration.entity.enums.DeclarationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "declarations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Declaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reference;

    // === Informations de l'enfant ===
    @Column(name = "child_last_name")
    private String childLastName;

    @Column(name = "child_first_names")
    private String childFirstNames;

    @Column(name = "child_birth_date")
    private LocalDate childBirthDate;

    @Column(name = "child_birth_place")
    private String childBirthPlace;

    @Column(name = "child_gender")
    private String childGender;

    // === Informations du père ===
    @Column(name = "father_last_name")
    private String fatherLastName;

    @Column(name = "father_first_names")
    private String fatherFirstNames;

    @Column(name = "father_birth_date")
    private LocalDate fatherBirthDate;

    @Column(name = "father_nationality")
    private String fatherNationality;

    @Column(name = "father_profession")
    private String fatherProfession;

    @Column(name = "father_address")
    private String fatherAddress;

    // === Informations de la mère ===
    @Column(name = "mother_last_name")
    private String motherLastName;

    @Column(name = "mother_first_names")
    private String motherFirstNames;

    @Column(name = "mother_birth_date")
    private LocalDate motherBirthDate;

    @Column(name = "mother_nationality")
    private String motherNationality;

    @Column(name = "mother_profession")
    private String motherProfession;

    @Column(name = "mother_address")
    private String motherAddress;

    // === Informations du déclarant ===
    @Column(name = "declarant_last_name")
    private String declarantLastName;

    @Column(name = "declarant_first_names")
    private String declarantFirstNames;

    @Column(name = "declarant_quality")
    private String declarantQuality;

    // === Métadonnées ===
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeclarationStatus status;

    @Column(name = "agent_comment", columnDefinition = "TEXT")
    private String agentComment;

    @Column(name = "declaration_date")
    private LocalDateTime declarationDate;

    @Column(name = "processing_date")
    private LocalDateTime processingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (declarationDate == null) {
            declarationDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
