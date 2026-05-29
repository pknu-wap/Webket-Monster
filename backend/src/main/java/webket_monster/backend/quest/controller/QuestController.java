package webket_monster.backend.quest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import webket_monster.backend.quest.dto.QuestResponseDto;
import webket_monster.backend.quest.dto.QuestRewardResponseDto;
import webket_monster.backend.quest.dto.UserQuestResponseDto;
import webket_monster.backend.quest.service.QuestService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuestController {

    private final QuestService questService;

    @GetMapping("/quests")
    public List<QuestResponseDto> getAllQuests() {
        return questService.getAllQuests();
    }

    @GetMapping("/users/me/quests")
    public List<UserQuestResponseDto> getMyQuests() {
        Long userId = 1L; // TODO: 로그인 구현 후 인증 유저 ID로 교체
        return questService.getMyQuests(userId);
    }

    @PostMapping("/quests/{questId}/reward")
    public QuestRewardResponseDto receiveReward(@PathVariable Long questId) {
        Long userId = 1L; // TODO: 로그인 구현 후 인증 유저 ID로 교체
        return questService.receiveReward(userId, questId);
    }
}