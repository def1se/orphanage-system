package ru.orphanage.adoption.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_requests", schema = "adoption")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdoptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID ребёнка из children-service */
    @Column(name = "child_id", nullable = false)
    private Long childId;

    /** ФИО потенциального усыновителя / опекуна */
    @Column(name = "applicant_first_name", nullable = false, length = 100)
    private String applicantFirstName;

    @Column(name = "applicant_last_name", nullable = false, length = 100)
    private String applicantLastName;

    @Column(name = "applicant_middle_name", length = 100)
    private String applicantMiddleName;

    @Column(name = "applicant_phone", length = 20)
    private String applicantPhone;

    @Column(name = "applicant_email", length = 200)
    private String applicantEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false)
    private AdoptionType requestType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AdoptionStatus status;

    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate;

    @Column(name = "decision_date")
    private LocalDate decisionDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /** ID сотрудника-куратора из staff-service */
    @Column(name = "curator_staff_id")
    private Long curatorStaffId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
