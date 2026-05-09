package com.helpdesk.mapper;

import com.helpdesk.model.dto.auth.AuthResponseDTO;
import com.helpdesk.model.dto.user.UserResponseDTO;
import com.helpdesk.model.entities.User;

public class UserMapper {

    public static AuthResponseDTO toAuthDTO(User user, String token) {
        return AuthResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }

    public static UserResponseDTO toUserDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}