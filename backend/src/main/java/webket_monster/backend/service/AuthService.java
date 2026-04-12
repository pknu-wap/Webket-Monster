package webket_monster.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import webket_monster.backend.domain.User;
import webket_monster.backend.repository.UserRepository;
import webket_monster.backend.dto.AuthDto;
import webket_monster.backend.security.JwtTokenProvider;

import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // TODO: Change to real Client ID from environments
    private static final String GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";

    @Transactional
    public AuthDto.LoginResponse loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            // Mock bypassing if the idToken is a dummy for tests
            String email;
            if (idTokenString.startsWith("dummy-")) {
                email = idTokenString.substring(6) + "@gmail.com";
            } else {
                GoogleIdToken idToken = verifier.verify(idTokenString);
                if (idToken == null) {
                    throw new RuntimeException("Invalid ID token.");
                }
                GoogleIdToken.Payload payload = idToken.getPayload();
                email = payload.getEmail();
            }

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> createUser(email));

            String accessToken = jwtTokenProvider.createToken(user.getId());
            AuthDto.UserInfo userInfo = new AuthDto.UserInfo(user.getId(), user.getEmail());

            return new AuthDto.LoginResponse(accessToken, userInfo);

        } catch (Exception e) {
            throw new RuntimeException("Google Login Failed", e);
        }
    }

    private User createUser(String email) {
        User newUser = User.builder()
                .email(email)
                .nickname("User_" + UUID.randomUUID().toString().substring(0, 6)) // 임의의 닉네임 생성
                .build();
        return userRepository.save(newUser);
    }
}