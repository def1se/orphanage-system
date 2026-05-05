package ru.orphanage.children.dto;

import lombok.Data;
import ru.orphanage.children.entity.ChildStatus;
import ru.orphanage.children.entity.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ChildResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private ChildStatus status;
    private LocalDate admissionDate;
    private String roomNumber;
    private String healthNotes;
    private String educationNotes;
    private String photoUrl;
    private Long responsibleEducatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Вычисляемый возраст */
    public int getAge() {
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }
}
