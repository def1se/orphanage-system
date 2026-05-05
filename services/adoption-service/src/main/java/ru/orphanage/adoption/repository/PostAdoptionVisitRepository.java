package ru.orphanage.adoption.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.adoption.entity.PostAdoptionVisit;
import java.util.List;

public interface PostAdoptionVisitRepository extends JpaRepository<PostAdoptionVisit, Long> {
    List<PostAdoptionVisit> findByAdoptionRequestId(Long adoptionRequestId);
}
