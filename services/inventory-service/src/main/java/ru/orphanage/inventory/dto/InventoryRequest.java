package ru.orphanage.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.orphanage.inventory.entity.ItemCategory;
import ru.orphanage.inventory.entity.ItemStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InventoryRequest {
    @NotBlank  private String name;
    private String description;
    @NotNull   private ItemCategory category;
    @NotNull @Min(0) private Integer quantity;
    private String unit;
    private Integer minQuantity;
    private BigDecimal unitPrice;
    private LocalDate expiryDate;
    private String supplier;
    @NotNull   private ItemStatus status;
}
