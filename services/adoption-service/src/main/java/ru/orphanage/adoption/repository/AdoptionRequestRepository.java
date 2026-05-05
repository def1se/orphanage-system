package ru.orphanage.adoption.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.adoption.entity.AdoptionRequest;
import ru.orphanage.adoption.entity.AdoptionStatus;

import java.util.List;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    Page<AdoptionRequest> findByStatus(AdoptionStatus status, Pageable pageable);
    List<AdoptionRequest> findByChildId(Long childId);
    List<AdoptionRequest> findByApplicantEmail(String email);
}
