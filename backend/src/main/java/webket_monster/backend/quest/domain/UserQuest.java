package webket_monster.backend.quest.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import webket_monster.backend.user.domain.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "quest_id"})
        }
)
public class UserQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quest_id")
    private Quest quest;

    private int progress;

    private boolean completed;

    private boolean rewarded;

    public UserQuest(User user, Quest quest) {
        this.user = user;
        this.quest = quest;
        this.progress = 0;
        this.completed = false;
        this.rewarded = false;
    }

    public void updateProgress(int progress) {
        this.progress = Math.min(progress, quest.getTargetCount());

        if (this.progress >= quest.getTargetCount()) {
            this.completed = true;
        }
    }

    public void increaseProgress(int amount) {
        if (completed) {
            return;
        }

        this.progress += amount;

        if (this.progress >= quest.getTargetCount()) {
            this.progress = quest.getTargetCount();
            this.completed = true;
        }
    }

    public void receiveReward() {
        if (!completed) {
            throw new IllegalStateException("아직 완료되지 않은 퀘스트입니다.");
        }

        if (rewarded) {
            throw new IllegalStateException("이미 보상을 수령한 퀘스트입니다.");
        }

        this.rewarded = true;
    }
}