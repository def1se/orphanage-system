package ru.orphanage.adoption.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdoptionEventPublisher {

    public static final String EXCHANGE  = "adoption.exchange";
    public static final String ROUTING_KEY = "adoption.status.changed";

    private final RabbitTemplate rabbitTemplate;

    public void publishStatusChanged(AdoptionStatusChangedEvent event) {
        log.info("Публикация события: requestId={}, новый статус={}", event.adoptionRequestId(), event.newStatus());
        rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, event);
    }
}
