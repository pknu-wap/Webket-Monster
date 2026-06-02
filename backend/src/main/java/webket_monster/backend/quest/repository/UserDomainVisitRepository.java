package webket_monster.backend.quest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import webket_monster.backend.quest.domain.UserDomainVisit;

public interface UserDomainVisitRepository extends JpaRepository<UserDomainVisit, Long> {
    List<UserDomainVisit> findByUserId(Long userId);
    Optional<UserDomainVisit> findByUserIdAndDomain(Long userId, String domain);
}
