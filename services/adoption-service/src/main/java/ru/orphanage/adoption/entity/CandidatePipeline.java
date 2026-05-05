package ru.orphanage.adoption.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_pipeline", schema = "adoption")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatePipeline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sponsor_id")
    private Sponsor sponsor;

    @Column(name = "applicant_name", nullable = false)
    private String applicantName;

    @Column(name = "background_check_passed")
    private Boolean backgroundCheckPassed;

    @Column(name = "school_of_foster_parents_completed")
    private Boolean schoolOfFosterParentsCompleted;

    @Column(name = "psychological_readiness_score")
    private Integer psychologicalReadinessScore;

    @Column(name = "living_conditions_approved")
    private Boolean livingConditionsApproved;

    @Column(name = "current_stage", nullable = false)
    private String currentStage;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
