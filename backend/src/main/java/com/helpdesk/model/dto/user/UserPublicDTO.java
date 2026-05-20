package com.helpdesk.model.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserPublicDTO {
    private Long id;
    private String name;
    private String role;
    private String joinedAt;
}
