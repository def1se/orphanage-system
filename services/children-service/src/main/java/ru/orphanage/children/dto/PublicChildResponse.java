package ru.orphanage.children.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicChildResponse {
    private Long id;
    private String firstName;
    private Integer age;
    private String shortDescription;
    private String photoUrl;
}
