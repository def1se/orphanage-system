package ru.orphanage.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.notification.entity.NotificationLog;
import ru.orphanage.notification.entity.NotificationStatus;

import java.util.List;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    List<NotificationLog> findByStatus(NotificationStatus status);
    List<NotificationLog> findByAdoptionRequestId(Long adoptionRequestId);
}
