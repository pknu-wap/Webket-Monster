package webket_monster.backend.quest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.quest.domain.Quest;
import webket_monster.backend.quest.domain.UserQuest;
import webket_monster.backend.quest.domain.UserDomainVisit;
import webket_monster.backend.quest.dto.*;
import webket_monster.backend.quest.repository.QuestRepository;
import webket_monster.backend.quest.repository.UserQuestRepository;
import webket_monster.backend.quest.repository.UserDomainVisitRepository;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.repository.UserRepository;
import webket_monster.backend.usermonster.repository.UserMonsterRepository;
import webket_monster.backend.usermonster.domain.UserMonster;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestService {

    private final QuestRepository questRepository;
    private final UserQuestRepository userQuestRepository;
    private final UserDomainVisitRepository userDomainVisitRepository;
    private final UserRepository userRepository;
    private final UserMonsterRepository userMonsterRepository;

    /** 사용자의 퀘스트 목록 조회 (진행도 동적 재계산) */
    public List<UserQuestResponseDto> getUserQuests(Long userId) {
        User user = findUser(userId);

        List<Quest> allQuests = questRepository.findAll();
        List<UserMonster> caughtMonsters = userMonsterRepository.findByUserId(userId);
        List<UserDomainVisit> domainVisits = userDomainVisitRepository.findByUserId(userId);

        Map<String, Integer> visitMap = domainVisits.stream()
                .collect(Collectors.toMap(UserDomainVisit::getDomain, UserDomainVisit::getVisitCount));

        Set<String> visitedDomains = domainVisits.stream()
                .filter(v -> v.getVisitCount() > 0)
                .map(UserDomainVisit::getDomain)
                .collect(Collectors.toSet());

        List<UserQuestResponseDto> responseList = new ArrayList<>();

        for (Quest quest : allQuests) {
            UserQuest uq = userQuestRepository.findByUserIdAndQuestId(userId, quest.getId())
                    .orElseGet(() -> {
                        UserQuest newUq = UserQuest.builder()
                                .userId(userId)
                                .questId(quest.getId())
                                .currentCount(0)
                                .completed(false)
                                .claimed(false)
                                .build();
                        return userQuestRepository.save(newUq);
                    });

            // 일일 퀘스트: 날짜가 바뀌면 자동 초기화
            if ("daily".equals(quest.getType())) {
                if (uq.resetIfDailyExpired()) {
                    userQuestRepository.save(uq);
                }
            }

            int calculatedCount = calculateQuestProgress(quest.getId(), user, caughtMonsters, visitedDomains, visitMap);

            uq.updateProgress(calculatedCount, quest.getTargetCount());
            userQuestRepository.save(uq);

            responseList.add(new UserQuestResponseDto(
                    quest.getId(),
                    quest.getTitle(),
                    quest.getDescription(),
                    quest.getType(),
                    quest.getCategory(),
                    quest.getTargetCount(),
                    uq.getCurrentCount(),
                    uq.getCompleted(),
                    uq.getClaimed(),
                    new UserQuestResponseDto.RewardDto(quest.getRewardExpPotions(), quest.getRewardEvolutionStones())
            ));
        }

        return responseList;
    }

    /** 완료된 퀘스트 보상 수령 */
    public QuestClaimRewardResponseDto claimQuestReward(Long userId, String questId) {
        findUser(userId); // 유저 존재 확인

        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new IllegalArgumentException("퀘스트를 찾을 수 없습니다."));

        UserQuest uq = userQuestRepository.findByUserIdAndQuestId(userId, questId)
                .orElseThrow(() -> new IllegalArgumentException("사용자의 퀘스트 진행 내역을 찾을 수 없습니다."));

        if (!uq.getCompleted()) {
            return new QuestClaimRewardResponseDto(false, "아직 완료되지 않은 퀘스트입니다.", 0, 0);
        }
        if (uq.getClaimed()) {
            return new QuestClaimRewardResponseDto(false, "이미 보상을 받았습니다.", 0, 0);
        }

        uq.claim();
        userQuestRepository.save(uq);

        User user = findUser(userId);
        user.addItems(quest.getRewardExpPotions(), quest.getRewardEvolutionStones());
        userRepository.save(user);

        String rewardMsg = "보상을 획득했습니다: ";
        List<String> parts = new ArrayList<>();
        if (quest.getRewardExpPotions() > 0) parts.add("🧪 EXP 물약 " + quest.getRewardExpPotions() + "개");
        if (quest.getRewardEvolutionStones() > 0) parts.add("💎 진화의 돌 " + quest.getRewardEvolutionStones() + "개");
        rewardMsg += String.join(", ", parts);

        return new QuestClaimRewardResponseDto(true, rewardMsg, quest.getRewardExpPotions(), quest.getRewardEvolutionStones());
    }

    /**
     * 사용자 활동 동기화 (페이지 방문 + 먹이 횟수)
     * triggerAction1: 활성 몬스터 홈 도메인 10회 방문 → 몬스터 액션 발동
     * triggerAction2: 먹이주기 10회마다 → 먹이 이펙트 발동
     */
    public SyncActivityResponseDto syncActivity(Long userId, SyncActivityRequestDto request) {
        User user = findUser(userId);

        boolean triggerAction1 = false;
        boolean triggerAction2 = false;

        // 먹이주기 처리
        if (request.getFeedIncrement() > 0) {
            for (int i = 0; i < request.getFeedIncrement(); i++) {
                user.incrementFeeds();
                if (user.getTotalFeeds() % 10 == 0) {
                    triggerAction2 = true;
                }
            }
        }

        // 페이지 방문 처리
        if (request.getHostname() != null && !request.getHostname().trim().isEmpty()) {
            String domain = normalizeDomain(request.getHostname());
            if (domain != null) {
                UserDomainVisit visit = userDomainVisitRepository.findByUserIdAndDomain(userId, domain)
                        .orElseGet(() -> {
                            UserDomainVisit newVisit = UserDomainVisit.builder()
                                    .userId(userId)
                                    .domain(domain)
                                    .visitCount(0)
                                    .build();
                            return userDomainVisitRepository.save(newVisit);
                        });
                visit.incrementCount();
                userDomainVisitRepository.save(visit);

                // Action1 트리거: 활성 몬스터의 홈 도메인 10회 방문
                List<UserMonster> activeMonsters = userMonsterRepository.findByUserId(userId).stream()
                        .filter(UserMonster::getIsActive)
                        .collect(Collectors.toList());

                if (!activeMonsters.isEmpty()) {
                    UserMonster active = activeMonsters.get(0);
                    String homeDomain = getMonsterHomeDomain(active.getMonster().getId());
                    if (domain.equals(homeDomain)) {
                        user.incrementActiveHomeVisits();
                        if (user.getActiveHomeVisits() >= 10) {
                            user.resetActiveHomeVisits();
                            triggerAction1 = true;
                        }
                    }
                }
            }
        }

        userRepository.save(user);
        return new SyncActivityResponseDto(triggerAction1, triggerAction2);
    }

    /** 사용자 인벤토리(아이템) 조회 */
    @Transactional(readOnly = true)
    public UserInventoryResponseDto getUserInventory(Long userId) {
        User user = findUser(userId);
        return new UserInventoryResponseDto(user.getExpPotions(), user.getEvolutionStones());
    }

    // ─────────────────────── Private Helpers ───────────────────────

    private int calculateQuestProgress(
            String questId,
            User user,
            List<UserMonster> caughtMonsters,
            Set<String> visitedDomains,
            Map<String, Integer> visitMap
    ) {
        switch (questId) {
            case "feed_10":
                return Math.min(10, user.getTotalFeeds());
            case "feed_100":
                return Math.min(100, user.getTotalFeeds());
            case "visit_all_8": {
                List<String> themedSites = Arrays.asList(
                        "pknu.ac.kr", "google.com", "naver.com", "youtube.com",
                        "github.com", "linkedin.com", "namu.wiki", "chatgpt.com"
                );
                long count = themedSites.stream().filter(visitedDomains::contains).count();
                return (int) Math.min(8, count);
            }
            case "visit_ai_5": {
                List<String> aiSites = Arrays.asList(
                        "chatgpt.com", "grok.com", "claude.ai", "gemini.google.com", "perplexity.ai"
                );
                long count = aiSites.stream().filter(visitedDomains::contains).count();
                return (int) Math.min(5, count);
            }
            case "visit_gemini_yt_google_10": {
                int gVisits = visitMap.getOrDefault("google.com", 0);
                int ytVisits = visitMap.getOrDefault("youtube.com", 0);
                int gemVisits = visitMap.getOrDefault("gemini.google.com", 0);
                int passed = 0;
                if (gVisits >= 10) passed++;
                if (ytVisits >= 10) passed++;
                if (gemVisits >= 10) passed++;
                return passed;
            }
            case "obtain_naver_namuwiki": {
                boolean hasNaver = caughtMonsters.stream().anyMatch(cm -> {
                    long id = cm.getMonster().getId();
                    return id >= 7 && id <= 9;
                });
                boolean hasNamu = caughtMonsters.stream().anyMatch(cm -> {
                    long id = cm.getMonster().getId();
                    return id >= 19 && id <= 21;
                });
                return (hasNaver && hasNamu) ? 1 : 0;
            }
            case "obtain_all_monsters": {
                long familiesCount = 0;
                for (int i = 0; i < 8; i++) {
                    long minId = i * 3 + 1;
                    long maxId = i * 3 + 3;
                    boolean hasFamilyMember = caughtMonsters.stream().anyMatch(cm -> {
                        long id = cm.getMonster().getId();
                        return id >= minId && id <= maxId;
                    });
                    if (hasFamilyMember) familiesCount++;
                }
                return (int) Math.min(8, familiesCount);
            }
            case "obtain_pknu_final": {
                boolean hasPknuFinal = caughtMonsters.stream()
                        .anyMatch(cm -> cm.getMonster().getId() == 3L);
                return hasPknuFinal ? 1 : 0;
            }
            default:
                return 0;
        }
    }

    private String normalizeDomain(String hostname) {
        String host = hostname.toLowerCase();
        if (host.contains("pknu.ac.kr")) return "pknu.ac.kr";
        if (host.contains("gemini.google.com")) return "gemini.google.com";
        if (host.contains("google.com") || host.contains("google.co.kr")) return "google.com";
        if (host.contains("naver.com")) return "naver.com";
        if (host.contains("youtube.com")) return "youtube.com";
        if (host.contains("github.com")) return "github.com";
        if (host.contains("linkedin.com")) return "linkedin.com";
        if (host.contains("namu.wiki")) return "namu.wiki";
        if (host.contains("chatgpt.com") || host.contains("openai.com")) return "chatgpt.com";
        if (host.contains("grok.com") || host.equals("x.com")) return "grok.com";
        if (host.contains("claude.ai")) return "claude.ai";
        if (host.contains("perplexity.ai")) return "perplexity.ai";
        return null;
    }

    private String getMonsterHomeDomain(Long monsterId) {
        if (monsterId >= 1 && monsterId <= 3) return "pknu.ac.kr";
        if (monsterId >= 4 && monsterId <= 6) return "google.com";
        if (monsterId >= 7 && monsterId <= 9) return "naver.com";
        if (monsterId >= 10 && monsterId <= 12) return "youtube.com";
        if (monsterId >= 13 && monsterId <= 15) return "github.com";
        if (monsterId >= 16 && monsterId <= 18) return "linkedin.com";
        if (monsterId >= 19 && monsterId <= 21) return "namu.wiki";
        if (monsterId >= 22 && monsterId <= 24) return "chatgpt.com";
        return null;
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
}
