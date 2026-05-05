package ru.orphanage.notification.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String ADOPTION_STATUS_QUEUE = "adoption.status.queue";

    @Bean
    public Queue adoptionStatusQueue() {
        return new Queue(ADOPTION_STATUS_QUEUE, true);
    }
}
