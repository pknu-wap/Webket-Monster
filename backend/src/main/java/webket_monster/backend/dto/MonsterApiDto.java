package webket_monster.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class MonsterApiDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CatchRequest {
        private Long monsterId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CatchResponse {
        private String message;
        private boolean isDuplicate;
        private int addedExp;
        private CurrentMonster currentMonster;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentMonster {
        private Long id; // userMonsterId
        private int level;
        private int exp;
    }
}
