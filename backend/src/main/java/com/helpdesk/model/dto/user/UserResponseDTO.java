package com.helpdesk.model.dto.user;

import com.helpdesk.model.enums.Role;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}