package ru.orphanage.notification.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import ru.orphanage.notification.entity.NotificationLog;
import ru.orphanage.notification.entity.NotificationStatus;
import ru.orphanage.notification.entity.NotificationType;
import ru.orphanage.notification.repository.NotificationLogRepository;
import ru.orphanage.notification.service.EmailService;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdoptionEventConsumer {

    private static final String QUEUE = "adoption.status.queue";

    private final EmailService emailService;
    private final NotificationLogRepository logRepository;

    @RabbitListener(queues = QUEUE)
    public void handleAdoptionStatusChanged(AdoptionStatusChangedEvent event) {
        log.info("Получено событие: requestId={}, статус: {} → {}",
                event.adoptionRequestId(), event.previousStatus(), event.newStatus());

        String subject = "Обновление статуса вашей заявки на усыновление";
        String body = buildEmailBody(event);

        NotificationStatus status = NotificationStatus.SENT;
        String errorMsg = null;

        try {
            if (event.applicantEmail() != null && !event.applicantEmail().isBlank()) {
                emailService.sendEmail(event.applicantEmail(), subject, body);
            } else {
                log.warn("Email заявителя не указан для заявки id={}", event.adoptionRequestId());
                status = NotificationStatus.SKIPPED;
            }
        } catch (Exception ex) {
            log.error("Ошибка отправки email для заявки id={}: {}", event.adoptionRequestId(), ex.getMessage());
            status = NotificationStatus.FAILED;
            errorMsg = ex.getMessage();
        }

        // Сохраняем лог уведомления
        logRepository.save(NotificationLog.builder()
                .adoptionRequestId(event.adoptionRequestId())
                .recipientEmail(event.applicantEmail())
                .subject(subject)
                .type(NotificationType.ADOPTION_STATUS_CHANGED)
                .status(status)
                .errorMessage(errorMsg)
                .sentAt(LocalDateTime.now())
                .build());
    }

    private String buildEmailBody(AdoptionStatusChangedEvent event) {
        return String.format("""
                Уважаемый(ая) %s,
                
                Статус вашей заявки № %d был изменён.
                
                Предыдущий статус: %s
                Новый статус:      %s
                
                Если у вас есть вопросы, пожалуйста, свяжитесь с администрацией детского дома.
                
                С уважением,
                Информационная система Детского дома
                """,
                event.applicantFirstName(),
                event.adoptionRequestId(),
                translateStatus(event.previousStatus()),
                translateStatus(event.newStatus())
        );
    }

    private String translateStatus(String status) {
        return switch (status) {
            case "SUBMITTED"     -> "Подана";
            case "UNDER_REVIEW"  -> "На рассмотрении";
            case "APPROVED"      -> "Одобрена";
            case "REJECTED"      -> "Отклонена";
            case "COMPLETED"     -> "Завершена";
            case "WITHDRAWN"     -> "Отозвана";
            default              -> status;
        };
    }
}
