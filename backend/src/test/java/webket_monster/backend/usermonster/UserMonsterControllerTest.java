package webket_monster.backend.usermonster;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import webket_monster.backend.global.GlobalExceptionHandler;
import webket_monster.backend.usermonster.controller.UserMonsterController;
import webket_monster.backend.usermonster.dto.*;
import webket_monster.backend.usermonster.service.UserMonsterService;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * UserMonsterController 단위 테스트 (Standalone MockMvc)
 *
 * - @ExtendWith(MockitoExtension.class): Mockito 사용 (Spring 컨텍스트 불필요)
 * - MockMvcBuilders.standaloneSetup(): 컨트롤러만 독립적으로 테스트
 * - @Mock / @InjectMocks: Service를 Mock으로 교체
 *
 * 테스트 대상 API:
 *   1. POST  /user-monsters/{id}/levelup  → 몬스터 레벨업
 *   2. PATCH /user-monsters/{id}/evolve   → 몬스터 진화
 *   3. POST  /user-monsters/{id}/action   → 몬스터 액션 발동
 */
@ExtendWith(MockitoExtension.class)
class UserMonsterControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private UserMonsterService userMonsterService;

    @InjectMocks
    private UserMonsterController userMonsterController;

    @BeforeEach
    void setUp() {
        // 컨트롤러 + GlobalExceptionHandler 만 독립적으로 구성
        mockMvc = MockMvcBuilders
                .standaloneSetup(userMonsterController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    // ────────────────────────────────────────────────────────────────────────
    //  1. 몬스터 레벨업 - POST /user-monsters/{userMonsterId}/levelup
    // ────────────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /user-monsters/{id}/levelup - 몬스터 레벨업 성공")
    void levelUpMonster_success() throws Exception {
        // given: Service가 반환할 응답 DTO 준비
        Long userMonsterId = 1L;
        LevelUpResponseDto responseDto = new LevelUpResponseDto(
                userMonsterId,
                2,       // currentLevel: 레벨업 후 2레벨
                0,       // currentExp: 레벨업 후 exp 초기화
                400,     // requiredExpForNextLevel: 다음 레벨 필요 경험치 (100 * 2^2)
                true,    // levelUpSuccessful
                "레벨업 처리 완료"
        );

        given(userMonsterService.levelUpMonster(userMonsterId)).willReturn(responseDto);

        // when & then: POST 요청 → 200 OK + 응답 필드 검증
        mockMvc.perform(post("/user-monsters/{userMonsterId}/levelup", userMonsterId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userMonsterId").value(userMonsterId))
                .andExpect(jsonPath("$.currentLevel").value(2))
                .andExpect(jsonPath("$.levelUpSuccessful").value(true))
                .andExpect(jsonPath("$.message").value("레벨업 처리 완료"));

        // verify: Service 메서드가 실제로 호출됐는지 확인
        verify(userMonsterService).levelUpMonster(userMonsterId);
    }

    @Test
    @DisplayName("POST /user-monsters/{id}/levelup - 존재하지 않는 몬스터 → 400")
    void levelUpMonster_notFound() throws Exception {
        // given: 존재하지 않는 ID로 요청 시 예외 발생
        Long userMonsterId = 999L;
        given(userMonsterService.levelUpMonster(userMonsterId))
                .willThrow(new IllegalArgumentException("보유한 몬스터를 찾을 수 없습니다."));

        // when & then: GlobalExceptionHandler가 400 Bad Request로 처리
        mockMvc.perform(post("/user-monsters/{userMonsterId}/levelup", userMonsterId))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    // ────────────────────────────────────────────────────────────────────────
    //  2. 몬스터 진화 - PATCH /user-monsters/{userMonsterId}/evolve
    // ────────────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("PATCH /user-monsters/{id}/evolve - 몬스터 진화 성공")
    void evolveMonster_success() throws Exception {
        // given
        Long userMonsterId = 1L;
        EvolveResponseDto responseDto = new EvolveResponseDto(
                userMonsterId,
                10L,            // preEvolutionMonsterId
                20L,            // postEvolutionMonsterId
                "진화 몬스터",   // newMonsterName
                "Successfully evolved!"
        );

        given(userMonsterService.evolveMonster(userMonsterId)).willReturn(responseDto);

        // when & then: PATCH 요청 → 200 OK + 응답 검증
        mockMvc.perform(patch("/user-monsters/{userMonsterId}/evolve", userMonsterId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userMonsterId").value(userMonsterId))
                .andExpect(jsonPath("$.preEvolutionMonsterId").value(10))
                .andExpect(jsonPath("$.postEvolutionMonsterId").value(20))
                .andExpect(jsonPath("$.newMonsterName").value("진화 몬스터"))
                .andExpect(jsonPath("$.message").value("Successfully evolved!"));

        verify(userMonsterService).evolveMonster(userMonsterId);
    }

    @Test
    @DisplayName("PATCH /user-monsters/{id}/evolve - 최종 진화 몬스터 → 400")
    void evolveMonster_alreadyMaxEvolution() throws Exception {
        // given: 최종 진화 몬스터는 더 이상 진화 불가
        Long userMonsterId = 1L;
        given(userMonsterService.evolveMonster(userMonsterId))
                .willThrow(new IllegalStateException("다음 진화 몬스터가 없습니다."));

        // when & then
        mockMvc.perform(patch("/user-monsters/{userMonsterId}/evolve", userMonsterId))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    // ────────────────────────────────────────────────────────────────────────
    //  3. 몬스터 액션 발동 - POST /user-monsters/{userMonsterId}/action
    // ────────────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /user-monsters/{id}/action - 몬스터 액션 발동 성공")
    void triggerMonsterAction_success() throws Exception {
        // given
        Long userMonsterId = 1L;
        MonsterActionResponseDto responseDto = new MonsterActionResponseDto(
                userMonsterId,
                "몬스터 액션이 발동되었습니다."
        );

        given(userMonsterService.triggerMonsterAction(userMonsterId)).willReturn(responseDto);

        // when & then: POST 요청 → 200 OK + 응답 검증
        mockMvc.perform(post("/user-monsters/{userMonsterId}/action", userMonsterId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userMonsterId").value(userMonsterId))
                .andExpect(jsonPath("$.actionResult").value("몬스터 액션이 발동되었습니다."));

        verify(userMonsterService).triggerMonsterAction(userMonsterId);
    }

    @Test
    @DisplayName("POST /user-monsters/{id}/action - 존재하지 않는 몬스터 → 400")
    void triggerMonsterAction_notFound() throws Exception {
        // given
        Long userMonsterId = 999L;
        given(userMonsterService.triggerMonsterAction(userMonsterId))
                .willThrow(new IllegalArgumentException("몬스터를 찾을 수 없습니다."));

        // when & then
        mockMvc.perform(post("/user-monsters/{userMonsterId}/action", userMonsterId))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
