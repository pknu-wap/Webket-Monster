package webket_monster.backend.item.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.item.dto.AcquireItemRequest;
import webket_monster.backend.item.dto.ReorderItemRequestDto;
import webket_monster.backend.item.dto.UseItemResponse;
import webket_monster.backend.item.entity.Item;
import webket_monster.backend.item.entity.UserItem;
import webket_monster.backend.item.repository.ItemRepository;
import webket_monster.backend.item.repository.UserItemRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;

    /** 아이템 얻기 */
    public void acquireItem(Long userId, AcquireItemRequest request) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "존재하지 않는 아이템입니다. id=" + request.getItemId()));

        int nextPosition = (int) userItemRepository.countByUserId(userId);
        userItemRepository.save(UserItem.of(userId, item, nextPosition));
    }

    /** 아이템 버리기 */
    public void discardItem(Long userId, Long userItemId) {
        UserItem userItem = getOwnedUserItem(userId, userItemId);
        userItemRepository.delete(userItem);
    }

    /** 아이템 사용하기 */
    @Transactional(readOnly = true)
    public UseItemResponse useItem(Long userId, Long userItemId) {
        UserItem userItem = getOwnedUserItem(userId, userItemId);
        return UseItemResponse.from(userItem.getItem());
    }

    /** 아이템 위치 바꾸기 */
    public void reorderItems(Long userId, ReorderItemRequestDto request) {
        request.getItemOrderList().forEach(entry -> {
            UserItem userItem = getOwnedUserItem(userId, entry.getUserItemId());
            userItem.updatePosition(entry.getPosition());
        });
    }

    private UserItem getOwnedUserItem(Long userId, Long userItemId) {
        UserItem userItem = userItemRepository.findById(userItemId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "존재하지 않는 인벤토리 아이템입니다. id=" + userItemId));

        if (!userItem.getUserId().equals(userId)) {
            throw new RuntimeException("본인의 아이템만 접근할 수 있습니다.");
        }
        return userItem;
    }
}