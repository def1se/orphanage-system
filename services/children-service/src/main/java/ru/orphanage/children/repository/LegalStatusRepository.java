package ru.orphanage.children.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.children.entity.LegalStatus;
import java.util.List;

public interface LegalStatusRepository extends JpaRepository<LegalStatus, Long> {
    List<LegalStatus> findByChildId(Long childId);
}
