package webket_monster.backend.quest.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import webket_monster.backend.quest.repository.QuestRepository;

/**
 * 퀘스트 초기 데이터는 data.sql에서 관리됩니다.
 * QuestDataInitializer는 비활성화 상태입니다.
 */
@Component
@RequiredArgsConstructor
public class QuestDataInitializer implements CommandLineRunner {

    private final QuestRepository questRepository;

    @Override
    public void run(String... args) {
        // 퀘스트 초기 데이터는 data.sql (ON CONFLICT DO UPDATE) 방식으로 관리됩니다.
        // 별도 초기화 로직 불필요.
    }
}