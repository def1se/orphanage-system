package ru.orphanage.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "procurement_requests", schema = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcurementRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requester_name", nullable = false)
    private String requesterName;

    @Column(name = "item_category", nullable = false)
    private String itemCategory;

    @Column(name = "item_description", columnDefinition = "TEXT", nullable = false)
    private String itemDescription;

    @Column(name = "requested_quantity", nullable = false)
    private Integer requestedQuantity;

    @Column(name = "estimated_budget")
    private BigDecimal estimatedBudget;

    @Column(name = "justification", columnDefinition = "TEXT")
    private String justification;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
