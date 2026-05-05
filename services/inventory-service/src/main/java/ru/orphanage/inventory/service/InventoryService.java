package ru.orphanage.inventory.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.orphanage.inventory.dto.InventoryMapper;
import ru.orphanage.inventory.dto.InventoryRequest;
import ru.orphanage.inventory.dto.InventoryResponse;
import ru.orphanage.inventory.entity.InventoryItem;
import ru.orphanage.inventory.entity.ItemCategory;
import ru.orphanage.inventory.entity.ItemStatus;
import ru.orphanage.inventory.repository.InventoryRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository repository;
    private final InventoryMapper mapper;

    public Page<InventoryResponse> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    public Page<InventoryResponse> findByCategory(ItemCategory category, Pageable pageable) {
        return repository.findByCategory(category, pageable).map(mapper::toResponse);
    }

    public Page<InventoryResponse> findByStatus(ItemStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable).map(mapper::toResponse);
    }

    public List<InventoryResponse> findLowStock() {
        return repository.findLowStockItems().stream().map(mapper::toResponse).toList();
    }

    public InventoryResponse findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Позиция с id=" + id + " не найдена"));
    }

    @Transactional
    public InventoryResponse create(InventoryRequest request) {
        InventoryItem saved = repository.save(mapper.toEntity(request));
        log.info("Добавлена позиция инвентаря: id={}, название={}", saved.getId(), saved.getName());
        return mapper.toResponse(saved);
    }

    @Transactional
    public InventoryResponse update(Long id, InventoryRequest request) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Позиция с id=" + id + " не найдена"));
        mapper.updateEntityFromRequest(request, item);
        return mapper.toResponse(repository.save(item));
    }

    @Transactional
    public InventoryResponse adjustQuantity(Long id, int delta) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Позиция с id=" + id + " не найдена"));
        int newQty = item.getQuantity() + delta;
        if (newQty < 0) throw new RuntimeException("Количество не может быть отрицательным");
        item.setQuantity(newQty);
        if (newQty == 0) item.setStatus(ru.orphanage.inventory.entity.ItemStatus.OUT_OF_STOCK);
        else if (item.getMinQuantity() != null && newQty <= item.getMinQuantity())
            item.setStatus(ru.orphanage.inventory.entity.ItemStatus.LOW_STOCK);
        else item.setStatus(ru.orphanage.inventory.entity.ItemStatus.IN_STOCK);
        return mapper.toResponse(repository.save(item));
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
