package ru.orphanage.notification.messaging;

/**
 * Событие от adoption-service — десериализуется из RabbitMQ.
 */
public record AdoptionStatusChangedEvent(
        Long adoptionRequestId,
        Long childId,
        String applicantEmail,
        String applicantFirstName,
        String newStatus,
        String previousStatus
) {}
