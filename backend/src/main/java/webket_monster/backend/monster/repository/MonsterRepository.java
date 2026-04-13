package webket_monster.backend.monster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.monster.domain.Monster;

public interface MonsterRepository extends JpaRepository<Monster, Long> {
}
