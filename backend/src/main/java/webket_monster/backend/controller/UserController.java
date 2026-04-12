package webket_monster.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import webket_monster.backend.dto.UserInfoDto;
import webket_monster.backend.security.JwtTokenProvider;
import webket_monster.backend.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getMyInfo(@RequestHeader("Authorization") String token) {
        // 실제로는 Spring Security Filter를 통해 Authentication 객체에서 꺼내는 것이 정석이나
        // 여기서는 간단하게 Header에서 직접 파싱하여 사용합니다.
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        Long userId = jwtTokenProvider.getUserIdFromToken(actualToken);

        UserInfoDto userInfoDto = userService.getMyInfo(userId);
        return ResponseEntity.ok(userInfoDto);
    }
}
