package ru.orphanage.staff.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.staff.entity.Event;
import ru.orphanage.staff.service.EventService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<Void> registerVolunteer(
            @PathVariable Long eventId,
            @RequestBody VolunteerRequest request) {
        eventService.registerVolunteer(eventId, request.getName(), request.getEmail());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/report/pdf")
    public ResponseEntity<byte[]> downloadPdfReport() {
        byte[] pdf = eventService.generatePdfReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "events_report.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}

@Data
class VolunteerRequest {
    private String name;
    private String email;
}
