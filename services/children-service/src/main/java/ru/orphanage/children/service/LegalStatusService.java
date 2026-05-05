package ru.orphanage.children.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.orphanage.children.dto.LegalStatusDto;
import ru.orphanage.children.dto.LegalStatusMapper;
import ru.orphanage.children.repository.LegalStatusRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LegalStatusService {

    private final LegalStatusRepository legalStatusRepository;
    private final LegalStatusMapper legalStatusMapper;

    public List<LegalStatusDto> getByChildId(Long childId) {
        return legalStatusMapper.toDtoList(legalStatusRepository.findByChildId(childId));
    }
}
