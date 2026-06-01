package webket_monster.backend.usermonster.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    /** 프론트 getInventory()가 사용하는 엔드포인트: 유저의 보유 몬스터 전체 목록 */
    @GetMapping("/user-monsters/user/{userId}")
    public ResponseEntity<java.util.List<UserMonsterResponseDto>> getUserInventory(
            @PathVariable Long userId) {
        return ResponseEntity.ok(userMonsterService.getUserInventory(userId));
    }

    @PostMapping("/user-monsters/{userMonsterId}/levelup")
    public ResponseEntity<LevelUpResponseDto> levelUpMonster(@PathVariable Long userMonsterId) {
        return ResponseEntity.ok(userMonsterService.levelUpMonster(userMonsterId));
    }

    @PostMapping("/user-monsters/{userMonsterId}/action")
    public ResponseEntity<MonsterActionResponseDto> triggerMonsterAction(
            @PathVariable Long userMonsterId
    ) {
        return ResponseEntity.ok(
                userMonsterService.triggerMonsterAction(userMonsterId)
        );
    }

    @PostMapping("/user-monsters/{userMonsterId}/effect")
    public ResponseEntity<MonsterEffectResponseDto> triggerMonsterEffect(
            @PathVariable Long userMonsterId
    ) {
        return ResponseEntity.ok(
                userMonsterService.triggerMonsterEffect(userMonsterId)
        );
    }

    @PostMapping("/user-monsters/{userMonsterId}/effect/clear")
    public ResponseEntity<Void> clearMonsterEffect(
            @PathVariable Long userMonsterId) {

        userMonsterService.clearMonsterEffect(userMonsterId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/user-monsters/{userMonsterId}/evolve")
    public ResponseEntity<EvolveResponseDto> evolveMonster(@PathVariable Long userMonsterId) {
        return ResponseEntity.ok(userMonsterService.evolveMonster(userMonsterId));
    }

    @PatchMapping("/users/me/active-monster")
    public ResponseEntity<Void> changeActiveMonster(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody ActiveMonsterRequestDto request) {
        Long targetUserId = (userId != null) ? userId : 1L;
        userMonsterService.changeActiveMonster(targetUserId, request);
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