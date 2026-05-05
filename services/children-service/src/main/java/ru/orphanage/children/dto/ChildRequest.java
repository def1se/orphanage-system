package ru.orphanage.children.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Data;
import ru.orphanage.children.entity.ChildStatus;
import ru.orphanage.children.entity.Gender;

import java.time.LocalDate;

@Data
public class ChildRequest {

    @NotBlank(message = "Имя обязательно")
    private String firstName;

    @NotBlank(message = "Фамилия обязательна")
    private String lastName;

    private String middleName;

    @NotNull(message = "Дата рождения обязательна")
    @Past(message = "Дата рождения должна быть в прошлом")
    private LocalDate birthDate;

    @NotNull(message = "Пол обязателен")
    private Gender gender;

    @NotNull(message = "Статус обязателен")
    private ChildStatus status;

    @NotNull(message = "Дата поступления обязательна")
    private LocalDate admissionDate;

    private String description;
    private String roomNumber;
    private String healthNotes;
    private String educationNotes;
    private String imageUrl;
    private Long responsibleEducatorId;
}
