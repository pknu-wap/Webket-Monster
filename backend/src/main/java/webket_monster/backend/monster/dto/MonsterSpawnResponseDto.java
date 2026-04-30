package webket_monster.backend.monster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MonsterSpawnResponseDto {

    private Long monsterId;
    private String name;
    private String type;
    private int baseLevel;

}