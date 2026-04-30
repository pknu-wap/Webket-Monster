package webket_monster.backend.monster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.monster.dto.CatchMonsterRequestDto;
import webket_monster.backend.monster.dto.CatchMonsterResponseDto;
import webket_monster.backend.monster.repository.MonsterRepository;
import webket_monster.backend.monster.repository.UserMonsterRepository;

@Service
@RequiredArgsConstructor
public class MonsterService {

    private final MonsterRepository monsterRepository;
    private final UserMonsterRepository userMonsterRepository;

    @Transactional
    public CatchMonsterResponseDto catchMonster(CatchMonsterRequestDto request) {
        // TODO: Validate monster id using monsterRepository.findById()
        // TODO: Check if user already has this monster using userMonsterRepository.findByUserAndMonster()
        // TODO: If yes -> add exp, If no -> save new UserMonster entity.

        // 더미 데이터 반환 (뼈대)
        CatchMonsterResponseDto.CurrentMonsterDto monsterDto = 
            new CatchMonsterResponseDto.CurrentMonsterDto(5L, 2, 150);
            
        return new CatchMonsterResponseDto("포획 성공!", true, 50, monsterDto);
    }
}
