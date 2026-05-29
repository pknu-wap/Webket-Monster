package webket_monster.backend.sitevisit.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SiteVisitResponseDto {

    private String siteName;
    private int visitCount;
    private boolean action1Triggered;
    private String message;
}