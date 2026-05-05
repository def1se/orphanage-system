package ru.orphanage.children.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.children.dto.ChildRequest;
import ru.orphanage.children.dto.ChildResponse;
import ru.orphanage.children.entity.ChildStatus;
import ru.orphanage.children.service.ChildService;

@RestController
@RequestMapping("/api/v1/children")
@RequiredArgsConstructor
public class ChildController {

    private final ChildService childService;

    @GetMapping
    public ResponseEntity<Page<ChildResponse>> getAll(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(childService.findAll(pageable));
    }

    @GetMapping("/public")
    public ResponseEntity<Page<ru.orphanage.children.dto.PublicChildResponse>> getPublicChildren(
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(childService.getPublicChildren(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<ChildResponse>> getByStatus(
            @PathVariable ChildStatus status,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(childService.findByStatus(status, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ChildResponse>> search(
            @RequestParam String q,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(childService.search(q, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChildResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(childService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR')")
    public ResponseEntity<ChildResponse> create(@Valid @RequestBody ChildRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(childService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_EDUCATOR')")
    public ResponseEntity<ChildResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ChildRequest request) {
        return ResponseEntity.ok(childService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        childService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
