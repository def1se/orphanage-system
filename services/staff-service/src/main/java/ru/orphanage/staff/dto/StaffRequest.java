package ru.orphanage.staff.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.orphanage.staff.entity.StaffPosition;
import ru.orphanage.staff.entity.StaffStatus;

import java.time.LocalDate;

@Data
public class StaffRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private String middleName;
    @NotNull private StaffPosition position;
    private String phone;
    @Email private String email;
    @NotNull private LocalDate hireDate;
    private String keycloakUserId;
    private String notes;
    @NotNull private StaffStatus status;
}
