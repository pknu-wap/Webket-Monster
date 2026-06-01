package webket_monster.backend.usermonster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserMonsterResponseDto {

    private Long userMonsterId;
    private Long monsterId;
    private String name;
    private String characteristics;
    private int level;
    private int exp;
    private int requiredExpForNextLevel;
    private String evolutionInfo;
    private String imageUrl;
    private boolean hasPendingEffect;
}