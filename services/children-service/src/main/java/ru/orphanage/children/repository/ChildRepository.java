package ru.orphanage.children.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.orphanage.children.entity.Child;
import ru.orphanage.children.entity.ChildStatus;

import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {

    Page<Child> findByStatus(ChildStatus status, Pageable pageable);

    List<Child> findByResponsibleEducatorId(Long educatorId);

    Page<Child> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName, Pageable pageable);
}
