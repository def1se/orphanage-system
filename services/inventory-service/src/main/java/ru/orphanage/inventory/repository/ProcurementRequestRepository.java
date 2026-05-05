package ru.orphanage.inventory.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.inventory.entity.ProcurementRequest;

public interface ProcurementRequestRepository extends JpaRepository<ProcurementRequest, Long> {
}
