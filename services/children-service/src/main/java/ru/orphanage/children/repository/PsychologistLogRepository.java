package ru.orphanage.children.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.children.entity.PsychologistLog;
import java.util.List;

public interface PsychologistLogRepository extends JpaRepository<PsychologistLog, Long> {
    List<PsychologistLog> findByChildId(Long childId);
}
