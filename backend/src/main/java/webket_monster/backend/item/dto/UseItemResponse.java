package webket_monster.backend.item.dto;

import lombok.Builder;
import lombok.Getter;
import webket_monster.backend.item.entity.Item;

@Getter
@Builder
public class UseItemResponse {

    private Long itemId;
    private String name;
    private EffectType effectType;
    private Integer value;

    public static UseItemResponse from(Item item) {
        return UseItemResponse.builder()
                .itemId(item.getId())
                .name(item.getName())
                .effectType(item.getEffectType())
                .value(item.getItemValue())
                .build();
    }
}