package webket_monster.backend.monster.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import webket_monster.backend.monster.dto.ActiveMonsterRequestDto;
import webket_monster.backend.monster.service.UserMonsterService;

@RestController
@RequiredArgsConstructor
public class UserMonsterController {

    private final UserMonsterService userMonsterService;

    @PatchMapping("/users/me/active-monster")
    public ResponseEntity<Void> changeActiveMonster(@RequestBody ActiveMonsterRequestDto request) {
        // TODO: Fetch user ID from Security Context
        Long dummyUserId = 1L; 
        
        userMonsterService.changeActiveMonster(dummyUserId, request);
        return ResponseEntity.ok().build();
    }
}
