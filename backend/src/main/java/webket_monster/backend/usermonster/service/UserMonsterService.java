package webket_monster.backend.usermonster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.monster.domain.Monster;
import webket_monster.backend.monster.dto.CatchMonsterRequestDto;
import webket_monster.backend.monster.dto.CatchMonsterResponseDto;
import webket_monster.backend.monster.repository.MonsterRepository;
import java.time.LocalDateTime;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.repository.UserRepository;
import webket_monster.backend.usermonster.domain.UserMonster;
import webket_monster.backend.usermonster.dto.*;
import webket_monster.backend.usermonster.repository.UserMonsterRepository;

@Service
@RequiredArgsConstructor
public class UserMonsterService {

    private final UserMonsterRepository userMonsterRepository;
    private final UserRepository userRepository;
    private final MonsterRepository monsterRepository;

    @Transactional
    public CatchMonsterResponseDto catchMonster(Long userId, CatchMonsterRequestDto request) {
        Monster monster = monsterRepository.findById(request.getMonsterId())
                .orElseThrow(() -> new IllegalArgumentException("몬스터를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        java.util.Optional<UserMonster> existing = userMonsterRepository.findByUserId(userId).stream()
                .filter(um -> um.getMonster().getId().equals(monster.getId()))
                .findFirst();

        if (existing.isPresent()) {
            UserMonster um = existing.get();
            um.addExp(5);
            return new CatchMonsterResponseDto(
                    "포획 성공! 경험치가 올랐습니다.",
                    false,
                    um.getExp(),
                    new CatchMonsterResponseDto.CurrentMonsterDto(
                            monster.getId(),
                            um.getLevel(),
                            um.getExp()
                    )
            );
        } else {
            UserMonster newMonster = UserMonster.builder()
                    .user(user)
                    .monster(monster)
                    .level(1)
                    .exp(0)
                    .isActive(false)
                    .hungryAt(LocalDateTime.now().plusHours(3))
                    .build();
            userMonsterRepository.save(newMonster);

            return new CatchMonsterResponseDto(
                    "새로운 몬스터를 포획했습니다!",
                    false,
                    50,
                    new CatchMonsterResponseDto.CurrentMonsterDto(
                            monster.getId(),
                            1,
                            0
                    )
            );
        }
    }

    @Transactional(readOnly = true)
    public UserMonsterResponseDto getUserMonsterInfo(Long userMonsterId) {
        UserMonster userMonster = userMonsterRepository.findById(userMonsterId)
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));

        Monster monster = userMonster.getMonster();

        String evolutionInfo = monster.getNextEvolutionMonsterId() == null
                ? "최종 진화 몬스터입니다."
                : "레벨 " + monster.getEvolutionRequiredLevel() + "에 진화 가능합니다.";

        return new UserMonsterResponseDto(
                userMonster.getId(),
                monster.getId(),
                monster.getName(),
                monster.getCharacteristics(),
                userMonster.getLevel(),
                userMonster.getExp(),
                userMonster.getRequiredExpForNextLevel(),
                evolutionInfo,
                monster.getImageUrl()
        );
    }


    @Transactional
    public LevelUpResponseDto levelUpMonster(Long userMonsterId) {
        UserMonster userMonster = userMonsterRepository.findById(userMonsterId)
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));

        userMonster.addExp(100);

        return new LevelUpResponseDto(
                userMonster.getId(),
                userMonster.getLevel(),
                userMonster.getExp(),
                userMonster.getRequiredExpForNextLevel(),
                true,
                "레벨업 처리 완료"
        );
    }

    @Transactional
    public EvolveResponseDto evolveMonster(Long userMonsterId) {
        UserMonster userMonster = userMonsterRepository.findById(userMonsterId)
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));

        Monster currentMonster = userMonster.getMonster();

        if (currentMonster.getNextEvolutionMonsterId() == null) {
            throw new IllegalStateException("다음 진화 몬스터가 없습니다.");
        }

        Monster nextMonster = monsterRepository.findById(currentMonster.getNextEvolutionMonsterId())
                .orElseThrow(() -> new IllegalArgumentException("다음 진화 몬스터를 찾을 수 없습니다."));

        int requiredStoneCount = getRequiredEvolutionStoneCount(currentMonster);

        userMonster.getUser().useEvolutionStone(requiredStoneCount);

        userMonster.evolve(nextMonster);

        return new EvolveResponseDto(
                userMonster.getId(),
                currentMonster.getId(),
                nextMonster.getId(),
                nextMonster.getName(),
                "진화 성공! 진화의 돌 " + requiredStoneCount + "개를 사용했습니다."
        );
    }

    @Transactional
    public MonsterActionResponseDto triggerMonsterAction(Long userMonsterId) {

        UserMonster userMonster = userMonsterRepository.findById(userMonsterId)
                .orElseThrow(() -> new IllegalArgumentException("몬스터를 찾을 수 없습니다."));

        // TODO: 조건 로직 추가 (예: 레벨, 상태 등)

        String result = "몬스터 액션이 발동되었습니다.";

        return new MonsterActionResponseDto(
                userMonster.getId(),
                result
        );
    }

    @Transactional
    public void changeActiveMonster(Long userId, ActiveMonsterRequestDto request) {
        UserMonster userMonster = userMonsterRepository.findById(request.getUserMonsterId())
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));

        userMonsterRepository.findByUserId(userId)
                .forEach(monster -> monster.changeActive(false));

        userMonster.changeActive(true);
    }

    @Transactional
    public MonsterEffectResponseDto triggerMonsterEffect(Long userMonsterId) {
        UserMonster userMonster = userMonsterRepository.findById(userMonsterId)
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));

        // TODO: 몬스터 이펙트 발동 조건 및 결과 처리 로직 추가 예정

        return new MonsterEffectResponseDto(
                userMonster.getId(),
                "몬스터 이펙트가 발동되었습니다."
        );
    }

    @Transactional
    public MonsterFeedResponseDto feedMonster(Long userMonsterId) {

        UserMonster userMonster = userMonsterRepository.findById(userMonsterId)
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));

        LocalDateTime nextHungryAt =
                LocalDateTime.now().plusHours(3);

        userMonster.updateHungryAt(nextHungryAt);

        return new MonsterFeedResponseDto(
                userMonster.getId(),
                nextHungryAt,
                "먹이주기가 완료되었습니다."
        );
    }

    private int getRequiredEvolutionStoneCount(Monster currentMonster) {
        Integer requiredLevel = currentMonster.getEvolutionRequiredLevel();

        if (requiredLevel == null) {
            throw new IllegalStateException("진화 필요 레벨 정보가 없습니다.");
        }

        if (requiredLevel <= 3) {
            return 1;
        }

        return 2;
    }
}