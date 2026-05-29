package webket_monster.backend.user.service;

import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.dto.MyInfoResponseDto;
import webket_monster.backend.user.repository.UserRepository;
import webket_monster.backend.usermonster.repository.UserMonsterRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMonsterRepository userMonsterRepository;

    @Transactional(readOnly = true)
    public MyInfoResponseDto getMyInfo(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found: " + userId));

        List<MyInfoResponseDto.MonsterDto> monsters =
                userMonsterRepository.findByUserId(userId)
                        .stream()
                        .map(userMonster ->
                                new MyInfoResponseDto.MonsterDto(
                                        userMonster.getId(),
                                        userMonster.getMonster().getName()
                                )
                        )
                        .toList();

        return new MyInfoResponseDto(
                user.getId(),
                user.getNickname(),
                user.getEvolutionStoneCount(),
                user.getExpPotionCount(),
                monsters
        );
    }
}