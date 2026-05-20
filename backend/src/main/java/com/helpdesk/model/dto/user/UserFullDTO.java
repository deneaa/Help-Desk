package com.helpdesk.model.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserFullDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String joinedAt;
    private int ticketsCreated;
    private int ticketsResolved;
    private boolean canEdit;       // calculat server-side
}