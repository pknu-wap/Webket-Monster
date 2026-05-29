package webket_monster.backend.sitevisit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import webket_monster.backend.sitevisit.domain.UserSiteVisit;
import webket_monster.backend.user.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserSiteVisitRepository extends JpaRepository<UserSiteVisit, Long> {

    Optional<UserSiteVisit> findByUserAndSiteName(User user, String siteName);

    List<UserSiteVisit> findByUser(User user);
}