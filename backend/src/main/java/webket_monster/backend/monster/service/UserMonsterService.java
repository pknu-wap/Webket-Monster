package webket_monster.backend.monster.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.monster.domain.UserMonster;
import webket_monster.backend.monster.dto.ActiveMonsterRequestDto;
import webket_monster.backend.monster.repository.UserMonsterRepository;

@Service
@RequiredArgsConstructor
public class UserMonsterService {

    private final UserMonsterRepository userMonsterRepository;

    @Transactional
    public void changeActiveMonster(Long userId, ActiveMonsterRequestDto request) {
        // 1. 요청받은 몬스터 조회
        UserMonster userMonster = userMonsterRepository.findById(request.getUserMonsterId())
                .orElseThrow(() -> new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));
                
        // TODO: 권한 검증 로직 추가 (userMonster가 현재 요청한 userId의 것인지 확인)
        
        // TODO: 사용자의 기존 장착 몬스터 상태를 false로 해제하는 로직 추가

        // 2. 새로운 몬스터 장착 상태로 변경 (더티 체킹에 의해 자동 UPDATE)
        userMonster.changeActive(true);
    }
}
