package ru.orphanage.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nutrition_norms", schema = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionNorm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "age_group", nullable = false)
    private String ageGroup;

    @Column(name = "calories_per_day", nullable = false)
    private Integer caloriesPerDay;

    @Column(name = "protein_grams", nullable = false)
    private BigDecimal proteinGrams;

    @Column(name = "fat_grams", nullable = false)
    private BigDecimal fatGrams;

    @Column(name = "carbs_grams", nullable = false)
    private BigDecimal carbsGrams;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
