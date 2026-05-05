package ru.orphanage.inventory.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.orphanage.inventory.entity.InventoryItem;
import ru.orphanage.inventory.entity.ItemCategory;
import ru.orphanage.inventory.entity.ItemStatus;

import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    Page<InventoryItem> findByCategory(ItemCategory category, Pageable pageable);
    Page<InventoryItem> findByStatus(ItemStatus status, Pageable pageable);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.minQuantity AND i.minQuantity IS NOT NULL")
    List<InventoryItem> findLowStockItems();
}
