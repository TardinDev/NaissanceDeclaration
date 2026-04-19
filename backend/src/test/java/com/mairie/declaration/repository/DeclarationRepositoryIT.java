package com.mairie.declaration.repository;

import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.entity.enums.DeclarationStatus;
import com.mairie.declaration.entity.enums.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Testcontainers
@DisplayName("DeclarationRepository sur une vraie base MySQL (Testcontainers)")
class DeclarationRepositoryIT {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("declaration_naissance_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerMysql(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @Autowired
    private DeclarationRepository declarationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("findByStatusInOrderByCreatedAtAsc ne retourne que les statuts demandés")
    void findByStatusIn_shouldFilterByStatus() {
        User citizen = userRepository.save(User.builder()
                .email("alice@example.com")
                .password("secret")
                .firstName("Alice")
                .lastName("Dupont")
                .role(Role.CITIZEN)
                .build());

        declarationRepository.save(buildDeclaration(citizen, DeclarationStatus.DRAFT, "DN-DRAFT"));
        declarationRepository.save(buildDeclaration(citizen, DeclarationStatus.SUBMITTED, "DN-SUB"));
        declarationRepository.save(buildDeclaration(citizen, DeclarationStatus.IN_REVIEW, "DN-REV"));
        declarationRepository.save(buildDeclaration(citizen, DeclarationStatus.APPROVED, "DN-OK"));

        List<Declaration> pending = declarationRepository.findByStatusInOrderByCreatedAtAsc(
                List.of(DeclarationStatus.SUBMITTED, DeclarationStatus.IN_REVIEW));

        assertThat(pending).extracting(Declaration::getReference)
                .containsExactlyInAnyOrder("DN-SUB", "DN-REV");
    }

    private Declaration buildDeclaration(User citizen, DeclarationStatus status, String reference) {
        return Declaration.builder()
                .reference(reference)
                .status(status)
                .createdBy(citizen)
                .build();
    }
}
