package webket_monster.backend.quest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import webket_monster.backend.quest.dto.*;
import webket_monster.backend.quest.service.QuestService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class QuestController {

    private final QuestService questService;

    @GetMapping("/{userId}/quests")
    public ResponseEntity<List<UserQuestResponseDto>> getUserQuests(@PathVariable Long userId) {
        return ResponseEntity.ok(questService.getUserQuests(userId));
    }

    @PostMapping("/{userId}/quests/{questId}/claim")
    public ResponseEntity<QuestClaimRewardResponseDto> claimQuestReward(
            @PathVariable Long userId,
            @PathVariable String questId) {
        return ResponseEntity.ok(questService.claimQuestReward(userId, questId));
    }

    @PostMapping("/{userId}/sync-activity")
    public ResponseEntity<SyncActivityResponseDto> syncActivity(
            @PathVariable Long userId,
            @RequestBody SyncActivityRequestDto request) {
        return ResponseEntity.ok(questService.syncActivity(userId, request));
    }

    @GetMapping("/{userId}/inventory")
    public ResponseEntity<UserInventoryResponseDto> getUserInventory(@PathVariable Long userId) {
        return ResponseEntity.ok(questService.getUserInventory(userId));
    }
}
