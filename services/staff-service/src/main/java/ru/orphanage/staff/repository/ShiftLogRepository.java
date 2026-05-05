package ru.orphanage.staff.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.staff.entity.ShiftLog;
import java.util.List;

public interface ShiftLogRepository extends JpaRepository<ShiftLog, Long> {
    List<ShiftLog> findByShiftScheduleId(Long shiftScheduleId);
}
