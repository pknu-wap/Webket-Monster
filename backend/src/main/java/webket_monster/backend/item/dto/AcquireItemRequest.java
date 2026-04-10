package webket_monster.backend.item.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class AcquireItemRequest {

    @NotNull(message = "itemId는 필수입니다.")
    private Long itemId;
}
