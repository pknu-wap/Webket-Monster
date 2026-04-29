package webket_monster.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMonster {

    private Long id;
    private Monster monster; // 어떤 몬스터인지 (연관관계)
    private int level;
    private int exp;

    // 레벨업에 필요한 경험치 계산 (레벨이 늘어날수록 필요 경험치 증가)
    public int getRequiredExpForNextLevel() {
        return 100 * (level * level); 
    }

    // 경험치 획득 및 레벨업 로직
    public void addExp(int earnedExp) {
        this.exp += earnedExp;
        
        // 레벨업 조건 충족 시
        while (this.exp >= getRequiredExpForNextLevel()) {
            this.exp -= getRequiredExpForNextLevel(); // 필요 경험치 차감하고 남은 경험치
            this.level++; // 레벨업
        }
    }

    // 진화 로직: 다음 진화 몬스터로 변경
    public void evolve(Monster nextEvolutionMonster) {
        if (this.level >= this.monster.getEvolutionRequiredLevel()) {
            this.monster = nextEvolutionMonster; // 몬스터 ID(모델) 교체
        } else {
            throw new IllegalStateException("진화 가능 레벨이 아닙니다.");
        }
    }
}
