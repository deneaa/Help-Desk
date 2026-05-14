package com.helpdesk.mapper;

import com.helpdesk.model.dto.notification.NotificationResponseDTO;
import com.helpdesk.model.entities.Notification;

public class NotificationMapper {

    public static NotificationResponseDTO toDTO(Notification notification) {
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .redirectUrl(notification.getRedirectUrl())
                .issuedBy(notification.getIssuedBy() != null
                        ? notification.getIssuedBy().getName()
                        : "SYSTEM")
                .createdAt(notification.getCreatedAt())
                .build();
    }
}