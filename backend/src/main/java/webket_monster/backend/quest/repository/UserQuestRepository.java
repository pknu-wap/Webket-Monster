package webket_monster.backend.quest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.quest.domain.Quest;
import webket_monster.backend.quest.domain.UserQuest;
import webket_monster.backend.user.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserQuestRepository extends JpaRepository<UserQuest, Long> {

    List<UserQuest> findByUser(User user);

    Optional<UserQuest> findByUserAndQuest(User user, Quest quest);
}