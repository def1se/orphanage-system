package ru.orphanage.staff.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "shift_logs", schema = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_schedule_id", nullable = false)
    private ShiftSchedule shiftSchedule;

    @Column(name = "incident_report", columnDefinition = "TEXT")
    private String incidentReport;

    @Column(name = "handover_notes", columnDefinition = "TEXT")
    private String handoverNotes;

    @CreationTimestamp
    @Column(name = "log_time", updatable = false)
    private LocalDateTime logTime;
}
