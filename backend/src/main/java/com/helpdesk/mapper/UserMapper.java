package com.helpdesk.mapper;

import com.helpdesk.model.dto.auth.AuthResponseDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.dto.user.UserFullDTO;
import com.helpdesk.model.dto.user.UserPublicDTO;
import com.helpdesk.model.dto.user.UserResponseDTO;
import com.helpdesk.model.dto.user.UserSummaryDTO;
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

    public static UserPublicDTO toPublicDTO(User user) {
        return UserPublicDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .role(user.getRole().name())
                .joinedAt(user.getCreatedAt().toLocalDate().toString())
                .build();
    }

    public static UserSummaryDTO toSummaryDTO(User user, int created, int resolved) {
        return UserSummaryDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .joinedAt(user.getCreatedAt().toLocalDate().toString())
                .ticketsCreated(created)
                .ticketsResolved(resolved)
                .build();
    }

    public static UserFullDTO toFullDTO(User user, int created, int resolved, boolean canEdit) {
        return UserFullDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .joinedAt(user.getCreatedAt().toLocalDate().toString())
                .ticketsCreated(created)
                .ticketsResolved(resolved)
                .canEdit(canEdit)
                .build();
    }
}