package com.helpdesk.mapper;

import com.helpdesk.model.dto.auth.UserResponseDTO;
import com.helpdesk.model.entities.User;

public class UserMapper {
    public static UserResponseDTO toDTO(User user, String token){
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }
}
