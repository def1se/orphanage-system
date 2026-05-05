package ru.orphanage.adoption.dto;

import org.mapstruct.*;
import ru.orphanage.adoption.entity.AdoptionRequest;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdoptionMapper {
    AdoptionResponseDto toResponse(AdoptionRequest request);
    AdoptionRequest toEntity(AdoptionRequestDto dto);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(AdoptionRequestDto dto, @MappingTarget AdoptionRequest entity);
}
