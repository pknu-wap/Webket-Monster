package webket_monster.backend.controller;

import webket_monster.backend.dto.EvolveResponseDto;
import webket_monster.backend.dto.LevelUpResponseDto;
import webket_monster.backend.dto.UserMonsterResponseDto;
import webket_monster.backend.service.UserMonsterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-monsters")
@RequiredArgsConstructor
public class UserMonsterController {

    private final UserMonsterService userMonsterService;

    // 1. 몬스터 정보 보기
    @GetMapping("/{userMonsterId}")
    public ResponseEntity<UserMonsterResponseDto> getUserMonsterInfo(@PathVariable Long userMonsterId) {
        UserMonsterResponseDto responseDto = userMonsterService.getUserMonsterInfo(userMonsterId);
        return ResponseEntity.ok(responseDto);
    }

    // 3. 몬스터 레벨업
    @PostMapping("/{userMonsterId}/levelup")
    public ResponseEntity<LevelUpResponseDto> levelUpMonster(@PathVariable Long userMonsterId) {
        LevelUpResponseDto responseDto = userMonsterService.levelUpMonster(userMonsterId);
        return ResponseEntity.ok(responseDto);
    }

    // 4. 몬스터 진화
    @PatchMapping("/{userMonsterId}/evolve")
    public ResponseEntity<EvolveResponseDto> evolveMonster(@PathVariable Long userMonsterId) {
        EvolveResponseDto responseDto = userMonsterService.evolveMonster(userMonsterId);
        return ResponseEntity.ok(responseDto);
    }
}
