package com.mairie.declaration.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI declarationOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Déclaration de Naissance")
                        .description("API REST de dématérialisation des déclarations de naissance. "
                                + "Circuit Citoyen → Agent → Admin avec génération d'acte officiel en PDF.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Davy Tardin")
                                .email("tardindavy@gmail.com"))
                        .license(new License().name("Usage administratif")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME,
                        new SecurityScheme()
                                .name(BEARER_SCHEME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
