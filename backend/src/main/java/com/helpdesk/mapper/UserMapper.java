package com.helpdesk.mapper;

import com.helpdesk.model.dto.auth.AuthResponseDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
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
    public static User toEntity(UserRequestDTO dto) {
        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .build();
    }
}