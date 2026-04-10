package webket_monster.backend.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.item.entity.UserItem;

import java.util.List;

public interface UserItemRepository extends JpaRepository<UserItem, Long> {
    List<UserItem> findByUserId(Long userId);
    long countByUserId(Long userId);
}