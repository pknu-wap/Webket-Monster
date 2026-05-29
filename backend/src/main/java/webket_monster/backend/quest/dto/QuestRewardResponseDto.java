package webket_monster.backend.quest.dto;

import lombok.Builder;
import lombok.Getter;
import webket_monster.backend.quest.domain.UserQuest;

@Getter
@Builder
public class QuestRewardResponseDto {

    private Long questId;
    private String questTitle;
    private String rewardType;
    private int rewardAmount;
    private String message;

    public static QuestRewardResponseDto from(UserQuest userQuest) {
        return QuestRewardResponseDto.builder()
                .questId(userQuest.getQuest().getId())
                .questTitle(userQuest.getQuest().getTitle())
                .rewardType(userQuest.getQuest().getRewardType().name())
                .rewardAmount(userQuest.getQuest().getRewardAmount())
                .message("퀘스트 보상을 수령했습니다.")
                .build();
    }
}