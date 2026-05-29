package webket_monster.backend.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private Integer evolutionStoneCount;

    @Column(nullable = false)
    private Integer expPotionCount;

    @Builder
    public User(String email, String nickname) {
        this.email = email;
        this.nickname = nickname;
        this.evolutionStoneCount = 0;
        this.expPotionCount = 0;
    }

    public void addEvolutionStone(int count) {
        this.evolutionStoneCount += count;
    }

    public void useEvolutionStone(int count) {
        if (this.evolutionStoneCount < count) {
            throw new IllegalStateException("진화의 돌이 부족합니다.");
        }

        this.evolutionStoneCount -= count;
    }

    public void addExpPotion(int count) {
        this.expPotionCount += count;
    }

    public void useExpPotion() {
        if (this.expPotionCount <= 0) {
            throw new IllegalStateException("경험치 물약이 부족합니다.");
        }

        this.expPotionCount--;
    }
}