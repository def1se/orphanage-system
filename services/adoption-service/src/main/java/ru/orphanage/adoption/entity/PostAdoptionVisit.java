package ru.orphanage.adoption.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_adoption_visits", schema = "adoption")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostAdoptionVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adoption_request_id", nullable = false)
    private AdoptionRequest adoptionRequest;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "social_worker_name", nullable = false)
    private String socialWorkerName;

    @Column(name = "living_conditions_rating")
    private Integer livingConditionsRating;

    @Column(name = "child_wellbeing_rating")
    private Integer childWellbeingRating;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
