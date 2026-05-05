package ru.orphanage.children.entity;

public enum ChildStatus {
    /** Находится в детском доме */
    ACTIVE,
    /** Передан под опеку */
    UNDER_GUARDIANSHIP,
    /** Усыновлён */
    ADOPTED,
    /** Достиг совершеннолетия */
    GRADUATED,
    /** Переведён в другое учреждение */
    TRANSFERRED
}
