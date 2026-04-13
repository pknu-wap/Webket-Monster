package webket_monster.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.user.domain.User;
import webket_monster.backend.user.dto.LoginRequestDto;
import webket_monster.backend.user.dto.LoginResponseDto;
import webket_monster.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public LoginResponseDto login(LoginRequestDto request) {
        // TODO: Validate Google idToken, extract email/user data
        String extractedEmail = "user@gmail.com"; // dummy extracted email
        String extractedNickname = "지우"; // dummy extracted nickname
        
        // Find existing user by email or create a new user
        User user = userRepository.findByEmail(extractedEmail)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(extractedEmail)
                        .nickname(extractedNickname)
                        .build()));

        // TODO: Generate JWT accessToken
        String dummyToken = "dummy-jwt-token";

        LoginResponseDto.UserDto userDto = new LoginResponseDto.UserDto(user.getId(), user.getEmail());
        return new LoginResponseDto(dummyToken, userDto);
    }
}
