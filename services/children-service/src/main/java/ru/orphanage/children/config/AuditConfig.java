package ru.orphanage.children.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.of("system"); // Or return empty for unauthenticated operations
            }
            
            Object principal = authentication.getPrincipal();
            if (principal instanceof Jwt jwt) {
                // Keycloak uses preferred_username in the JWT payload
                String username = jwt.getClaimAsString("preferred_username");
                return Optional.ofNullable(username).or(() -> Optional.of(authentication.getName()));
            }
            
            return Optional.of(authentication.getName());
        };
    }
}
