package webket_monster.backend.monster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CatchMonsterResponseDto {
    private String message;
    private Boolean isDuplicate;
    private Integer addedExp;
    private CurrentMonsterDto currentMonster;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentMonsterDto {
        private Long id;
        private Integer level;
        private Integer exp;
    }
}
