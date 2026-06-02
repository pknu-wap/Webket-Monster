package webket_monster.backend.quest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserQuestResponseDto {
    private String id;
    private String title;
    private String description;
    private String type; // "daily" or "achievement"
    private String category;
    private int targetCount;
    private int currentCount;
    private boolean completed;
    private boolean claimed;
    private RewardDto reward;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RewardDto {
        private int expPotions;
        private int evolutionStones;
    }
}
