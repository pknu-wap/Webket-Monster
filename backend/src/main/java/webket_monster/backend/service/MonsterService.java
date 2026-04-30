package webket_monster.backend.service;

import webket_monster.backend.dto.MonsterSpawnResponseDto;
import org.springframework.stereotype.Service;

@Service
public class MonsterService {

    public MonsterSpawnResponseDto spawnMonster() {
        // dummy implementation
        return new MonsterSpawnResponseDto(
                1L,
                "Slime",
                "Water",
                1
        );
    }
}
