package ru.orphanage.children.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "children", schema = "children")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE children.children SET is_deleted = true WHERE id=?")
@Where(clause = "is_deleted=false")
@EntityListeners(AuditingEntityListener.class)
public class Child {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ChildStatus status;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "room_number", length = 20)
    private String roomNumber;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "health_notes", columnDefinition = "TEXT")
    private String healthNotes;

    @Column(name = "education_notes", columnDefinition = "TEXT")
    private String educationNotes;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "responsible_educator_id")
    private Long responsibleEducatorId;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
