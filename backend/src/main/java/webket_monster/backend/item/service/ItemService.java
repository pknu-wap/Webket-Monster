package webket_monster.backend.item.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.item.dto.AcquireItemRequest;
import webket_monster.backend.item.dto.UseItemResponse;
import webket_monster.backend.item.entity.Item;
import webket_monster.backend.item.repository.ItemRepository;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.repository.UserRepository;
import webket_monster.backend.usermonster.domain.UserMonster;
import webket_monster.backend.usermonster.repository.UserMonsterRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final UserMonsterRepository userMonsterRepository;

    /** 아이템 얻기 */
    public void acquireItem(Long userId, AcquireItemRequest request) {

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "존재하지 않는 아이템입니다. id=" + request.getItemId()
                ));

        User user = getUser(userId);

        switch (item.getEffectType()) {

            case EXP_BOOST -> user.addExpPotion(1);

            default -> throw new IllegalStateException(
                    "획득할 수 없는 아이템 타입입니다."
            );
        }
    }

    /** 아이템 사용하기 */
    public UseItemResponse useItem(
            Long userId,
            Long itemId,
            Long userMonsterId
    ) {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "존재하지 않는 아이템입니다. id=" + itemId
                ));

        User user = getUser(userId);

        switch (item.getEffectType()) {

            case EXP_BOOST -> {

                if (userMonsterId == null) {
                    throw new IllegalArgumentException(
                            "경험치 물약 사용 시 userMonsterId가 필요합니다."
                    );
                }

                UserMonster userMonster = userMonsterRepository
                        .findById(userMonsterId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "보유한 몬스터를 찾을 수 없습니다. id="
                                                + userMonsterId
                                )
                        );

                if (!userMonster.getUser().getId().equals(userId)) {
                    throw new IllegalStateException(
                            "본인의 몬스터에게만 아이템을 사용할 수 있습니다."
                    );
                }

                user.useExpPotion();
                userMonster.addExp(item.getItemValue());
            }

            default -> throw new IllegalStateException(
                    "사용할 수 없는 아이템 타입입니다."
            );
        }

        return UseItemResponse.from(item);
    }

    /** 퀘스트 보상 지급 */
    public void addQuestReward(
            Long userId,
            String rewardType,
            int amount
    ) {

        User user = getUser(userId);

        switch (rewardType) {

            case "EXP_POTION" ->
                    user.addExpPotion(amount);

            case "EVOLUTION_STONE" ->
                    user.addEvolutionStone(amount);

            default ->
                    throw new IllegalArgumentException(
                            "지원하지 않는 보상 타입입니다: "
                                    + rewardType
                    );
        }
    }

    private User getUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "존재하지 않는 사용자입니다. id="
                                        + userId
                        )
                );
    }
}