package ru.orphanage.inventory.dto;

import lombok.Data;
import ru.orphanage.inventory.entity.ItemCategory;
import ru.orphanage.inventory.entity.ItemStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InventoryResponse {
    private Long id;
    private String name;
    private String description;
    private ItemCategory category;
    private Integer quantity;
    private String unit;
    private Integer minQuantity;
    private BigDecimal unitPrice;
    private LocalDate expiryDate;
    private String supplier;
    private ItemStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isLowStock;

    public boolean isLowStock() {
        return minQuantity != null && quantity != null && quantity <= minQuantity;
    }
}
