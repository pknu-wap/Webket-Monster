package webket_monster.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvolveResponseDto {
    private Long userMonsterId;
    private Long preEvolutionMonsterId;
    private Long postEvolutionMonsterId;
    private String newMonsterName;
    private String message;
}
