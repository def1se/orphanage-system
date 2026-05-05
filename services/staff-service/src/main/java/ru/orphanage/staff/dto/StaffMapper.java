package ru.orphanage.staff.dto;

import org.mapstruct.*;
import ru.orphanage.staff.entity.StaffMember;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StaffMapper {
    StaffResponse toResponse(StaffMember member);
    StaffMember toEntity(StaffRequest request);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(StaffRequest request, @MappingTarget StaffMember member);
}
