package webket_monster.backend.usermonster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.monster.domain.Monster;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.usermonster.domain.UserMonster;

import java.util.List;
import java.util.Optional;

public interface UserMonsterRepository extends JpaRepository<UserMonster, Long> {

    List<UserMonster> findByUser(User user);

    Optional<UserMonster> findByUserAndMonster(User user, Monster monster);

    List<UserMonster> findByUserId(Long userId);
}