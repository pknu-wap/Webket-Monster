package webket_monster.backend.usermonster.dto;

import java.time.LocalDateTime;

public record MonsterFeedResponseDto(
        Long userMonsterId,
        LocalDateTime nextHungryAt,
        String message,
        String triggeredAction
) {
}