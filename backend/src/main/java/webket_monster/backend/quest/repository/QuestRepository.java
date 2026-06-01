package webket_monster.backend.quest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.quest.domain.Quest;

public interface QuestRepository extends JpaRepository<Quest, String> {
}
