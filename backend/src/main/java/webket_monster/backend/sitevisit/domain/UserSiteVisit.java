package webket_monster.backend.sitevisit.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import webket_monster.backend.user.domain.User;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        name = "user_site_visits",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "site_name"})
        }
)
public class UserSiteVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 유저별 방문 기록
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 방문한 사이트 이름 ex) YOUTUBE, CHATGPT
    @Column(name = "site_name", nullable = false)
    private String siteName;

    @Column(name = "visit_count", nullable = false)
    private int visitCount;

    @Column(name = "last_visited_at", nullable = false)
    private LocalDateTime lastVisitedAt;

    public UserSiteVisit(User user, String siteName) {
        this.user = user;
        this.siteName = siteName;
        this.visitCount = 0;
        this.lastVisitedAt = LocalDateTime.now();
    }

    public void increaseVisitCount() {
        this.visitCount++;
        this.lastVisitedAt = LocalDateTime.now();
    }

    public boolean isAction1Triggered() {
        return this.visitCount % 10 == 0;
    }
}