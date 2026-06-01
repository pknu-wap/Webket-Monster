package webket_monster.backend.usermonster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserMonsterResponseDto {

    private Long userMonsterId;
    private Long monsterId;
    private String name;
    private String characteristics;
    private int level;
    private int exp;
    private int requiredExpForNextLevel;
    private String evolutionInfo;
    private String imageUrl;
    private boolean hasPendingEffect;
    /** 진화 단계: 1=기본, 2=1단계 진화, 3=2단계(최종) 진화. monsterId % 3 기준 */
    private int evolutionStage;
}