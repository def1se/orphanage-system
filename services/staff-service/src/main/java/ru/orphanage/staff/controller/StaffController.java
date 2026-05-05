package ru.orphanage.staff.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.staff.dto.StaffRequest;
import ru.orphanage.staff.dto.StaffResponse;
import ru.orphanage.staff.entity.StaffPosition;
import ru.orphanage.staff.entity.StaffStatus;
import ru.orphanage.staff.service.StaffService;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<Page<StaffResponse>> getAll(@PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(staffService.findAll(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<StaffResponse>> getByStatus(
            @PathVariable StaffStatus status, @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(staffService.findByStatus(status, pageable));
    }

    @GetMapping("/position/{position}")
    public ResponseEntity<Page<StaffResponse>> getByPosition(
            @PathVariable StaffPosition position, @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(staffService.findByPosition(position, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR')")
    public ResponseEntity<StaffResponse> create(@Valid @RequestBody StaffRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR')")
    public ResponseEntity<StaffResponse> update(@PathVariable Long id, @Valid @RequestBody StaffRequest request) {
        return ResponseEntity.ok(staffService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        staffService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
