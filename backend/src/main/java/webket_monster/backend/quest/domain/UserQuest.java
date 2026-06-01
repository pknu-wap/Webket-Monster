package webket_monster.backend.quest.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_quests")
public class UserQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String questId;

    @Column(nullable = false)
    private Integer currentCount = 0;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(nullable = false)
    private Boolean claimed = false;

    /** 일일 퀘스트 보상 마지막 수령 날짜 (날짜 변경 시 자동 초기화용) */
    @Column(name = "last_reset_at")
    private LocalDate lastResetAt;

    @Builder
    public UserQuest(Long userId, String questId, Integer currentCount,
                     Boolean completed, Boolean claimed) {
        this.userId = userId;
        this.questId = questId;
        if (currentCount != null) this.currentCount = currentCount;
        if (completed != null) this.completed = completed;
        if (claimed != null) this.claimed = claimed;
    }

    /** 진행도 설정 (목표 달성 여부 자동 판별) */
    public void updateProgress(int count, int target) {
        this.currentCount = count;
        this.completed = (this.currentCount >= target);
    }

    /** 진행도 증분 (누적) */
    public void incrementProgress(int amount, int target) {
        if (this.completed) return;
        this.currentCount = Math.min(this.currentCount + amount, target);
        this.completed = (this.currentCount >= target);
    }

    /** 보상 수령 */
    public void claim() {
        this.claimed = true;
        this.lastResetAt = LocalDate.now();
    }

    /**
     * 일일 퀘스트 초기화: 마지막 수령일이 오늘 이전이면 초기화.
     * @return 초기화 여부
     */
    public boolean resetIfDailyExpired() {
        if (this.lastResetAt != null && this.lastResetAt.isBefore(LocalDate.now())) {
            this.currentCount = 0;
            this.completed = false;
            this.claimed = false;
            this.lastResetAt = null;
            return true;
        }
        return false;
    }
}
