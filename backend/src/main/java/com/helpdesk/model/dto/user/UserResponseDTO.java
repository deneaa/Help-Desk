package com.helpdesk.model.dto.user;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;
}