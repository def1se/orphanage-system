package ru.orphanage.staff.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.orphanage.staff.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
