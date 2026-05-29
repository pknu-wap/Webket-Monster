package webket_monster.backend.item.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import webket_monster.backend.item.dto.AcquireItemRequest;
import webket_monster.backend.item.dto.UseItemResponse;
import webket_monster.backend.item.service.ItemService;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    /** POST /items/acquire - 아이템 얻기 */
    @PostMapping("/acquire")
    public ResponseEntity<Void> acquireItem(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid AcquireItemRequest request
    ) {
        itemService.acquireItem(userId, request);
        return ResponseEntity.ok().build();
    }

    /** POST /items/use - 아이템 사용하기 */
    @PostMapping("/use")
    public ResponseEntity<UseItemResponse> useItem(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam Long itemId,
            @RequestParam(required = false) Long userMonsterId
    ) {
        return ResponseEntity.ok(
                itemService.useItem(userId, itemId, userMonsterId)
        );
    }
}