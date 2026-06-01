package webket_monster.backend.quest.dto;

import lombok.Builder;
import lombok.Getter;
import webket_monster.backend.quest.domain.UserQuest;

@Getter
@Builder
public class UserQuestResponseDto {

    private Long questId;
    private String title;
    private String description;
    private String questType;
    private int progress;
    private int targetCount;
    private boolean completed;
    private boolean rewarded;
    private String rewardType;
    private int rewardAmount;

    public static UserQuestResponseDto from(UserQuest userQuest) {
        return UserQuestResponseDto.builder()
                .questId(userQuest.getQuest().getId())
                .title(userQuest.getQuest().getTitle())
                .description(userQuest.getQuest().getDescription())
                .questType(userQuest.getQuest().getQuestType().name())
                .progress(userQuest.getProgress())
                .targetCount(userQuest.getQuest().getTargetCount())
                .completed(userQuest.isCompleted())
                .rewarded(userQuest.isRewarded())
                .rewardType(userQuest.getQuest().getRewardType().name())
                .rewardAmount(userQuest.getQuest().getRewardAmount())
                .build();
    }
}