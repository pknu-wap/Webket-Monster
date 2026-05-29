package webket_monster.backend.sitevisit.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import webket_monster.backend.sitevisit.dto.SiteVisitRequestDto;
import webket_monster.backend.sitevisit.dto.SiteVisitResponseDto;
import webket_monster.backend.sitevisit.service.SiteVisitService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class SiteVisitController {

    private final SiteVisitService siteVisitService;

    @PostMapping("/visit-site")
    public SiteVisitResponseDto visitSite(@Valid @RequestBody SiteVisitRequestDto requestDto) {
        Long userId = 1L; // TODO: 로그인 구현 후 인증 유저 ID로 교체
        return siteVisitService.recordVisit(userId, requestDto);
    }
}