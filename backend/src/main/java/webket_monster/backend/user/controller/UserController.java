package webket_monster.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import webket_monster.backend.user.dto.MyInfoResponseDto;
import webket_monster.backend.user.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // TODO: In the future, fetch userId from SecurityContext (e.g., @AuthenticationPrincipal)
    @GetMapping("/me")
    public ResponseEntity<MyInfoResponseDto> getMyInfo() {
        // Using dummy user ID 1L for now since security is not fully implemented
        Long dummyUserId = 1L; 
        MyInfoResponseDto response = userService.getMyInfo(dummyUserId);
        return ResponseEntity.ok(response);
    }
}
