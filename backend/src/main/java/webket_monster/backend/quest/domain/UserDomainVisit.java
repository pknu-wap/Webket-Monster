package webket_monster.backend.quest.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_domain_visits")
public class UserDomainVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String domain;

    @Column(nullable = false)
    private Integer visitCount = 0;

    @Builder
    public UserDomainVisit(Long userId, String domain, Integer visitCount) {
        this.userId = userId;
        this.domain = domain;
        if (visitCount != null) this.visitCount = visitCount;
    }

    public void incrementCount() {
        this.visitCount++;
    }
}
