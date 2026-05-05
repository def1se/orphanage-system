package ru.orphanage.adoption.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.adoption.entity.AdoptionApplication;
import ru.orphanage.adoption.repository.AdoptionApplicationRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/adoptions/applications")
@RequiredArgsConstructor
public class AdoptionApplicationController {

    private final AdoptionApplicationRepository repository;

    @PostMapping
    public ResponseEntity<AdoptionApplication> submitApplication(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody AdoptionApplication application) {
        
        application.setUserSub(jwt.getSubject());
        application.setStatus("PENDING");
        return ResponseEntity.ok(repository.save(application));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AdoptionApplication>> getMyApplications(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(repository.findByUserSub(jwt.getSubject()));
    }
}
