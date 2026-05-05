package webket_monster.backend.usermonster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MonsterEffectResponseDto {

    private Long userMonsterId;
    private String effectResult;
}