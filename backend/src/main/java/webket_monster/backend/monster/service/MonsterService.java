package webket_monster.backend.monster.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.monster.domain.Monster;
import webket_monster.backend.monster.dto.MonsterSpawnResponseDto;
import webket_monster.backend.monster.repository.MonsterRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonsterService {

    private final MonsterRepository monsterRepository;

    @Transactional(readOnly = true)
    public MonsterSpawnResponseDto spawnMonster() {
        Monster monster = monsterRepository.findById(1L)
                .orElseThrow(() -> new EntityNotFoundException("몬스터를 찾을 수 없습니다."));

        return new MonsterSpawnResponseDto(
                monster.getId(),
                monster.getName(),
                monster.getType(),
                monster.getBaseLevel(),
                monster.getImageUrl()
        );
    }

    @Transactional(readOnly = true)
    public List<MonsterSpawnResponseDto> getAllMonsters() {
        return monsterRepository.findAll().stream()
                .map(m -> new MonsterSpawnResponseDto(
                        m.getId(),
                        m.getName(),
                        m.getType(),
                        m.getBaseLevel(),
                        m.getImageUrl()
                )).collect(Collectors.toList());
    }
}