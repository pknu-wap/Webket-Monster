package webket_monster.backend.quest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SyncActivityRequestDto {
    private String hostname;
    private int feedIncrement;
}
