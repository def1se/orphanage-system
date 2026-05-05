package ru.orphanage.children.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.children.dto.LegalStatusDto;
import ru.orphanage.children.service.LegalStatusService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/children/{childId}/legal-status")
@RequiredArgsConstructor
public class LegalStatusController {

    private final LegalStatusService legalStatusService;

    @GetMapping
    public ResponseEntity<List<LegalStatusDto>> getByChildId(@PathVariable Long childId) {
        return ResponseEntity.ok(legalStatusService.getByChildId(childId));
    }
}
