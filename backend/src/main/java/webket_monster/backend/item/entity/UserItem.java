package webket_monster.backend.item.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false)
    private Integer position;

    public static UserItem of(Long userId, Item item, Integer position) {
        UserItem userItem = new UserItem();
        userItem.userId = userId;
        userItem.item = item;
        userItem.position = position;
        return userItem;
    }

    public void updatePosition(Integer position) {
        this.position = position;
    }
}
