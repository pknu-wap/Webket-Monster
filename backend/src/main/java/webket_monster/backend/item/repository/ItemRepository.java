package webket_monster.backend.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.item.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
}