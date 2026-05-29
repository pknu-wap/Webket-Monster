package webket_monster.backend.sitevisit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SiteVisitRequestDto {

    @NotBlank(message = "사이트 이름은 필수입니다.")
    private String siteName;
}