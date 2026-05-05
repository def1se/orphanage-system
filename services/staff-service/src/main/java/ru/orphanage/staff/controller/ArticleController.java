package ru.orphanage.staff.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.orphanage.staff.entity.Article;
import ru.orphanage.staff.repository.ArticleRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleRepository articleRepository;

    @GetMapping("/public")
    public ResponseEntity<Page<Article>> getPublished(
            @PageableDefault(size = 10, sort = "publishedAt") Pageable pageable) {
        return ResponseEntity.ok(articleRepository.findByIsPublishedTrue(pageable));
    }

    @GetMapping("/public/latest")
    public ResponseEntity<List<Article>> getLatest() {
        return ResponseEntity.ok(articleRepository.findByIsPublishedTrueOrderByPublishedAtDesc()
                .stream().limit(6).toList());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<Page<Article>> getAll(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(articleRepository.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getById(@PathVariable Long id) {
        return articleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<Article> create(@RequestBody Article article) {
        if (Boolean.TRUE.equals(article.getIsPublished())) {
            article.setPublishedAt(LocalDateTime.now());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(articleRepository.save(article));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<Article> update(@PathVariable Long id, @RequestBody Article updated) {
        return articleRepository.findById(id).map(article -> {
            article.setTitle(updated.getTitle());
            article.setContent(updated.getContent());
            article.setSummary(updated.getSummary());
            article.setImageUrl(updated.getImageUrl());
            article.setCategory(updated.getCategory());
            article.setIsPublished(updated.getIsPublished());
            if (Boolean.TRUE.equals(updated.getIsPublished()) && article.getPublishedAt() == null) {
                article.setPublishedAt(LocalDateTime.now());
            }
            return ResponseEntity.ok(articleRepository.save(article));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        articleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
