package ru.orphanage.children.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "legal_statuses", schema = "children")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LegalStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @Column(name = "parents_status", nullable = false)
    private String parentsStatus;

    @Column(name = "alimony_account")
    private String alimonyAccount;

    @Column(name = "property_rights_notes", columnDefinition = "TEXT")
    private String propertyRightsNotes;

    @Column(name = "court_decisions", columnDefinition = "TEXT")
    private String courtDecisions;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
