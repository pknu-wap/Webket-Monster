package webket_monster.backend.usermonster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LevelUpResponseDto {

    private Long userMonsterId;
    private int currentLevel;
    private int currentExp;
    private int requiredExpForNextLevel;
    private boolean levelUpSuccessful;
    private String message;
}