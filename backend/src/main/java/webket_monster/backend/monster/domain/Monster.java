package webket_monster.backend.monster.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "monsters")
public class Monster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type;

    private String characteristics;

    @Column(nullable = false)
    private Integer baseLevel;

    private Long nextEvolutionMonsterId;

    private Integer evolutionRequiredLevel;

    @Builder
    public Monster(
            String name,
            String type,
            String characteristics,
            Integer baseLevel,
            Long nextEvolutionMonsterId,
            Integer evolutionRequiredLevel
    ) {
        this.name = name;
        this.type = type;
        this.characteristics = characteristics;
        this.baseLevel = baseLevel;
        this.nextEvolutionMonsterId = nextEvolutionMonsterId;
        this.evolutionRequiredLevel = evolutionRequiredLevel;
    }
}