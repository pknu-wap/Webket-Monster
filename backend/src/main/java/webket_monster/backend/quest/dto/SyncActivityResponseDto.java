package webket_monster.backend.quest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SyncActivityResponseDto {
    private boolean triggerAction1; // Active home domain 10 visits
    private boolean triggerAction2; // Feeding 10 times
}
