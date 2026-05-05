package ru.orphanage.adoption.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.orphanage.adoption.entity.AdoptionStatus;
import ru.orphanage.adoption.entity.AdoptionType;

import java.time.LocalDate;

@Data
public class AdoptionRequestDto {
    @NotNull  private Long childId;
    @NotBlank private String applicantFirstName;
    @NotBlank private String applicantLastName;
    private String applicantMiddleName;
    private String applicantPhone;
    @Email    private String applicantEmail;
    @NotNull  private AdoptionType requestType;
    @NotNull  private AdoptionStatus status;
    @NotNull  private LocalDate submissionDate;
    private LocalDate decisionDate;
    private String notes;
    private Long curatorStaffId;
}
