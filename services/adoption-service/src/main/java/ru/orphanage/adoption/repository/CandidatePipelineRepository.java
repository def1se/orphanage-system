package ru.orphanage.adoption.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.adoption.entity.CandidatePipeline;

public interface CandidatePipelineRepository extends JpaRepository<CandidatePipeline, Long> {
}
