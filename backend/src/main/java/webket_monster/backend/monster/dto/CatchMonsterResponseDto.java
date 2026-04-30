package webket_monster.backend.monster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CatchMonsterResponseDto {

    private String message;
    private Boolean isDuplicate;
    private Integer addedExp;
    private CurrentMonsterDto currentMonster;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentMonsterDto {
        private Long id;
        private Integer level;
        private Integer exp;
    }
}