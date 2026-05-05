package ru.orphanage.children.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.orphanage.children.dto.ChildMapper;
import ru.orphanage.children.dto.ChildRequest;
import ru.orphanage.children.dto.ChildResponse;
import ru.orphanage.children.dto.PublicChildResponse;
import ru.orphanage.children.entity.Child;
import ru.orphanage.children.entity.ChildStatus;
import ru.orphanage.children.repository.ChildRepository;
import java.time.LocalDate;
import java.time.Period;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChildService {

    private final ChildRepository childRepository;
    private final ChildMapper childMapper;

    public Page<ChildResponse> findAll(Pageable pageable) {
        return childRepository.findAll(pageable).map(childMapper::toResponse);
    }

    public Page<ChildResponse> findByStatus(ChildStatus status, Pageable pageable) {
        return childRepository.findByStatus(status, pageable).map(childMapper::toResponse);
    }

    public Page<ChildResponse> search(String query, Pageable pageable) {
        return childRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query, pageable)
                .map(childMapper::toResponse);
    }

    public ChildResponse findById(Long id) {
        return childRepository.findById(id)
                .map(childMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Ребёнок с id=" + id + " не найден"));
    }

    public Page<PublicChildResponse> getPublicChildren(Pageable pageable) {
        return childRepository.findAll(pageable)
                .map(child -> PublicChildResponse.builder()
                        .id(child.getId())
                        .firstName(child.getFirstName())
                        .age(child.getBirthDate() != null
                                ? Period.between(child.getBirthDate(), LocalDate.now()).getYears()
                                : 0)
                        .shortDescription(child.getDescription() != null
                                ? child.getDescription()
                                : "Добрый ребёнок, ищет заботливую семью.")
                        .photoUrl(child.getImageUrl())
                        .build());
    }

    @Transactional
    public ChildResponse create(ChildRequest request) {
        Child child = childMapper.toEntity(request);
        Child saved = childRepository.save(child);
        log.info("Создан новый ребёнок: id={}, имя={} {}", saved.getId(), saved.getFirstName(), saved.getLastName());
        return childMapper.toResponse(saved);
    }

    @Transactional
    public ChildResponse update(Long id, ChildRequest request) {
        Child child = childRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ребёнок с id=" + id + " не найден"));
        childMapper.updateEntityFromRequest(request, child);
        return childMapper.toResponse(childRepository.save(child));
    }

    @Transactional
    public void delete(Long id) {
        if (!childRepository.existsById(id)) {
            throw new RuntimeException("Ребёнок с id=" + id + " не найден");
        }
        childRepository.deleteById(id);
        log.info("Удалён ребёнок с id={}", id);
    }
}
