package ru.orphanage.adoption.messaging;

/**
 * Событие об изменении статуса заявки на усыновление.
 * Публикуется в RabbitMQ → потребляется notification-service.
 */
public record AdoptionStatusChangedEvent(
        Long adoptionRequestId,
        Long childId,
        String applicantEmail,
        String applicantFirstName,
        String newStatus,
        String previousStatus
) {}
