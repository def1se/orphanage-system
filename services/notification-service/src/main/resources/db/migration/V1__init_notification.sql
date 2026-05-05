CREATE TABLE IF NOT EXISTS notification.notification_logs
(
    id                    BIGSERIAL PRIMARY KEY,
    adoption_request_id   BIGINT,
    recipient_email       VARCHAR(200),
    subject               VARCHAR(300),
    type                  VARCHAR(50)  NOT NULL,
    status                VARCHAR(20)  NOT NULL,
    error_message         TEXT,
    sent_at               TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_status    ON notification.notification_logs (status);
CREATE INDEX IF NOT EXISTS idx_notif_request   ON notification.notification_logs (adoption_request_id);

COMMENT ON TABLE notification.notification_logs IS 'Журнал отправленных уведомлений';
