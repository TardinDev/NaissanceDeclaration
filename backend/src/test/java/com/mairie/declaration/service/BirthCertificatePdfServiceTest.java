package com.mairie.declaration.service;

import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.entity.enums.DeclarationStatus;
import com.mairie.declaration.entity.enums.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class BirthCertificatePdfServiceTest {

    private final BirthCertificatePdfService service = new BirthCertificatePdfService();

    @Test
    @DisplayName("generate() produit un PDF non vide avec l'en-tête %PDF")
    void generate_shouldProduceValidPdf() {
        User citizen = User.builder().id(1L).firstName("Alice").lastName("Dupont").role(Role.CITIZEN).build();
        Declaration declaration = Declaration.builder()
                .id(1L)
                .reference("DN-2026-TEST01")
                .childLastName("Martin")
                .childFirstNames("Léa")
                .childBirthDate(LocalDate.of(2026, 1, 15))
                .childBirthPlace("Paris")
                .childGender("F")
                .motherLastName("Martin")
                .motherFirstNames("Claire")
                .declarantLastName("Martin")
                .declarantFirstNames("Jean")
                .declarantQuality("Père")
                .status(DeclarationStatus.APPROVED)
                .createdBy(citizen)
                .build();

        byte[] pdf = service.generate(declaration);

        assertThat(pdf).isNotEmpty();
        assertThat(new String(pdf, 0, 4)).isEqualTo("%PDF");
    }
}
