package webket_monster.backend.sitevisit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.quest.service.QuestService;
import webket_monster.backend.sitevisit.domain.UserSiteVisit;
import webket_monster.backend.sitevisit.dto.SiteVisitRequestDto;
import webket_monster.backend.sitevisit.dto.SiteVisitResponseDto;
import webket_monster.backend.sitevisit.repository.UserSiteVisitRepository;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class SiteVisitService {

    private final UserRepository userRepository;
    private final UserSiteVisitRepository userSiteVisitRepository;
    private final QuestService questService;

    @Transactional
    public SiteVisitResponseDto recordVisit(Long userId, SiteVisitRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        String siteName = requestDto.getSiteName().toUpperCase();

        UserSiteVisit siteVisit = userSiteVisitRepository
                .findByUserAndSiteName(user, siteName)
                .orElseGet(() -> new UserSiteVisit(user, siteName));

        siteVisit.increaseVisitCount();

        UserSiteVisit savedSiteVisit = userSiteVisitRepository.save(siteVisit);

        questService.updateSiteVisitQuests(userId);

        boolean action1Triggered = savedSiteVisit.isAction1Triggered();

        String triggeredAction = action1Triggered ? "ACTION1" : "NONE";

        return SiteVisitResponseDto.builder()
                .siteName(savedSiteVisit.getSiteName())
                .visitCount(savedSiteVisit.getVisitCount())
                .action1Triggered(action1Triggered)
                .triggeredAction(triggeredAction)
                .message(action1Triggered
                        ? "ACTION1 트리거가 발생했습니다."
                        : "사이트 방문 기록이 저장되었습니다.")
                .build();
    }
}