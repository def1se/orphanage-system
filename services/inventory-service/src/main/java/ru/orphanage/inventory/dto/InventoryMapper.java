package ru.orphanage.inventory.dto;

import org.mapstruct.*;
import ru.orphanage.inventory.entity.InventoryItem;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InventoryMapper {
    InventoryResponse toResponse(InventoryItem item);
    InventoryItem toEntity(InventoryRequest request);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(InventoryRequest request, @MappingTarget InventoryItem item);
}
