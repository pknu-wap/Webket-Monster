package webket_monster.backend.usermonster.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import webket_monster.backend.usermonster.dto.*;
import webket_monster.backend.usermonster.service.UserMonsterService;

@RestController
@RequiredArgsConstructor
public class UserMonsterController {

    private final UserMonsterService userMonsterService;

    @GetMapping("/user-monsters/{userMonsterId}")
    public ResponseEntity<UserMonsterResponseDto> getUserMonsterInfo(@PathVariable Long userMonsterId) {
        return ResponseEntity.ok(userMonsterService.getUserMonsterInfo(userMonsterId));
    }

    @GetMapping("/user-monsters/user/{userId}")
    public ResponseEntity<List<UserMonsterResponseDto>> getUserInventory(@PathVariable Long userId) {
        return ResponseEntity.ok(userMonsterService.getUserInventory(userId));
    }

    @PostMapping("/user-monsters/{userMonsterId}/levelup")
    public ResponseEntity<LevelUpResponseDto> levelUpMonster(@PathVariable Long userMonsterId) {
        return ResponseEntity.ok(userMonsterService.levelUpMonster(userMonsterId));
    }

    @PostMapping("/user-monsters/{userMonsterId}/action")
    public ResponseEntity<MonsterActionResponseDto> triggerMonsterAction(
            @PathVariable Long userMonsterId) {

        return ResponseEntity.ok(
                userMonsterService.triggerMonsterAction(userMonsterId)
        );
    }

    @PostMapping("/user-monsters/{userMonsterId}/effect")
    public ResponseEntity<MonsterEffectResponseDto> triggerMonsterEffect(
            @PathVariable Long userMonsterId) {

        return ResponseEntity.ok(
                userMonsterService.triggerMonsterEffect(userMonsterId)
        );
    }

    @PatchMapping("/user-monsters/{userMonsterId}/evolve")
    public ResponseEntity<EvolveResponseDto> evolveMonster(@PathVariable Long userMonsterId) {
        return ResponseEntity.ok(userMonsterService.evolveMonster(userMonsterId));
    }

    @PatchMapping("/users/me/active-monster")
    public ResponseEntity<Void> changeActiveMonster(@RequestBody ActiveMonsterRequestDto request) {
        Long dummyUserId = 1L;
        userMonsterService.changeActiveMonster(dummyUserId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user-monsters/{userMonsterId}/feed")
    public ResponseEntity<MonsterFeedResponseDto> feedMonster(
            @PathVariable Long userMonsterId
    ) {
        return ResponseEntity.ok(
                userMonsterService.feedMonster(userMonsterId)
        );
    }
}