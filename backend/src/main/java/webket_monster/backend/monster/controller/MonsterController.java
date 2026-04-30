package webket_monster.backend.monster.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import webket_monster.backend.monster.dto.CatchMonsterRequestDto;
import webket_monster.backend.monster.dto.CatchMonsterResponseDto;
import webket_monster.backend.monster.service.MonsterService;

@RestController
@RequestMapping("/monsters")
@RequiredArgsConstructor
public class MonsterController {

    private final MonsterService monsterService;

    @PostMapping("/catch")
    public ResponseEntity<CatchMonsterResponseDto> catchMonster(@RequestBody CatchMonsterRequestDto request) {
        // TODO: Fetch user ID from Security Context
        CatchMonsterResponseDto response = monsterService.catchMonster(request);
        return ResponseEntity.ok(response);
    }
}
