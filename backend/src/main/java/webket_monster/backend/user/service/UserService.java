package webket_monster.backend.user.service;

import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.dto.MyInfoResponseDto;
import webket_monster.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public MyInfoResponseDto getMyInfo(Long userId) {
        // Get user information from repository using userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        
        // TODO: Fetch user's monsters and items from UserMonster/UserItem associations
        // Setup dummy data for now until Monster, Item domains are fully linked
        List<MyInfoResponseDto.MonsterDto> dummyMonsters = List.of(
            new MyInfoResponseDto.MonsterDto(1L, "피카츄"),
            new MyInfoResponseDto.MonsterDto(2L, "파이리")
        );
        
        List<MyInfoResponseDto.ItemDto> dummyItems = List.of(
            new MyInfoResponseDto.ItemDto(1L, "몬스터볼"),
            new MyInfoResponseDto.ItemDto(2L, "상처약")
        );

        return new MyInfoResponseDto(user.getId(), user.getNickname(), dummyMonsters, dummyItems);
    }
}
