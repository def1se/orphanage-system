package ru.orphanage.staff.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff", schema = "staff")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StaffMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "position", nullable = false)
    private StaffPosition position;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "keycloak_user_id", length = 100)
    private String keycloakUserId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StaffStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
