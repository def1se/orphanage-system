package ru.orphanage.staff.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.orphanage.staff.dto.StaffMapper;
import ru.orphanage.staff.dto.StaffRequest;
import ru.orphanage.staff.dto.StaffResponse;
import ru.orphanage.staff.entity.StaffMember;
import ru.orphanage.staff.entity.StaffPosition;
import ru.orphanage.staff.entity.StaffStatus;
import ru.orphanage.staff.repository.StaffRepository;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StaffService {

    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;

    public Page<StaffResponse> findAll(Pageable pageable) {
        return staffRepository.findAll(pageable).map(staffMapper::toResponse);
    }

    public Page<StaffResponse> findByStatus(StaffStatus status, Pageable pageable) {
        return staffRepository.findByStatus(status, pageable).map(staffMapper::toResponse);
    }

    public Page<StaffResponse> findByPosition(StaffPosition position, Pageable pageable) {
        return staffRepository.findByPosition(position, pageable).map(staffMapper::toResponse);
    }

    public StaffResponse findById(Long id) {
        return staffRepository.findById(id)
                .map(staffMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Сотрудник с id=" + id + " не найден"));
    }

    @Transactional
    public StaffResponse create(StaffRequest request) {
        StaffMember member = staffMapper.toEntity(request);
        StaffMember saved = staffRepository.save(member);
        log.info("Создан сотрудник: id={}, должность={}", saved.getId(), saved.getPosition());
        return staffMapper.toResponse(saved);
    }

    @Transactional
    public StaffResponse update(Long id, StaffRequest request) {
        StaffMember member = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Сотрудник с id=" + id + " не найден"));
        staffMapper.updateEntityFromRequest(request, member);
        return staffMapper.toResponse(staffRepository.save(member));
    }

    @Transactional
    public void delete(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new RuntimeException("Сотрудник с id=" + id + " не найден");
        }
        staffRepository.deleteById(id);
    }
}
