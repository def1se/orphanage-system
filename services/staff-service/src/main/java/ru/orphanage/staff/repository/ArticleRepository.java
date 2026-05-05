package ru.orphanage.staff.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.orphanage.staff.entity.Article;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Page<Article> findByIsPublishedTrue(Pageable pageable);
    List<Article> findByIsPublishedTrueOrderByPublishedAtDesc();
    Page<Article> findByCategoryAndIsPublishedTrue(String category, Pageable pageable);
}
