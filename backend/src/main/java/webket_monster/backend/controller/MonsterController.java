package webket_monster.backend.controller;

import webket_monster.backend.dto.MonsterSpawnResponseDto;
import webket_monster.backend.service.MonsterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.RequestMapping;
import org.springframework.web.bind.RequestMethod;
import org.springframework.web.bind.RestController;

@RestController
@RequestMapping("/monsters")
@RequiredArgsConstructor
public class MonsterController {

    private final MonsterService monsterService;

    // 2. 몬스터 생성(페이지 이동)
    @RequestMapping(value = "/spawn", method = RequestMethod.POST)
    public ResponseEntity<MonsterSpawnResponseDto> spawnMonster() {
        MonsterSpawnResponseDto response = monsterService.spawnMonster();
        return ResponseEntity.ok(response);
    }
}
