package webket_monster.backend.quest.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import webket_monster.backend.quest.domain.Quest;
import webket_monster.backend.quest.domain.QuestType;
import webket_monster.backend.quest.domain.RewardType;
import webket_monster.backend.quest.repository.QuestRepository;

@Component
@RequiredArgsConstructor
public class QuestDataInitializer implements CommandLineRunner {

    private final QuestRepository questRepository;

    @Override
    public void run(String... args) {
        if (questRepository.count() > 0) {
            return;
        }

        questRepository.save(new Quest(
                "먹이 10번 주기",
                "몬스터에게 먹이를 10번 주세요.",
                QuestType.FEED_COUNT,
                10,
                RewardType.EXP_POTION,
                100
        ));

        questRepository.save(new Quest(
                "먹이 100번 주기",
                "몬스터에게 먹이를 100번 주세요.",
                QuestType.FEED_COUNT,
                100,
                RewardType.EVOLUTION_STONE,
                2
        ));

        questRepository.save(new Quest(
                "몬스터 등장 사이트 정복",
                "몬스터가 등장할 수 있는 7개 사이트를 모두 방문하세요.",
                QuestType.VISIT_ALL_MONSTER_SITES,
                7,
                RewardType.EVOLUTION_STONE,
                1
        ));

        questRepository.save(new Quest(
                "AI 사이트 탐험가",
                "ChatGPT, Grok, Claude, Gemini, Perplexity를 모두 방문하세요.",
                QuestType.VISIT_AI_SITES,
                5,
                RewardType.EVOLUTION_STONE,
                3
        ));

        questRepository.save(new Quest(
                "주요 사이트 단골 방문자",
                "Gemini, YouTube, Google을 각각 10번 방문하세요.",
                QuestType.VISIT_SPECIFIC_SITE_COUNT,
                30,
                RewardType.EVOLUTION_STONE,
                3
        ));

        questRepository.save(new Quest(
                "네이버몬과 나무위키몬 수집",
                "네이버몬과 나무위키몬을 획득하세요.",
                QuestType.COLLECT_SPECIFIC_MONSTERS,
                2,
                RewardType.EVOLUTION_STONE,
                1
        ));

        questRepository.save(new Quest(
                "몬스터 도감 완성",
                "모든 몬스터를 획득하세요.",
                QuestType.COLLECT_ALL_MONSTERS,
                1,
                RewardType.EVOLUTION_STONE,
                2
        ));

        questRepository.save(new Quest(
                "부경대 최종 진화 달성",
                "부경대 몬스터의 최종 진화 버전을 획득하세요.",
                QuestType.FINAL_EVOLUTION,
                1,
                RewardType.EVOLUTION_STONE,
                1
        ));
    }
}