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
    private Integer expPotions = 5;

    @Column(nullable = false)
    private Integer evolutionStones = 2;

    @Column(nullable = false)
    private Integer totalFeeds = 0;

    @Column(nullable = false)
    private Integer activeHomeVisits = 0;

    @Builder
    public User(String email, String nickname, Integer expPotions, Integer evolutionStones,
                Integer totalFeeds, Integer activeHomeVisits) {
        this.email = email;
        this.nickname = nickname;
        if (expPotions != null) this.expPotions = expPotions;
        if (evolutionStones != null) this.evolutionStones = evolutionStones;
        if (totalFeeds != null) this.totalFeeds = totalFeeds;
        if (activeHomeVisits != null) this.activeHomeVisits = activeHomeVisits;
    }

    // ─── 아이템 관련 ───

    /** 퀘스트 보상 등 아이템 일괄 추가 */
    public void addItems(int potions, int stones) {
        this.expPotions += potions;
        this.evolutionStones += stones;
    }

    /** EXP 물약 1개 추가 */
    public void addExpPotion(int count) {
        this.expPotions += count;
    }

    /** EXP 물약 1개 사용 */
    public void useExpPotion() {
        if (this.expPotions <= 0) {
            throw new IllegalStateException("경험치 물약이 부족합니다.");
        }
        this.expPotions--;
    }

    /** EXP 물약 1개 차감 (decrementExpPotions alias) */
    public void decrementExpPotions() {
        useExpPotion();
    }

    /** 진화의 돌 추가 */
    public void addEvolutionStone(int count) {
        this.evolutionStones += count;
    }

    /** 진화의 돌 사용 */
    public void useEvolutionStone(int count) {
        if (this.evolutionStones < count) {
            throw new IllegalStateException("진화의 돌이 부족합니다.");
        }
        this.evolutionStones -= count;
    }

    /** 진화의 돌 차감 (decrementEvolutionStones alias) */
    public void decrementEvolutionStones(int amount) {
        useEvolutionStone(amount);
    }

    // ─── 트리거 관련 ───

    /** 먹이 횟수 증가 */
    public void incrementFeeds() {
        this.totalFeeds++;
    }

    /** 활성 몬스터 홈 방문 횟수 증가 */
    public void incrementActiveHomeVisits() {
        this.activeHomeVisits++;
    }

    /** 활성 몬스터 홈 방문 횟수 초기화 (트리거 발동 후) */
    public void resetActiveHomeVisits() {
        this.activeHomeVisits = 0;
    }
}