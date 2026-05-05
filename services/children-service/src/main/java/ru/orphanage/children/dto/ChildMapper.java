package ru.orphanage.children.dto;

import org.mapstruct.*;
import ru.orphanage.children.entity.Child;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ChildMapper {

    ChildResponse toResponse(Child child);

    Child toEntity(ChildRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(ChildRequest request, @MappingTarget Child child);
}
