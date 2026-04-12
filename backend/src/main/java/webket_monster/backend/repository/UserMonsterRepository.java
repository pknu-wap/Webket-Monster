package webket_monster.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.domain.UserMonster;

import java.util.Optional;

public interface UserMonsterRepository extends JpaRepository<UserMonster, Long> {
    Optional<UserMonster> findByUserIdAndMonsterId(Long userId, Long monsterId);
}
