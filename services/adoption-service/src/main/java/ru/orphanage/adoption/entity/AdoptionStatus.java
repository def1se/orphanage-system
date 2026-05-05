package ru.orphanage.adoption.entity;

public enum AdoptionStatus {
    /** Заявка подана */
    SUBMITTED,
    /** На рассмотрении */
    UNDER_REVIEW,
    /** Одобрена */
    APPROVED,
    /** Отклонена */
    REJECTED,
    /** Завершена (ребёнок передан) */
    COMPLETED,
    /** Отозвана заявителем */
    WITHDRAWN
}
