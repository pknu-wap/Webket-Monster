package webket_monster.backend.monster.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import webket_monster.backend.user.domain.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_monsters")
public class UserMonster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monster_id", nullable = false)
    private Monster monster;

    @Column(nullable = false)
    private Integer level;

    @Column(nullable = false)
    private Integer exp;

    @Column(nullable = false)
    private Boolean isActive;

    @Builder
    public UserMonster(User user, Monster monster, Integer level, Integer exp, Boolean isActive) {
        this.user = user;
        this.monster = monster;
        this.level = level;
        this.exp = exp;
        this.isActive = isActive;
    }
    
    // 몬스터 장착 상태 변경 편의 메서드
    public void changeActive(boolean isActive) {
        this.isActive = isActive;
    }
}
