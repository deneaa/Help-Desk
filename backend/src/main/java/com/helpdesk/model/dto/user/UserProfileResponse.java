package com.helpdesk.model.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private String accessLevel;   // "PUBLIC" | "SUMMARY" | "FULL"
    private Object data;          // UserFull | UserPublic | UserSummary
}
