package ru.orphanage.children.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LegalStatusDto {
    private Long id;
    private Long childId;
    private String parentsStatus;
    private String alimonyAccount;
    private String propertyRightsNotes;
    private String courtDecisions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
