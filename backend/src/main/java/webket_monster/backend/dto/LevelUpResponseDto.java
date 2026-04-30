package webket_monster.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LevelUpResponseDto {
    private Long userMonsterId;
    private int currentLevel;
    private int currentExp;
    private int requiredExpForNextLevel;
    private boolean isLevelUpSuccessful;
    private String message;
}
