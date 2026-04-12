package webket_monster.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserMonster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monster_id", nullable = false)
    private Monster monster;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
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
