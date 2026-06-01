package webket_monster.backend.usermonster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.monster.domain.Monster;
import webket_monster.backend.monster.dto.CatchMonsterRequestDto;
import webket_monster.backend.monster.dto.CatchMonsterResponseDto;
import webket_monster.backend.monster.repository.MonsterRepository;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.repository.UserRepository;
import webket_monster.backend.usermonster.domain.UserMonster;
import webket_monster.backend.usermonster.dto.*;
import webket_monster.backend.usermonster.repository.UserMonsterRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMonsterService {

    private final UserMonsterRepository userMonsterRepository;
    private final UserRepository userRepository;
    private final MonsterRepository monsterRepository;

    // ─── 몬스터 포획 ───

    @Transactional
    public CatchMonsterResponseDto catchMonster(Long userId, CatchMonsterRequestDto request) {
        Monster monster = monsterRepository.findById(request.getMonsterId())
                .orElseThrow(() -> new IllegalArgumentException("몬스터를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Optional<UserMonster> existing = userMonsterRepository.findByUserId(userId).stream()
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
        }

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
                new CatchMonsterResponseDto.CurrentMonsterDto(monster.getId(), 1, 0)
        );
    }

    // ─── 몬스터 정보 조회 ───

    @Transactional(readOnly = true)
    public UserMonsterResponseDto getUserMonsterInfo(Long userMonsterId) {
        UserMonster userMonster = findUserMonster(userMonsterId);
        return toResponseDto(userMonster);
    }

    @Transactional(readOnly = true)
    public List<UserMonsterResponseDto> getUserInventory(Long userId) {
        return userMonsterRepository.findByUserId(userId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // ─── 레벨업 ───

    @Transactional
    public LevelUpResponseDto levelUpMonster(Long userMonsterId) {
        UserMonster userMonster = findUserMonster(userMonsterId);

        User user = userMonster.getUser();
        if (user.getExpPotions() < 1) {
            throw new IllegalStateException("사용할 수 있는 EXP 물약이 없습니다!");
        }

        user.decrementExpPotions();
        userRepository.save(user);

        userMonster.addExp(100);
        userMonsterRepository.save(userMonster);

        return new LevelUpResponseDto(
                userMonster.getId(),
                userMonster.getLevel(),
                userMonster.getExp(),
                userMonster.getRequiredExpForNextLevel(),
                true,
                "레벨업 처리 완료"
        );
    }

    // ─── 진화 ───

    @Transactional
    public EvolveResponseDto evolveMonster(Long userMonsterId) {
        UserMonster userMonster = findUserMonster(userMonsterId);
        Monster currentMonster = userMonster.getMonster();

        if (currentMonster.getNextEvolutionMonsterId() == null) {
            throw new IllegalStateException("다음 진화 몬스터가 없습니다.");
        }

        Monster nextMonster = monsterRepository.findById(currentMonster.getNextEvolutionMonsterId())
                .orElseThrow(() -> new IllegalArgumentException("다음 진화 몬스터를 찾을 수 없습니다."));

        // 2단계 진화(최종)는 진화의 돌 2개, 1단계 진화는 1개 필요
        int requiredStones = (nextMonster.getNextEvolutionMonsterId() == null) ? 2 : 1;

        User user = userMonster.getUser();
        if (user.getEvolutionStones() < requiredStones) {
            throw new IllegalStateException("진화의 돌이 부족합니다. 필요한 개수: " + requiredStones);
        }

        user.decrementEvolutionStones(requiredStones);
        userRepository.save(user);

        userMonster.evolve(nextMonster);
        userMonsterRepository.save(userMonster);

        return new EvolveResponseDto(
                userMonster.getId(),
                currentMonster.getId(),
                nextMonster.getId(),
                nextMonster.getName(),
                "진화 성공! 진화의 돌 " + requiredStones + "개를 사용했습니다."
        );
    }

    // ─── 먹이주기 ───

    @Transactional
    public MonsterFeedResponseDto feedMonster(Long userMonsterId) {
        UserMonster userMonster = findUserMonster(userMonsterId);

        int levelBefore = userMonster.getLevel();

        // 먹이주기: EXP +2 추가
        userMonster.addExp(2);

        LocalDateTime nextHungryAt = LocalDateTime.now().plusHours(3);
        userMonster.updateHungryAt(nextHungryAt);
        userMonsterRepository.save(userMonster);

        boolean leveledUp = userMonster.getLevel() > levelBefore;
        String msg = leveledUp
                ? "레벨업! Lv." + userMonster.getLevel() + "이 되었습니다! 🎉"
                : "먹이주기가 완료되었습니다. (+2 EXP)";

        return new MonsterFeedResponseDto(
                userMonster.getId(),
                nextHungryAt,
                msg,
                userMonster.getLevel(),
                userMonster.getExp(),
                userMonster.getRequiredExpForNextLevel(),
                leveledUp
        );
    }

    // ─── 몬스터 액션 / 이펙트 ───

    @Transactional
    public MonsterActionResponseDto triggerMonsterAction(Long userMonsterId) {
        UserMonster userMonster = findUserMonster(userMonsterId);

        return new MonsterActionResponseDto(
                userMonster.getId(),
                "몬스터 액션이 발동되었습니다."
        );
    }

    @Transactional
    public MonsterEffectResponseDto triggerMonsterEffect(Long userMonsterId) {
        UserMonster userMonster = resolveMonster(userMonsterId);

        userMonster.triggerEffect();
        userMonsterRepository.save(userMonster);

        return new MonsterEffectResponseDto(
                userMonster.getId(),
                "몬스터 이펙트가 발동되었습니다."
        );
    }

    @Transactional
    public void clearMonsterEffect(Long userMonsterId) {
        UserMonster userMonster = resolveMonster(userMonsterId);

        userMonster.clearPendingEffect();
        userMonsterRepository.save(userMonster);
    }

    // ─── 활성 몬스터 변경 ───

    @Transactional
    public void changeActiveMonster(Long userId, ActiveMonsterRequestDto request) {
        UserMonster userMonster = findUserMonster(request.getUserMonsterId());

        userMonsterRepository.findByUserId(userId)
                .forEach(monster -> monster.changeActive(false));

        userMonster.changeActive(true);
    }

    // ─── Private Helpers ───

    private UserMonster findUserMonster(Long userMonsterId) {
        return userMonsterRepository.findById(userMonsterId)
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));
    }

    /**
     * userMonsterId로 몬스터를 찾되, 없으면 활성 몬스터 또는 첫 번째 몬스터를 반환.
     * triggerMonsterEffect / clearMonsterEffect 에서 사용.
     */
    private UserMonster resolveMonster(Long userMonsterId) {
        Optional<UserMonster> opt = userMonsterRepository.findById(userMonsterId);
        if (opt.isPresent()) return opt.get();

        List<UserMonster> all = userMonsterRepository.findAll();
        if (!all.isEmpty()) {
            return all.stream()
                    .filter(UserMonster::getIsActive)
                    .findFirst()
                    .orElse(all.get(0));
        }
        throw new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다.");
    }

    private UserMonsterResponseDto toResponseDto(UserMonster um) {
        Monster m = um.getMonster();
        String evolutionInfo = m.getNextEvolutionMonsterId() == null
                ? "최종 진화 몬스터입니다."
                : "레벨 " + m.getEvolutionRequiredLevel() + "에 진화 가능합니다.";

        // monsterId: 1,4,7...→stage1 / 2,5,8...→stage2 / 3,6,9...→stage3
        int evolutionStage = (int) (((m.getId() - 1) % 3) + 1);

        return new UserMonsterResponseDto(
                um.getId(),
                m.getId(),
                m.getName(),
                m.getCharacteristics(),
                um.getLevel(),
                um.getExp(),
                um.getRequiredExpForNextLevel(),
                evolutionInfo,
                m.getImageUrl(),
                um.getHasPendingEffect(),
                evolutionStage
        );
    }
}