package ru.orphanage.children.dto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.orphanage.children.entity.LegalStatus;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LegalStatusMapper {
    @Mapping(source = "child.id", target = "childId")
    LegalStatusDto toDto(LegalStatus entity);

    List<LegalStatusDto> toDtoList(List<LegalStatus> entities);
}
