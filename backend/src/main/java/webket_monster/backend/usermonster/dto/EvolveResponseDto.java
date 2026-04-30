package webket_monster.backend.usermonster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EvolveResponseDto {

    private Long userMonsterId;
    private Long preEvolutionMonsterId;
    private Long postEvolutionMonsterId;
    private String newMonsterName;
    private String message;
}