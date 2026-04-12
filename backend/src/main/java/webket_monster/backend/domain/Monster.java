package webket_monster.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Monster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String type;

    @Column
    private String characteristics;

    @Column(nullable = false)
    private int baseLevel;
    
    // 진화 정보 (다음 진화될 몬스터의 ID와 필요 레벨)
    @Column
    private Long nextEvolutionMonsterId;

    @Column(nullable = false)
    private int evolutionRequiredLevel;
}
