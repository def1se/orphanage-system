package ru.orphanage.staff.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.staff.entity.StaffMember;
import ru.orphanage.staff.entity.StaffPosition;
import ru.orphanage.staff.entity.StaffStatus;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<StaffMember, Long> {
    Page<StaffMember> findByStatus(StaffStatus status, Pageable pageable);
    Page<StaffMember> findByPosition(StaffPosition position, Pageable pageable);
    Optional<StaffMember> findByKeycloakUserId(String keycloakUserId);
}
