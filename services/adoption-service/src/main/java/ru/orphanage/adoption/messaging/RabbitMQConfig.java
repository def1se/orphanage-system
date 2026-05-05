package ru.orphanage.adoption.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE    = AdoptionEventPublisher.EXCHANGE;
    public static final String QUEUE       = "adoption.status.queue";
    public static final String ROUTING_KEY = AdoptionEventPublisher.ROUTING_KEY;

    @Bean
    public TopicExchange adoptionExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    @Bean
    public Queue adoptionStatusQueue() {
        return QueueBuilder.durable(QUEUE).build();
    }

    @Bean
    public Binding adoptionBinding(Queue adoptionStatusQueue, TopicExchange adoptionExchange) {
        return BindingBuilder.bind(adoptionStatusQueue).to(adoptionExchange).with(ROUTING_KEY);
    }

    /** Сериализация сообщений в JSON */
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf, Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(cf);
        template.setMessageConverter(converter);
        return template;
    }
}
