package webket_monster.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.domain.Monster;

public interface MonsterRepository extends JpaRepository<Monster, Long> {
}
