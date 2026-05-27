package webket_monster.backend.usermonster.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import webket_monster.backend.monster.domain.Monster;
import webket_monster.backend.user.domain.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_monsters")
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
    private Integer level;

    @Column(nullable = false)
    private Integer exp;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(name = "hungry_at")
    private LocalDateTime hungryAt;

    @Builder
    public UserMonster(User user, Monster monster, Integer level, Integer exp, Boolean isActive, LocalDateTime hungryAt) {
        this.user = user;
        this.monster = monster;
        this.level = level;
        this.exp = exp;
        this.isActive = isActive;
        this.hungryAt = hungryAt;
    }

    public int getRequiredExpForNextLevel() {
        return 100 * (level * level);
    }

    public void addExp(int earnedExp) {
        this.exp += earnedExp;

        while (this.exp >= getRequiredExpForNextLevel()) {
            this.exp -= getRequiredExpForNextLevel();
            this.level++;
        }
    }

    public void evolve(Monster nextEvolutionMonster) {
        if (this.monster.getNextEvolutionMonsterId() == null) {
            throw new IllegalStateException("다음 진화 몬스터가 없습니다.");
        }

        if (this.level < this.monster.getEvolutionRequiredLevel()) {
            throw new IllegalStateException("진화 가능 레벨이 아닙니다.");
        }

        this.monster = nextEvolutionMonster;
    }

    public void changeActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void updateHungryAt(LocalDateTime hungryAt) {
        this.hungryAt = hungryAt;
    }
}