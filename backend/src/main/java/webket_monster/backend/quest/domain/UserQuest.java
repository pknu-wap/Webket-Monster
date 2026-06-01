package webket_monster.backend.quest.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Builder
    public UserQuest(Long userId, String questId, Integer currentCount, Boolean completed, Boolean claimed) {
        this.userId = userId;
        this.questId = questId;
        if (currentCount != null) this.currentCount = currentCount;
        if (completed != null) this.completed = completed;
        if (claimed != null) this.claimed = claimed;
    }

    public void updateProgress(int count, int target) {
        this.currentCount = count;
        this.completed = (this.currentCount >= target);
    }

    public void incrementProgress(int amount, int target) {
        if (this.completed) return;
        this.currentCount = Math.min(this.currentCount + amount, target);
        this.completed = (this.currentCount >= target);
    }

    public void claim() {
        this.claimed = true;
    }
}
