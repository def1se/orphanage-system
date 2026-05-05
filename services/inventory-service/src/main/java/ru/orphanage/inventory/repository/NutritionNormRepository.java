package ru.orphanage.inventory.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.inventory.entity.NutritionNorm;

public interface NutritionNormRepository extends JpaRepository<NutritionNorm, Long> {
}
