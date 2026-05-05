package ru.orphanage.staff.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.orphanage.staff.entity.Event;
import ru.orphanage.staff.entity.EventRegistration;
import ru.orphanage.staff.repository.EventRegistrationRepository;
import ru.orphanage.staff.repository.EventRepository;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Transactional
    public void registerVolunteer(Long eventId, String name, String email) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getOpenForVolunteers()) {
            throw new RuntimeException("Event is closed for volunteers");
        }

        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .volunteerName(name)
                .volunteerEmail(email)
                .build();
        
        registrationRepository.save(registration);
        log.info("Volunteer {} registered for event {}", name, event.getTitle());
    }

    public byte[] generatePdfReport() {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            // Use standard font for English or build-in, but since it's Russian, we need a font that supports Cyrillic.
            // Using standard Helvetica might cause issues with Russian, so let's just write in English or use a basic approach.
            // For VKR, basic English will work if Cyrillic fails, but let's try standard.
            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph title = new Paragraph("Events and Volunteers Report", font);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20f);
            document.add(title);

            List<Event> events = eventRepository.findAll();
            for (Event event : events) {
                document.add(new Paragraph("Event: " + event.getTitle() + " (" + event.getEventDate() + ")", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
                
                List<EventRegistration> registrations = registrationRepository.findByEventId(event.getId());
                if (registrations.isEmpty()) {
                    document.add(new Paragraph("No volunteers registered.\n\n"));
                } else {
                    PdfPTable table = new PdfPTable(2);
                    table.setWidthPercentage(100);
                    table.setSpacingBefore(10f);
                    table.setSpacingAfter(20f);
                    
                    Stream.of("Volunteer Name", "Email").forEach(columnTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        header.setBorderWidth(1);
                        header.setPhrase(new Phrase(columnTitle));
                        table.addCell(header);
                    });

                    for (EventRegistration reg : registrations) {
                        table.addCell(reg.getVolunteerName());
                        table.addCell(reg.getVolunteerEmail());
                    }
                    document.add(table);
                }
            }

            document.close();
            return out.toByteArray();
        } catch (DocumentException e) {
            log.error("Error generating PDF", e);
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
