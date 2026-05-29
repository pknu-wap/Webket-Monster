package webket_monster.backend.quest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.quest.domain.Quest;
import webket_monster.backend.quest.domain.QuestType;

import java.util.List;

public interface QuestRepository extends JpaRepository<Quest, Long> {

    List<Quest> findByQuestType(QuestType questType);
}