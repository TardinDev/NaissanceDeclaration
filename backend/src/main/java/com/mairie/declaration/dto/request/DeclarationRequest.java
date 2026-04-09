package com.mairie.declaration.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeclarationRequest {

    // Enfant
    @NotBlank(message = "Le nom de l'enfant est obligatoire")
    private String childLastName;

    @NotBlank(message = "Le(s) prénom(s) de l'enfant est/sont obligatoire(s)")
    private String childFirstNames;

    @NotNull(message = "La date de naissance est obligatoire")
    private LocalDate childBirthDate;

    @NotBlank(message = "Le lieu de naissance est obligatoire")
    private String childBirthPlace;

    @NotBlank(message = "Le sexe de l'enfant est obligatoire")
    private String childGender;

    // Père
    private String fatherLastName;
    private String fatherFirstNames;
    private LocalDate fatherBirthDate;
    private String fatherNationality;
    private String fatherProfession;
    private String fatherAddress;

    // Mère
    @NotBlank(message = "Le nom de la mère est obligatoire")
    private String motherLastName;

    @NotBlank(message = "Le(s) prénom(s) de la mère est/sont obligatoire(s)")
    private String motherFirstNames;

    private LocalDate motherBirthDate;
    private String motherNationality;
    private String motherProfession;
    private String motherAddress;

    // Déclarant
    @NotBlank(message = "Le nom du déclarant est obligatoire")
    private String declarantLastName;

    @NotBlank(message = "Le(s) prénom(s) du déclarant est/sont obligatoire(s)")
    private String declarantFirstNames;

    @NotBlank(message = "La qualité du déclarant est obligatoire")
    private String declarantQuality;
}
