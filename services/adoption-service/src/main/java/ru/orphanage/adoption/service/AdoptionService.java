package ru.orphanage.adoption.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.orphanage.adoption.dto.AdoptionMapper;
import ru.orphanage.adoption.dto.AdoptionRequestDto;
import ru.orphanage.adoption.dto.AdoptionResponseDto;
import ru.orphanage.adoption.entity.AdoptionRequest;
import ru.orphanage.adoption.entity.AdoptionStatus;
import ru.orphanage.adoption.messaging.AdoptionEventPublisher;
import ru.orphanage.adoption.messaging.AdoptionStatusChangedEvent;
import ru.orphanage.adoption.repository.AdoptionRequestRepository;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdoptionService {

    private final AdoptionRequestRepository repository;
    private final AdoptionMapper mapper;
    private final AdoptionEventPublisher eventPublisher;

    public Page<AdoptionResponseDto> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    public Page<AdoptionResponseDto> findByStatus(AdoptionStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable).map(mapper::toResponse);
    }

    public AdoptionResponseDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Заявка с id=" + id + " не найдена"));
    }

    @Transactional
    public AdoptionResponseDto create(AdoptionRequestDto dto) {
        AdoptionRequest entity = mapper.toEntity(dto);
        AdoptionRequest saved = repository.save(entity);
        log.info("Создана заявка на усыновление: id={}", saved.getId());
        return mapper.toResponse(saved);
    }

    /**
     * Обновляет статус заявки и публикует событие в RabbitMQ.
     */
    @Transactional
    public AdoptionResponseDto updateStatus(Long id, AdoptionStatus newStatus) {
        AdoptionRequest entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заявка с id=" + id + " не найдена"));

        String previousStatus = entity.getStatus().name();
        entity.setStatus(newStatus);
        AdoptionRequest saved = repository.save(entity);

        // Публикуем асинхронное событие → notification-service
        eventPublisher.publishStatusChanged(new AdoptionStatusChangedEvent(
                saved.getId(),
                saved.getChildId(),
                saved.getApplicantEmail(),
                saved.getApplicantFirstName(),
                newStatus.name(),
                previousStatus
        ));

        return mapper.toResponse(saved);
    }

    @Transactional
    public AdoptionResponseDto update(Long id, AdoptionRequestDto dto) {
        AdoptionRequest entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заявка с id=" + id + " не найдена"));
        mapper.updateEntityFromDto(dto, entity);
        return mapper.toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
