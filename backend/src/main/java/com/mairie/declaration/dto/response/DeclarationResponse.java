package com.mairie.declaration.dto.response;

import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.enums.DeclarationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeclarationResponse {

    private Long id;
    private String reference;

    // Enfant
    private String childLastName;
    private String childFirstNames;
    private LocalDate childBirthDate;
    private String childBirthPlace;
    private String childGender;

    // Père
    private String fatherLastName;
    private String fatherFirstNames;
    private LocalDate fatherBirthDate;
    private String fatherNationality;
    private String fatherProfession;
    private String fatherAddress;

    // Mère
    private String motherLastName;
    private String motherFirstNames;
    private LocalDate motherBirthDate;
    private String motherNationality;
    private String motherProfession;
    private String motherAddress;

    // Déclarant
    private String declarantLastName;
    private String declarantFirstNames;
    private String declarantQuality;

    // Métadonnées
    private DeclarationStatus status;
    private String agentComment;
    private LocalDateTime declarationDate;
    private LocalDateTime processingDate;
    private String createdByName;
    private String processedByName;
    private LocalDateTime createdAt;

    public static DeclarationResponse fromEntity(Declaration d) {
        return DeclarationResponse.builder()
                .id(d.getId())
                .reference(d.getReference())
                .childLastName(d.getChildLastName())
                .childFirstNames(d.getChildFirstNames())
                .childBirthDate(d.getChildBirthDate())
                .childBirthPlace(d.getChildBirthPlace())
                .childGender(d.getChildGender())
                .fatherLastName(d.getFatherLastName())
                .fatherFirstNames(d.getFatherFirstNames())
                .fatherBirthDate(d.getFatherBirthDate())
                .fatherNationality(d.getFatherNationality())
                .fatherProfession(d.getFatherProfession())
                .fatherAddress(d.getFatherAddress())
                .motherLastName(d.getMotherLastName())
                .motherFirstNames(d.getMotherFirstNames())
                .motherBirthDate(d.getMotherBirthDate())
                .motherNationality(d.getMotherNationality())
                .motherProfession(d.getMotherProfession())
                .motherAddress(d.getMotherAddress())
                .declarantLastName(d.getDeclarantLastName())
                .declarantFirstNames(d.getDeclarantFirstNames())
                .declarantQuality(d.getDeclarantQuality())
                .status(d.getStatus())
                .agentComment(d.getAgentComment())
                .declarationDate(d.getDeclarationDate())
                .processingDate(d.getProcessingDate())
                .createdByName(d.getCreatedBy().getFirstName() + " " + d.getCreatedBy().getLastName())
                .processedByName(d.getProcessedBy() != null
                        ? d.getProcessedBy().getFirstName() + " " + d.getProcessedBy().getLastName()
                        : null)
                .createdAt(d.getCreatedAt())
                .build();
    }
}
