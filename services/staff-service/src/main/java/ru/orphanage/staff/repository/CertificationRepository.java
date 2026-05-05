package ru.orphanage.staff.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.staff.entity.Certification;
import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByStaffId(Long staffId);
}
