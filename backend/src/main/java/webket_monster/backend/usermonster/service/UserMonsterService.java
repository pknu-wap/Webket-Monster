package webket_monster.backend.usermonster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.monster.domain.Monster;
import webket_monster.backend.monster.dto.CatchMonsterRequestDto;
import webket_monster.backend.monster.dto.CatchMonsterResponseDto;
import webket_monster.backend.monster.repository.MonsterRepository;
import webket_monster.backend.usermonster.domain.UserMonster;
import webket_monster.backend.usermonster.dto.*;
import webket_monster.backend.usermonster.repository.UserMonsterRepository;

@Service
@RequiredArgsConstructor
public class UserMonsterService {

    private final UserMonsterRepository userMonsterRepository;
    private final MonsterRepository monsterRepository;

    @Transactional
    public CatchMonsterResponseDto catchMonster(Long userId, CatchMonsterRequestDto request) {
        Monster monster = monsterRepository.findById(request.getMonsterId())
                .orElseThrow(() -> new IllegalArgumentException("몬스터를 찾을 수 없습니다."));

        // TODO: UserRepository 연결 후 실제 User 조회 필요
        // TODO: 이미 보유한 몬스터면 경험치 추가, 없으면 UserMonster 새로 저장

        return new CatchMonsterResponseDto(
                "포획 성공!",
                false,
                50,
                new CatchMonsterResponseDto.CurrentMonsterDto(
                        monster.getId(),
                        monster.getBaseLevel(),
                        0
                )
        );
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
                evolutionInfo
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

        userMonster.evolve(nextMonster);

        return new EvolveResponseDto(
                userMonster.getId(),
                currentMonster.getId(),
                nextMonster.getId(),
                nextMonster.getName(),
                "Successfully evolved!"
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
}