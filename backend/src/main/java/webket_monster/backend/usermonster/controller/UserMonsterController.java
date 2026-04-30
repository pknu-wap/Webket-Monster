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

    @PostMapping("/user-monsters/{userMonsterId}/levelup")
    public ResponseEntity<LevelUpResponseDto> levelUpMonster(@PathVariable Long userMonsterId) {
        return ResponseEntity.ok(userMonsterService.levelUpMonster(userMonsterId));
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
}