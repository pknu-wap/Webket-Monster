package webket_monster.backend.user.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyInfoResponseDto {
    private Long id;
    private String nickname;
    private List<MonsterDto> monsters;
    private List<ItemDto> items;
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonsterDto {
        private Long id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemDto {
        private Long id;
        private String name;
    }
}
