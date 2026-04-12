package webket_monster.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import webket_monster.backend.dto.MonsterApiDto;
import webket_monster.backend.security.JwtTokenProvider;
import webket_monster.backend.service.MonsterService;

@RestController
@RequestMapping("/monsters")
@RequiredArgsConstructor
public class MonsterController {

    private final MonsterService monsterService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/catch")
    public ResponseEntity<MonsterApiDto.CatchResponse> catchMonster(
            @RequestHeader("Authorization") String token,
            @RequestBody MonsterApiDto.CatchRequest request) {

        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        Long userId = jwtTokenProvider.getUserIdFromToken(actualToken);

        MonsterApiDto.CatchResponse response = monsterService.catchMonster(userId, request.getMonsterId());
        return ResponseEntity.ok(response);
    }
}
