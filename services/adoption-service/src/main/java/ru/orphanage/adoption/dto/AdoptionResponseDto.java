package ru.orphanage.adoption.dto;

import lombok.Data;
import ru.orphanage.adoption.entity.AdoptionStatus;
import ru.orphanage.adoption.entity.AdoptionType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AdoptionResponseDto {
    private Long id;
    private Long childId;
    private String applicantFirstName;
    private String applicantLastName;
    private String applicantMiddleName;
    private String applicantPhone;
    private String applicantEmail;
    private AdoptionType requestType;
    private AdoptionStatus status;
    private LocalDate submissionDate;
    private LocalDate decisionDate;
    private String notes;
    private Long curatorStaffId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
