package webket_monster.backend.quest.dto;

import lombok.Builder;
import lombok.Getter;
import webket_monster.backend.quest.domain.Quest;

@Getter
@Builder
public class QuestResponseDto {

    private Long questId;
    private String title;
    private String description;
    private String questType;
    private int targetCount;
    private String rewardType;
    private int rewardAmount;

    public static QuestResponseDto from(Quest quest) {
        return QuestResponseDto.builder()
                .questId(quest.getId())
                .title(quest.getTitle())
                .description(quest.getDescription())
                .questType(quest.getQuestType().name())
                .targetCount(quest.getTargetCount())
                .rewardType(quest.getRewardType().name())
                .rewardAmount(quest.getRewardAmount())
                .build();
    }
}