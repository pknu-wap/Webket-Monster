package webket_monster.backend.service;

import webket_monster.backend.dto.EvolveResponseDto;
import webket_monster.backend.dto.LevelUpResponseDto;
import webket_monster.backend.dto.UserMonsterResponseDto;
import org.springframework.stereotype.Service;

@Service
public class UserMonsterService {

    public UserMonsterResponseDto getUserMonsterInfo(Long userMonsterId) {
        // dummy implementation: "해당 몬스터의 특성, 레벨, 경험치, 진화정보 등을 보여준다."
        return new UserMonsterResponseDto(
                userMonsterId,
                1L, // monsterId
                "Slime",
                "A bit sticky.",
                5, // level
                150, // exp
                200, // requiredExpForNextLevel
                "Evolves into King Slime at level 10" // evolutionInfo
        );
    }

    public LevelUpResponseDto levelUpMonster(Long userMonsterId) {
        // dummy implementation: "레벨이 늘어날 수록 exp는 감소, 레벨업에 필요한 경험치는 늘어나게하기"
        return new LevelUpResponseDto(
                userMonsterId,
                6, // currentLevel
                0, // exp naturally goes down to 0 or remainder after level up
                300, // requiredExpForNextLevel increases
                true,
                "Level up to 6!"
        );
    }

    public EvolveResponseDto evolveMonster(Long userMonsterId) {
        // dummy implementation: "그냥 user-monster 객체에 있는 monster_id를 다음 진화 몬스터로 수정"
        return new EvolveResponseDto(
                userMonsterId,
                1L, // preEvolutionMonsterId
                2L, // postEvolutionMonsterId (e.g. King Slime)
                "King Slime",
                "Successfully evolved!"
        );
    }
}
