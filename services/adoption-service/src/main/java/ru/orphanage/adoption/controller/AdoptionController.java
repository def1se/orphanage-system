package ru.orphanage.adoption.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.adoption.dto.AdoptionRequestDto;
import ru.orphanage.adoption.dto.AdoptionResponseDto;
import ru.orphanage.adoption.entity.AdoptionStatus;
import ru.orphanage.adoption.service.AdoptionService;

@RestController
@RequestMapping("/api/v1/adoptions")
@RequiredArgsConstructor
public class AdoptionController {

    private final AdoptionService adoptionService;

    @GetMapping
    public ResponseEntity<Page<AdoptionResponseDto>> getAll(@PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(adoptionService.findAll(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<AdoptionResponseDto>> getByStatus(
            @PathVariable AdoptionStatus status, @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(adoptionService.findByStatus(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdoptionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(adoptionService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_SOCIAL_WORKER')")
    public ResponseEntity<AdoptionResponseDto> create(@Valid @RequestBody AdoptionRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adoptionService.create(dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR')")
    public ResponseEntity<AdoptionResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestParam AdoptionStatus status) {
        return ResponseEntity.ok(adoptionService.updateStatus(id, status));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_SOCIAL_WORKER')")
    public ResponseEntity<AdoptionResponseDto> update(
            @PathVariable Long id, @Valid @RequestBody AdoptionRequestDto dto) {
        return ResponseEntity.ok(adoptionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adoptionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
