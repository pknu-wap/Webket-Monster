package webket_monster.backend.quest.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "quests")
public class Quest {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String type; // "daily" or "achievement"

    @Column(nullable = false)
    private String category; // "visit", "catch", "level", "count"

    @Column(nullable = false)
    private Integer targetCount;

    @Column(nullable = false)
    private Integer rewardExpPotions;

    @Column(nullable = false)
    private Integer rewardEvolutionStones;

    @Builder
    public Quest(String id, String title, String description, String type, String category,
                 Integer targetCount, Integer rewardExpPotions, Integer rewardEvolutionStones) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.category = category;
        this.targetCount = targetCount;
        this.rewardExpPotions = rewardExpPotions;
        this.rewardEvolutionStones = rewardEvolutionStones;
    }
}
