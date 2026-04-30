package webket_monster.backend.usermonster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonsterActionResponseDto {

    private Long userMonsterId;
    private String actionResult;
}