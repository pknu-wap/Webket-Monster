package webket_monster.backend.quest.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private QuestType questType;

    private int targetCount;

    @Enumerated(EnumType.STRING)
    private RewardType rewardType;

    private int rewardAmount;

    public Quest(
            String title,
            String description,
            QuestType questType,
            int targetCount,
            RewardType rewardType,
            int rewardAmount
    ) {
        this.title = title;
        this.description = description;
        this.questType = questType;
        this.targetCount = targetCount;
        this.rewardType = rewardType;
        this.rewardAmount = rewardAmount;
    }
}