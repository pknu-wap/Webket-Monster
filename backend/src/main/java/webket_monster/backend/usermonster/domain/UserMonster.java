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

    /** 먹이를 줄 수 있는 다음 시간 (null이면 즉시 가능) */
    @Column(name = "hungry_at")
    private LocalDateTime hungryAt;

    /** 이펙트 대기 여부 (트리거 발동 시 true) */
    @Column(name = "has_pending_effect", nullable = false)
    private Boolean hasPendingEffect = false;

    @Builder
    public UserMonster(User user, Monster monster, Integer level, Integer exp,
                       Boolean isActive, LocalDateTime hungryAt) {
        this.user = user;
        this.monster = monster;
        this.level = level;
        this.exp = exp;
        this.isActive = isActive;
        this.hungryAt = hungryAt;
        this.hasPendingEffect = false;
    }

    // ─── 이펙트 관련 ───

    /** 이펙트 트리거 (hasPendingEffect = true) */
    public void triggerEffect() {
        this.hasPendingEffect = true;
    }

    /** 이펙트 소비 완료 처리 (hasPendingEffect = false) */
    public void clearPendingEffect() {
        this.hasPendingEffect = false;
    }

    // ─── 성장 관련 ───

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

    // ─── 기타 ───

    public void changeActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void updateHungryAt(LocalDateTime hungryAt) {
        this.hungryAt = hungryAt;
    }
}