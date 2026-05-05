package ru.orphanage.staff.dto;

import lombok.Data;
import ru.orphanage.staff.entity.StaffPosition;
import ru.orphanage.staff.entity.StaffStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StaffResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private StaffPosition position;
    private String phone;
    private String email;
    private LocalDate hireDate;
    private String keycloakUserId;
    private String notes;
    private StaffStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
