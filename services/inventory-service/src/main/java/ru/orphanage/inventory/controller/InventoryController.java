package ru.orphanage.inventory.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.inventory.dto.InventoryRequest;
import ru.orphanage.inventory.dto.InventoryResponse;
import ru.orphanage.inventory.entity.ItemCategory;
import ru.orphanage.inventory.entity.ItemStatus;
import ru.orphanage.inventory.service.InventoryService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<Page<InventoryResponse>> getAll(@PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(inventoryService.findAll(pageable));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<InventoryResponse>> getByCategory(
            @PathVariable ItemCategory category, @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(inventoryService.findByCategory(category, pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<InventoryResponse>> getByStatus(
            @PathVariable ItemStatus status, @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(inventoryService.findByStatus(status, pageable));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStock() {
        return ResponseEntity.ok(inventoryService.findLowStock());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR')")
    public ResponseEntity<InventoryResponse> create(@Valid @RequestBody InventoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR')")
    public ResponseEntity<InventoryResponse> update(@PathVariable Long id, @Valid @RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.update(id, request));
    }

    @PatchMapping("/{id}/quantity")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DIRECTOR', 'ROLE_EDUCATOR')")
    public ResponseEntity<InventoryResponse> adjustQuantity(
            @PathVariable Long id, @RequestParam int delta) {
        return ResponseEntity.ok(inventoryService.adjustQuantity(id, delta));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
