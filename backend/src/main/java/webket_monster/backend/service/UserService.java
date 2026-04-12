package webket_monster.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.domain.User;
import webket_monster.backend.repository.UserRepository;
import webket_monster.backend.dto.UserInfoDto;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserInfoDto getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserInfoDto.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .monsters(user.getMonsters().stream()
                        .map(um -> UserInfoDto.MonsterItemDto.builder()
                                .userMonsterId(um.getId())
                                .monsterId(um.getMonster().getId())
                                .name(um.getMonster().getName())
                                .level(um.getLevel())
                                .exp(um.getExp())
                                .build())
                        .collect(Collectors.toList()))
                .items(user.getItems().stream()
                        .map(ui -> UserInfoDto.ItemDto.builder()
                                .userItemId(ui.getId())
                                .itemId(ui.getItem().getId())
                                .name(ui.getItem().getName())
                                .quantity(ui.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
