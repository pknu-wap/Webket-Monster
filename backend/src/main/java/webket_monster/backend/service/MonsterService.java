package webket_monster.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.domain.Monster;
import webket_monster.backend.repository.MonsterRepository;
import webket_monster.backend.domain.User;
import webket_monster.backend.domain.UserMonster;
import webket_monster.backend.repository.UserMonsterRepository;
import webket_monster.backend.repository.UserRepository;
import webket_monster.backend.dto.MonsterApiDto;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MonsterService {

    private final UserRepository userRepository;
    private final MonsterRepository monsterRepository;
    private final UserMonsterRepository userMonsterRepository;

    @Transactional
    public MonsterApiDto.CatchResponse catchMonster(Long userId, Long monsterId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new RuntimeException("Monster not found"));

        Optional<UserMonster> existingUserMonster = userMonsterRepository.findByUserIdAndMonsterId(userId, monsterId);

        boolean isDuplicate = existingUserMonster.isPresent();
        int addedExp = 50; // 기본 제공 경험치
        UserMonster currentMonster;

        if (isDuplicate) {
            currentMonster = existingUserMonster.get();
            currentMonster.addExp(addedExp);
        } else {
            currentMonster = UserMonster.builder()
                    .user(user)
                    .monster(monster)
                    .build();
            userMonsterRepository.save(currentMonster);
        }

        return MonsterApiDto.CatchResponse.builder()
                .message("포획 성공!")
                .isDuplicate(isDuplicate)
                .addedExp(isDuplicate ? addedExp : 0)
                .currentMonster(MonsterApiDto.CurrentMonster.builder()
                        .id(currentMonster.getId())
                        .level(currentMonster.getLevel())
                        .exp(currentMonster.getExp())
                        .build())
                .build();
    }
}
