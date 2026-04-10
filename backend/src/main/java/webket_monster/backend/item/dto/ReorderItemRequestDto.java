package webket_monster.backend.item.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class ReorderItemRequestDto {

    @NotNull(message = "itemOrderList는 필수입니다.")
    @Valid
    private List<ItemOrderEntry> itemOrderList;

    @Getter
    public static class ItemOrderEntry {

        @NotNull(message = "userItemId는 필수입니다.")
        private Long userItemId;

        @NotNull(message = "position은 필수입니다.")
        private Integer position;
    }
}
