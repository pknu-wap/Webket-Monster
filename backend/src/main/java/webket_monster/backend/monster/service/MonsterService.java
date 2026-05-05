package webket_monster.backend.monster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.monster.domain.Monster;
import webket_monster.backend.monster.dto.MonsterSpawnResponseDto;
import webket_monster.backend.monster.repository.MonsterRepository;

@Service
@RequiredArgsConstructor
public class MonsterService {

    private final MonsterRepository monsterRepository;

    @Transactional(readOnly = true)
    public MonsterSpawnResponseDto spawnMonster() {
        Monster monster = monsterRepository.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException("몬스터를 찾을 수 없습니다."));

        return new MonsterSpawnResponseDto(
                monster.getId(),
                monster.getName(),
                monster.getType(),
                monster.getBaseLevel(),
                monster.getImageUrl()
        );
    }
}