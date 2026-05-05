package ru.orphanage.notification.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.orphanage.notification.dto.EmailRequest;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final JavaMailSender mailSender;

    @PostMapping("/email")
    public ResponseEntity<Void> sendEmail(@RequestBody EmailRequest request) {
        log.info("Sending email to {}: Subject: '{}'", request.getTo(), request.getSubject());
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@orphanage.ru");
        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        message.setText(request.getText());
        
        mailSender.send(message);
        
        return ResponseEntity.ok().build();
    }
}
