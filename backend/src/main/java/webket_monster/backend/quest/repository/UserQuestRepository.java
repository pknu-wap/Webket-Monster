package webket_monster.backend.quest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import webket_monster.backend.quest.domain.UserQuest;

public interface UserQuestRepository extends JpaRepository<UserQuest, Long> {
    List<UserQuest> findByUserId(Long userId);
    Optional<UserQuest> findByUserIdAndQuestId(Long userId, String questId);
}
