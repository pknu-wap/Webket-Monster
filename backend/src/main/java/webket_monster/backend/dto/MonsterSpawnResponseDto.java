package webket_monster.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonsterSpawnResponseDto {
    private Long monsterId;
    private String name;
    private String type;
    private int baseLevel;
}
