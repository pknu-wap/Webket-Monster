package webket_monster.backend.quest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.quest.domain.Quest;
import webket_monster.backend.quest.domain.QuestType;
import webket_monster.backend.quest.domain.UserQuest;
import webket_monster.backend.quest.dto.QuestResponseDto;
import webket_monster.backend.quest.dto.QuestRewardResponseDto;
import webket_monster.backend.quest.dto.UserQuestResponseDto;
import webket_monster.backend.quest.repository.QuestRepository;
import webket_monster.backend.quest.repository.UserQuestRepository;
import webket_monster.backend.sitevisit.domain.UserSiteVisit;
import webket_monster.backend.sitevisit.repository.UserSiteVisitRepository;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestRepository questRepository;
    private final UserQuestRepository userQuestRepository;
    private final UserRepository userRepository;
    private final UserSiteVisitRepository userSiteVisitRepository;

    @Transactional(readOnly = true)
    public List<QuestResponseDto> getAllQuests() {
        return questRepository.findAll()
                .stream()
                .map(QuestResponseDto::from)
                .toList();
    }

    @Transactional
    public List<UserQuestResponseDto> getMyQuests(Long userId) {
        User user = findUser(userId);

        List<Quest> quests = questRepository.findAll();

        for (Quest quest : quests) {
            userQuestRepository.findByUserAndQuest(user, quest)
                    .orElseGet(() -> userQuestRepository.save(new UserQuest(user, quest)));
        }

        return userQuestRepository.findByUser(user)
                .stream()
                .map(UserQuestResponseDto::from)
                .toList();
    }

    @Transactional
    public QuestRewardResponseDto receiveReward(Long userId, Long questId) {
        User user = findUser(userId);

        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 퀘스트입니다."));

        UserQuest userQuest = userQuestRepository.findByUserAndQuest(user, quest)
                .orElseThrow(() -> new IllegalArgumentException("유저 퀘스트가 존재하지 않습니다."));

        userQuest.receiveReward();

        return QuestRewardResponseDto.from(userQuest);
    }

    @Transactional
    public void increaseQuestProgress(Long userId, QuestType questType, int amount) {
        User user = findUser(userId);

        List<Quest> quests = questRepository.findByQuestType(questType);

        for (Quest quest : quests) {
            UserQuest userQuest = userQuestRepository.findByUserAndQuest(user, quest)
                    .orElseGet(() -> userQuestRepository.save(new UserQuest(user, quest)));

            userQuest.increaseProgress(amount);
        }
    }

    @Transactional
    public void updateSiteVisitQuests(Long userId) {
        User user = findUser(userId);

        List<UserSiteVisit> siteVisits = userSiteVisitRepository.findByUser(user);

        updateVisitAllMonsterSitesQuest(user, siteVisits);
        updateVisitAiSitesQuest(user, siteVisits);
        updateVisitSpecificSiteCountQuest(user, siteVisits);
    }

    private void updateVisitAllMonsterSitesQuest(
            User user,
            List<UserSiteVisit> siteVisits
    ) {
        List<String> requiredSites = List.of(
                "CHATGPT",
                "GEMINI",
                "GOOGLE",
                "YOUTUBE",
                "NAVER",
                "NAMUWIKI",
                "PKNU"
        );

        long visitedCount = siteVisits.stream()
                .map(UserSiteVisit::getSiteName)
                .filter(requiredSites::contains)
                .distinct()
                .count();

        updateQuestProgress(
                user,
                QuestType.VISIT_ALL_MONSTER_SITES,
                (int) visitedCount
        );
    }

    private void updateVisitAiSitesQuest(
            User user,
            List<UserSiteVisit> siteVisits
    ) {
        List<String> aiSites = List.of(
                "CHATGPT",
                "GROK",
                "CLAUDE",
                "GEMINI",
                "PERPLEXITY"
        );

        long visitedCount = siteVisits.stream()
                .map(UserSiteVisit::getSiteName)
                .filter(aiSites::contains)
                .distinct()
                .count();

        updateQuestProgress(
                user,
                QuestType.VISIT_AI_SITES,
                (int) visitedCount
        );
    }

    private void updateVisitSpecificSiteCountQuest(
            User user,
            List<UserSiteVisit> siteVisits
    ) {
        int totalProgress = siteVisits.stream()
                .filter(site ->
                        site.getSiteName().equals("GEMINI")
                                || site.getSiteName().equals("YOUTUBE")
                                || site.getSiteName().equals("GOOGLE")
                )
                .mapToInt(site -> Math.min(site.getVisitCount(), 10))
                .sum();

        updateQuestProgress(
                user,
                QuestType.VISIT_SPECIFIC_SITE_COUNT,
                totalProgress
        );
    }

    private void updateQuestProgress(
            User user,
            QuestType questType,
            int progress
    ) {
        List<Quest> quests = questRepository.findByQuestType(questType);

        for (Quest quest : quests) {
            UserQuest userQuest = userQuestRepository.findByUserAndQuest(user, quest)
                    .orElseGet(() -> userQuestRepository.save(new UserQuest(user, quest)));

            userQuest.updateProgress(progress);
        }
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
    }
}