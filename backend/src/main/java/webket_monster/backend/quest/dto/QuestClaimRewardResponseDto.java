package webket_monster.backend.quest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestClaimRewardResponseDto {
    private boolean success;
    private String message;
    private int expPotionsReward;
    private int evolutionStonesReward;
}
