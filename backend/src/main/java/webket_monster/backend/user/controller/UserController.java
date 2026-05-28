package webket_monster.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import webket_monster.backend.user.dto.MyInfoResponseDto;
import webket_monster.backend.user.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // TODO: In the future, fetch userId from SecurityContext (e.g., @AuthenticationPrincipal)
    @GetMapping("/me")
    public ResponseEntity<MyInfoResponseDto> getMyInfo(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        Long targetUserId = (userId != null) ? userId : 1L; 
        MyInfoResponseDto response = userService.getMyInfo(targetUserId);
        return ResponseEntity.ok(response);
    }
}
