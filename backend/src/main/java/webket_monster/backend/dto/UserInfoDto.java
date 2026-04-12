package webket_monster.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Long id;
    private String nickname;
    private List<MonsterItemDto> monsters;
    private List<ItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonsterItemDto {
        private Long userMonsterId;
        private Long monsterId;
        private String name;
        private int level;
        private int exp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDto {
        private Long userItemId;
        private Long itemId;
        private String name;
        private int quantity;
    }
}
