package webket_monster.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Monster {

    private Long id;
    private String name;
    private String type;
    private String characteristics;
    private int baseLevel;
    
    // 진화 정보 (다음 진화될 몬스터의 ID와 필요 레벨)
    private Long nextEvolutionMonsterId;
    private int evolutionRequiredLevel;

}
