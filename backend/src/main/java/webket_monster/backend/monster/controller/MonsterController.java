package webket_monster.backend.monster.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import webket_monster.backend.monster.dto.CatchMonsterRequestDto;
import webket_monster.backend.monster.dto.CatchMonsterResponseDto;
import webket_monster.backend.monster.dto.MonsterSpawnResponseDto;
import webket_monster.backend.usermonster.service.UserMonsterService;
import webket_monster.backend.monster.service.MonsterService;

@RestController
@RequestMapping("/monsters")
@RequiredArgsConstructor
public class MonsterController {

    private final MonsterService monsterService;
    private final UserMonsterService userMonsterService;

    // get all
    @GetMapping
    public ResponseEntity<List<MonsterSpawnResponseDto>> getAllMonsters() {
        return ResponseEntity.ok(monsterService.getAllMonsters());
    }

    // spawn
    @PostMapping("/spawn")
    public ResponseEntity<MonsterSpawnResponseDto> spawnMonster() {
        return ResponseEntity.ok(monsterService.spawnMonster());
    }

    // catch
    @PostMapping("/catch")
    public ResponseEntity<CatchMonsterResponseDto> catchMonster(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody CatchMonsterRequestDto request) {

        Long targetUserId = (userId != null) ? userId : 1L;

        return ResponseEntity.ok(
                userMonsterService.catchMonster(targetUserId, request)
        );
    }
}