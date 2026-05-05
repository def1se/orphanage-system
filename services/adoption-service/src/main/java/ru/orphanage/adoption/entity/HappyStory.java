package ru.orphanage.adoption.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "happy_stories", schema = "adoption")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HappyStory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private Long childId;

    @Column(name = "story_text", nullable = false, columnDefinition = "TEXT")
    private String storyText;

    @Column(name = "author_id", nullable = false)
    private UUID authorId;

    @Column(name = "published_at")
    @CreationTimestamp
    private LocalDateTime publishedAt;

    @Column(name = "is_anonymous")
    @Builder.Default
    private Boolean isAnonymous = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
