package webket_monster.backend.item.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import webket_monster.backend.item.dto.AcquireItemRequest;
import webket_monster.backend.item.dto.ReorderItemRequestDto;
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
            @RequestBody @Valid AcquireItemRequest request) {
        itemService.acquireItem(userId, request);
        return ResponseEntity.ok().build();
    }

    /** DELETE /items/{userItemId} - 아이템 버리기 */
    @DeleteMapping("/{userItemId}")
    public ResponseEntity<Void> discardItem(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long userItemId) {
        itemService.discardItem(userId, userItemId);
        return ResponseEntity.noContent().build();
    }

    /** GET /items/{userItemId}/use - 아이템 사용하기 */
    @GetMapping("/{userItemId}/use")
    public ResponseEntity<UseItemResponse> useItem(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long userItemId) {
        return ResponseEntity.ok(itemService.useItem(userId, userItemId));
    }

    /** PATCH /items/reorder - 아이템 위치 바꾸기 */
    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorderItems(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid ReorderItemRequestDto request) {
        itemService.reorderItems(userId, request);
        return ResponseEntity.ok().build();
    }
}